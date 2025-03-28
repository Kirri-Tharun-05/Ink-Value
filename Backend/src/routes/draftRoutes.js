const express = require("express");
const Draft = require("../models/draft.js");
const router = express.Router();
const ensureAuth = require("../middleware/auth.js"); // Ensure authentication middleware

// ✅ Save a Draft (Auto-Assign Logged-In User)
router.post("/save", ensureAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user._id; // Get user from session/auth

        const draft = new Draft({ user: userId, title, content });
        await draft.save();

        res.status(201).json({ message: "Draft saved successfully!", draft });
    } catch (error) {
        console.error("Error saving draft:", error);
        res.status(500).json({ error: "Error saving draft" });
    }
});

// ✅ Get All Drafts for Logged-In User
router.get("/", ensureAuth, async (req, res) => {
    try {
        const drafts = await Draft.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json(drafts);
    } catch (error) {
        console.error("Error fetching drafts:", error);
        res.status(500).json({ error: "Error fetching drafts" });
    }
});

// ✅ Get a Single Draft (For Preloading in Editor)
router.get("/:id", ensureAuth, async (req, res) => {
    try {
        const draft = await Draft.findById(req.params.id);
        if (!draft) return res.status(404).json({ error: "Draft not found" });

        res.status(200).json(draft);
    } catch (error) {
        console.error("Error fetching draft:", error);
        res.status(500).json({ error: "Error fetching draft" });
    }
});

// ✅ Update a Draft
router.put("/update/:id", ensureAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        const draft = await Draft.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!draft) return res.status(404).json({ error: "Draft not found" });

        res.status(200).json({ message: "Draft updated successfully!", draft });
    } catch (error) {
        console.error("Error updating draft:", error);
        res.status(500).json({ error: "Error updating draft" });
    }
});

// ✅ Delete a Draft
router.delete("/delete/:id", ensureAuth, async (req, res) => {
    try {
        await Draft.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Draft deleted successfully!" });
    } catch (error) {
        console.error("Error deleting draft:", error);
        res.status(500).json({ error: "Error deleting draft" });
    }
});

module.exports = router;
