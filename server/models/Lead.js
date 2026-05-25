const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    phone: String,

    company: String,

    status: {
      type: String,
      default: "New",
    },

    notes: [
      {
        text: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Lead",
  leadSchema
);