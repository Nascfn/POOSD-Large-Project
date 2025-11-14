const mongoose = require("mongoose");
const {randomBytes} = require('node:crypto');
const {sendEmail} = require('./sendEmail.js');

const uri = process.env.MONGO_URI;

async function connectToMongoDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 20000,
  });
  console.log("✅ Connected to MongoDB");
}

// Schemas and Models

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, index: true },
    passwordHash: String,
    role: { type: String, default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
  },
  { timestamps: true, collection: "users" }
);

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: "goals" }
);
goalSchema.index({ userId: 1, category: 1 }, { unique: true });

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
    amount: Number,
    method: { type: String, enum: ["cash", "card", "bank", "other"], default: "card" },
    note: String,
    date: { type: Date, default: () => new Date() },
  },
  { timestamps: true, collection: "transactions" }
);
transactionSchema.index({ userId: 1, goalId: 1, date: 1 });

const User = mongoose.model("User", userSchema);
const Goal = mongoose.model("Goal", goalSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// Queries

async function findUserByEmail(email) {
    return User.findOne({ email }).lean();
}

async function findUserByEmailAndToken(email, token) {
    return User.findOne({ email, emailVerificationToken: token }).lean();
}

async function createUser({ name, email, passwordHash}) {
  const u = await User.create({
    name,
    email,
    passwordHash,
    role: "user",
    emailVerificationToken: generateRandomString(32),
  });
  if (u) {
    const verifyUrl = `${process.env.SITE_URL}/api/auth/verifyemail?email=${encodeURIComponent(u.email)}&code=${u.emailVerificationToken}`;
    await sendEmail(
      u.email,
      "Welcome to BudgetApp!",
      `<p>Hi ${u.name},</p>
      <p>Thank you for registering at BudgetApp. We're excited to have you on board!</p>
      <p>Please verify your email by clicking on this link: ${verifyUrl}</p>
      <p>Best regards,<br/>The BudgetApp Team</p>`
    );
  }
  return {
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

async function getUsers() {
  return User.find({}, { passwordHash: 0 }).lean();
}

async function createGoal({ userId, category, amount }) {
  return Goal.create({ userId, category, amount });
}
async function getUserGoals(userId) {
  return Goal.find({ userId }).lean();
}
async function updateGoal({ userId, goalId, patch }) {
  return Goal.findOneAndUpdate({ _id: goalId, userId }, { $set: patch }, { new: true }).lean();
}
async function deleteGoal({ userId, goalId }) {
  await Transaction.deleteMany({ userId, goalId });
  const r = await Goal.deleteOne({ _id: goalId, userId });
  return r.deletedCount === 1;
}

async function createTransaction({ userId, goalId, amount, method, note, date }) {
  return Transaction.create({ userId, goalId, amount, method, note, date });
}
async function updateTransaction({ userId, txId, patch }) {
  return Transaction.findOneAndUpdate({ _id: txId, userId }, { $set: patch }, { new: true }).lean();
}
async function deleteTransaction({ userId, txId }) {
  const r = await Transaction.deleteOne({ _id: txId, userId });
  return r.deletedCount === 1;
}

async function getTransactions() {
  return Transaction.find()
    .populate("goalId", "category amount")
    .populate("userId", "name email")
    .lean();
}
async function getUserTransactions(userId) {
  return Transaction.find({ userId })
    .populate("goalId", "category amount")
    .lean();
}

async function deleteUserCascade({ userId }) {
  const tx = await Transaction.deleteMany({ userId });
  const goals = await Goal.deleteMany({ userId });
  const user = await User.deleteOne({ _id: userId });

  return {
    ok: user.deletedCount === 1,
    deleted: {
      user: user.deletedCount,
      goals: goals.deletedCount,
      transactions: tx.deletedCount,
    },
  };
}

function generateRandomString(length) {
    const bytesNeeded = Math.ceil(length/2);
    const randomBytesBuffer = randomBytes(bytesNeeded);
    return randomBytesBuffer.toString('hex').slice(0, length);
}

module.exports = {
  connectToMongoDB,
  User,
  Goal,
  Transaction,
  findUserByEmail,
  findUserByEmailAndToken,
  createUser,
  getUsers,
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getUserTransactions,
  deleteUserCascade,
};
