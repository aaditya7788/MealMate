const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  likes: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 }
});

const Statistic = mongoose.model('Statistic', statisticSchema);
module.exports = Statistic;