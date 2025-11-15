const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendEmail(to, subject, htmlContent) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    html: htmlContent,
  };

  return sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent to', to);
    })
    .catch((error) => {
      console.error('Error sending email to', to, error);
    });
}

module.exports = {
  sendEmail,
};