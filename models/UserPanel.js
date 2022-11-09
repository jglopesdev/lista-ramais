const mongoose = require("mongoose");

const UserPanel = mongoose.model("UserPanel", {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlegth: 6 },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  occupation: { type: String, required: true },
  company: { type: String, required: true },
  statusUser: Boolean,
});

module.exports = UserPanel;
