const express = require("express");
const router = express.Router();

// Mock dog data
const dogs = [
  { id: 1, name: "Luna", breed: "Golden Retriever", age: 3 },
  { id: 2, name: "Max", breed: "German Shepherd", age: 5 },
  { id: 3, name: "Bella", breed: "Labrador", age: 2 }
];

// Get all dogs
router.get("/", (req, res) => {
  res.json({ dogs });
});

// Adoption endpoint
router.post("/adopt", (req, res) => {
  const { name, email, dogName } = req.body;
  
  if (!name || !email || !dogName) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  res.json({ 
    message: `Thank you ${name}! Your adoption application for ${dogName} has been received.`,
    requestId: req.requestId 
  });
});

module.exports = router;