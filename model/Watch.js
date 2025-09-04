const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' }
  },
  { _id: false }
);

const WatchSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    watchName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    description: { type: String, default: '' },
    price: { type: PriceSchema, required: true },
    specification: { type: Object, default: {} },
    images: { type: [String], default: [] },
    availability: { type: String, enum: ['in_stock', 'preorder', 'discontinued', 'out_of_stock'], default: 'in_stock' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Watch', WatchSchema);


