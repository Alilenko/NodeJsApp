const { mongoose, Schema, model, Types } = require("mongoose");

const schema = new Schema({
  title: { type: String, required: true },
  text: { type: String },
  owner: { type: Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", schema);
