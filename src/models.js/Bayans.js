const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },

    date: {
      type: String,
    },
    place: {
      type: String,
    },
    lang: {
      type: String,
      enum: ["BN", "EN", "AR", "FR", "UR"],
      default: "BN",
    },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Bayan = mongoose.model("Bayan", bayanSchema);

module.exports = Bayan;
