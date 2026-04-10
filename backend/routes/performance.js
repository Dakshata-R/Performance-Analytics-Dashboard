const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    let filter = req.user.role === 'admin' ? {} : { userId: req.user._id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (category) filter.category = category;

    const records = await Performance.find(filter)
      .populate({ path: 'userId', select: 'name email', options: { strictPopulate: false } })
      .sort('-date');

    res.json(records);
  } catch (err) {
    console.error('Performance GET error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/user/:userId', protect, adminOnly, async (req, res) => {
  try {
    const records = await Performance.find({ userId: req.params.userId })
      .populate({ path: 'userId', select: 'name email', options: { strictPopulate: false } })
      .sort('-date');
    res.json(records);
  } catch (err) {
    console.error('Performance user GET error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { userId, category, score, date, remarks } = req.body;
    if (!userId || !category || score === undefined || !date) {
      return res.status(400).json({ message: 'userId, category, score and date are required' });
    }
    const record = await Performance.create({ userId, category, score: Number(score), date, remarks });
    await record.populate({ path: 'userId', select: 'name email', options: { strictPopulate: false } });
    res.status(201).json(record);
  } catch (err) {
    console.error('Performance POST error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const record = await Performance.findByIdAndUpdate(
      req.params.id,
      { ...req.body, score: Number(req.body.score) },
      { new: true }
    ).populate({ path: 'userId', select: 'name email', options: { strictPopulate: false } });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    console.error('Performance PUT error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Performance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    console.error('Performance DELETE error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;