const sgMail = require("@sendgrid/mail");
require("dotenv").config();
const sgToken = process.env.SG_API_KEY;

const sendMail = async (email, vfToken) => {
  sgMail.setApiKey(sgToken);

  const url = `http://localhost:3000/api/users/verify/${vfToken}`;
  const msg = {
    to: email,
    from: "monixxa90@gmail.com",
    subject: "Verification",
    text: `Your verification token: ${url}`,
    html: "mdjscndjvndhvbfhbvxjh",
  };

  await sgMail.send(msg);
};

module.exports = { sendMail };