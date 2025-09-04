const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    releaseYear: { type: Number, min: 1900, max: 2100 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', CollectionSchema);


