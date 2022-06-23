const { mongoose, Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
    userName: { type: String },
    owner: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", schema);
