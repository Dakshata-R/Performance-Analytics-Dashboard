const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const records = await Performance.find(filter).populate({ path: 'userId', select: 'name', options: { strictPopulate: false } });

    const totalRecords = records.length;

    if (totalRecords === 0) {
      return res.json({ totalRecords: 0, avgScore: 0, categoryStats: [], monthlyStats: [] });
    }

    const avgScore = (records.reduce((s, r) => s + r.score, 0) / totalRecords).toFixed(1);

    const byCategory = {};
    const byMonth = {};

    for (const r of records) {
      // Category grouping
      const cat = r.category || 'Uncategorized';
      if (!byCategory[cat]) byCategory[cat] = { total: 0, count: 0 };
      byCategory[cat].total += r.score;
      byCategory[cat].count += 1;

      // Month grouping
      const d = r.date ? new Date(r.date) : new Date(r.createdAt);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!byMonth[key]) byMonth[key] = { total: 0, count: 0 };
      byMonth[key].total += r.score;
      byMonth[key].count += 1;
    }

    const categoryStats = Object.entries(byCategory).map(([category, data]) => ({
      category,
      avgScore: (data.total / data.count).toFixed(1),
      count: data.count,
    }));

    const monthlyStats = Object.entries(byMonth).map(([month, data]) => ({
      month,
      avgScore: (data.total / data.count).toFixed(1),
    }));

    res.json({ totalRecords, avgScore, categoryStats, monthlyStats });
  } catch (err) {
    console.error('Reports summary error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;