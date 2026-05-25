const express = require("express");

const router = express.Router();

const Lead = require("../models/Lead");


// GET ALL LEADS
router.get("/", async (req, res) => {

  try {

    const leads = await Lead.find()
      .sort({ createdAt: -1 });

    res.json(leads);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});


// CREATE LEAD
router.post("/", async (req, res) => {

  try {

    const newLead = new Lead(req.body);

    const savedLead =
      await newLead.save();

    res.status(201).json(savedLead);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});


// UPDATE LEAD STATUS
router.put("/:id", async (req, res) => {

  try {

    const updatedLead =
      await Lead.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedLead);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});


// ADD NOTE
router.put("/:id/notes", async (req, res) => {

  try {

    const lead = await Lead.findById(
      req.params.id
    );

    lead.notes.push({
      text: req.body.text,
    });

    await lead.save();

    res.json(lead);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});


// DELETE LEAD
router.delete("/:id", async (req, res) => {

  try {

    await Lead.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Lead deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

module.exports = router;