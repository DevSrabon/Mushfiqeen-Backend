const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    user: { type: mongoose.Types.ObjectId, ref: "User" },
    date: {
      type: String,
    },
    lan: {
      type: String,
      enum: ["BN", "EN", "AR"],
      default: "BN",
    },
  },
  {
    timestamps: true,
  }
);

const Bayan = mongoose.model("Bayan", bayanSchema);

module.exports = Bayan;
