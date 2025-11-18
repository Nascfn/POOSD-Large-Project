// index.js
const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");

const { loadEnvFile } = require('node:process');

// Loads environment variables from the default .env file
loadEnvFile();

const {
  connectToMongoDB,
  // users
  findUserByEmail,
  findUserByEmailAndToken,
  createUser,
  getUsers,
  // goals
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  // transactions
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getUserTransactions,
  createPasswordResetRequest,
  findUserByResetToken,
  updateUserPasswordAfterReset,
  // models
  Goal,
} = require("./db.js");

const app = express();
const port = process.env.PORT;
const apiRoute = "/api";
const JWT_SECRET = process.env.JWT_SECRET;

//Middleware

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("common"));
app.use(
  cors({
    origin: process.env.SITE_URL,
    credentials: true,
  })
);

//Helpers

function setAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

function authRequired(req, res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const cookieToken = req.cookies?.token;

    const token = bearer || cookieToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin")
    return res.status(403).json({ error: "Forbidden" });
  next();
}

function requireValidId(paramName = "id") {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[paramName])) {
      return res.status(400).json({ error: `Invalid ${paramName}` });
    }
    next();
  };
}

function generateToken(user) {
    return jwt.sign(
    {
        sub: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
    );
}

// Client app endpoints

app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/index.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/index.html'));
});
app.get('/please-verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/index.html'));
});
app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '/index.html'));
});
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '/index.html'));
});

// Auth

// SIGNUP
app.post(`${apiRoute}/auth/signup`, async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already used" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      passwordHash,
    });

    // JWT token
    const token = generateToken(user);

    setAuthCookie(res, token);

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
app.post(`${apiRoute}/auth/login`, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user);

    setAuthCookie(res, token);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// FORGOT PASSWORD - request reset link
app.post(`${apiRoute}/auth/forgot-password`, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }
    await createPasswordResetRequest(email);

    return res.json({
      message:
        "Password reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res
      .status(500)
      .json({ error: "Failed to process forgot password request" });
  }
});

// RESET PASSWORD - actually change the password using the token
app.post(`${apiRoute}/auth/reset-password`, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body || {};

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const user = await findUserByResetToken(email, code);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired reset link" });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await updateUserPasswordAfterReset({ userId: user._id, passwordHash });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

app.get(`${apiRoute}/auth/verifyemail`, async (req, res) => {
    const { email, code } = req.query || {};
    if (!email || !code)
      return res.status(400).json({ error: "Missing fields" });

    const user = await findUserByEmailAndToken(email, code);
    if (user) {
        await mongoose.model("User").updateOne(
            { _id: user._id },
            {
                $set: { isEmailVerified: true },
                $unset: { emailVerificationToken: ""},
            }
        );
        res.send("Email verified successfully.");
    }
    else {
        res.send("Invalid verification link or email already verified.");
    }
  });
  

// // DELETE MY ACCOUNT
// app.delete(`${apiRoute}/auth/me`, authRequired, async (req, res) => {
//   try {
//     const result = await deleteUserCascade({ userId: req.user.id });

//     res.clearCookie("token");
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete user" });
//   }
// });

// Users + Admin

// list users (admin only)
app.get(`${apiRoute}/admin/users`, authRequired, requireAdmin, async (_, res) => {
  const users = await getUsers();
  res.json(users);
});

// Goals

app.post(`${apiRoute}/goals`, authRequired, async (req, res) => {
  try {
    const { category, amount } = req.body || {};
    if (!category || amount == null)
      return res.status(400).json({ error: "Missing fields" });

    const goal = await createGoal({
      userId: req.user.id,
      category,
      amount,
    });

    res.status(201).json(goal);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ error: "Goal already exists" });
    res.status(500).json({ error: "Failed to create goal" });
  }
});

app.get(`${apiRoute}/goals`, authRequired, async (req, res) => {
  const goals = await getUserGoals(req.user.id);
  res.json(goals);
});

app.patch(
  `${apiRoute}/goals/:goalId`,
  authRequired,
  requireValidId("goalId"),
  async (req, res) => {
    try {
      const patch = {};
      if (req.body.category) patch.category = req.body.category;
      if (req.body.amount != null) patch.amount = Number(req.body.amount);

      const updated = await updateGoal({
        userId: req.user.id,
        goalId: req.params.goalId,
        patch,
      });

      if (!updated) return res.status(404).json({ error: "Goal not found" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update goal" });
    }
  }
);

app.delete(
  `${apiRoute}/goals/:goalId`,
  authRequired,
  requireValidId("goalId"),
  async (req, res) => {
    const ok = await deleteGoal({ userId: req.user.id, goalId: req.params.goalId });
    if (!ok) return res.status(404).json({ error: "Goal not found" });
    res.json({ success: true });
  }
);

// Transactions

// ✅ **LISTAR SÓ DO USUÁRIO LOGADO**
app.get(`${apiRoute}/transactions`, authRequired, async (req, res) => {
  const txs = await getUserTransactions(req.user.id);
  res.json(txs);
});

// ✅ **ADMIN — LISTAR TODAS**
app.get(
  `${apiRoute}/admin/transactions`,
  authRequired,
  requireAdmin,
  async (_, res) => {
    const txs = await getTransactions();
    res.json(txs);
  }
);

// GET by userId (admin or owner only)
app.get(
  `${apiRoute}/users/:userId/transactions`,
  authRequired,
  requireValidId("userId"),
  async (req, res) => {
    if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const txs = await getUserTransactions(req.params.userId);
    res.json(txs);
  }
);

// CREATE
app.post(`${apiRoute}/transactions`, authRequired, async (req, res) => {
  try {
    const { goalId, amount, method, note, date } = req.body || {};
    if (!goalId || amount == null)
      return res.status(400).json({ error: "Missing fields" });

    const goal = await Goal.findOne({ _id: goalId, userId: req.user.id });
    if (!goal) return res.status(400).json({ error: "Invalid goalId" });

    const tx = await createTransaction({
      userId: req.user.id,
      goalId,
      amount,
      method,
      note,
      date,
    });

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// UPDATE
app.patch(
  `${apiRoute}/transactions/:txId`,
  authRequired,
  requireValidId("txId"),
  async (req, res) => {
    try {
      const patch = {};
      if (req.body.goalId) patch.goalId = req.body.goalId;
      if (req.body.amount != null) patch.amount = Number(req.body.amount);
      if (req.body.method) patch.method = req.body.method;
      if (req.body.note) patch.note = req.body.note;
      if (req.body.date) patch.date = new Date(req.body.date);

      const updated = await updateTransaction({
        userId: req.user.id,
        txId: req.params.txId,
        patch,
      });

      if (!updated) return res.status(404).json({ error: "Transaction not found" });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  }
);

// DELETE
app.delete(
  `${apiRoute}/transactions/:txId`,
  authRequired,
  requireValidId("txId"),
  async (req, res) => {
    const ok = await deleteTransaction({ userId: req.user.id, txId: req.params.txId });
    if (!ok) return res.status(404).json({ error: "Transaction not found" });
    res.json({ success: true });
  }
);

/* =========================
   Start Server
   ========================= */
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`🚀 Server running at http://127.0.0.1:${port}`);
});
