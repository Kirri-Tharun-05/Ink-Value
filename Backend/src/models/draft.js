const mongoose = require("mongoose");

const DraftSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
    title: { type: String, required: true }, // Title of the draft
    content: { type: String, required: true }, // Draft content (letter text)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Draft = mongoose.model("Draft", DraftSchema);
module.exports = Draft;