const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: true,
      minLength: 2,
      maxLength: 1000,
    },

    date: {
      type: Date,
      require: true,
    },
    place: {
      type: String,
      require: true,
      minLength: 2,
      maxLength: 100,
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
