const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#6366f1' },
  targetHours: { type: Number, default: 10 },
  studiedHours: { type: Number, default: 0 },
  examDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
