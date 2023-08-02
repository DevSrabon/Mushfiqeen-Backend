const mongoose = require("mongoose");

const bayanSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: [true, "Description is required"],
      minLength: [1, "Minimum 1 Characters are required"],
    },

    date: {
      type: String,
      require: false,
    },

    place: {
      type: String,
      require: false,
      // minLength: [1, "Minimum 1 Characters are required"],
      // maxLength: [100, "Maximum 100 Characters"],
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
