const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: [true, "Description is required"],
      minLength: [2, "Minimum 2 Characters are required"],
      maxLength: [1000, "Maximum 1000 Characters"],
    },

    date: {
      type: Date,
      require: [true, "description is required"],
    },
    place: {
      type: String,
      require: [true, "Place is required"],
      minLength: [2, "Minimum 2 Characters are required"],
      maxLength: [100, "Maximum 100 Characters"],
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
