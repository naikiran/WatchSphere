const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    logo: { type: String, default: '' },
    country: { type: String, trim: true },
    founded: { type: Number, min: 1700, max: 2100 },
    story: { type: String, default: '' },
    officialWebsite: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brand', BrandSchema);


