const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    watchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch', required: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    review: { type: String, required: true },
    wishlist: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);


