const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true, trim: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  date: { type: Date, required: true, default: Date.now },
  remarks: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);