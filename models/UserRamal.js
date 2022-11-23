const mongoose = require("mongoose");

const UserRamal = mongoose.model("UserRamal", {
  ramal: { type: Number, required: true },
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  department: { type: String, required: true },
  area: {type: String, require: true},
  company: { type: String, required: true },
  group: {type: String, require: true},
  statusRamal: { type: Boolean, required: true },
});

module.exports = UserRamal;
