const express = require('express');
const router = express.Router();
const Note = require('../Models/Note');

// Get all notes
router.get('/', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Add a note
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  const note = new Note({ title, content });
  await note.save();

  // Emit the new note to all clients
  req.app.get('io').emit('noteCreated', note);

  // Return the saved note
  res.json(note);
});

// Update a note
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content, updatedAt: Date.now() },
    { new: true } // return the updated document
  );

  // Emit update
  req.app.get('io').emit('noteUpdated', updatedNote);

  res.json(updatedNote);
});

// Delete a note
router.delete('/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);

  // Emit deletion to all clients
  req.app.get('io').emit('noteDeleted', req.params.id);

  res.json({ success: true });
});

module.exports = router;
