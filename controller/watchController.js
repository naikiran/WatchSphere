const Watch = require('../model/Watch');

const buildPagination = (req) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '12', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

exports.create = async (req, res, next) => {
  try {
    const watch = await Watch.create(req.body);
    res.status(201).json(watch);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(req);
    const filter = {};
    if (req.query.brandId) filter.brandId = req.query.brandId;
    if (req.query.collectionId) filter.collectionId = req.query.collectionId;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q) filter.watchName = { $regex: req.query.q, $options: 'i' };

    // price range filter
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      const price = {};
      if (!Number.isNaN(minPrice)) price.$gte = minPrice;
      if (!Number.isNaN(maxPrice)) price.$lte = maxPrice;
      filter['price.amount'] = price;
    }

    if (req.query.availability) {
      const allowed = ['in_stock', 'preorder', 'discontinued', 'out_of_stock'];
      const values = String(req.query.availability)
        .split(',')
        .map((v) => v.trim())
        .filter((v) => allowed.includes(v));
      if (values.length === 1) filter.availability = values[0];
      if (values.length > 1) filter.availability = { $in: values };
    }

    const sort = {};
    if (req.query.sort === 'price_asc') sort['price.amount'] = 1;
    if (req.query.sort === 'price_desc') sort['price.amount'] = -1;
    if (req.query.sort === 'name_asc') sort.watchName = 1;
    if (req.query.sort === 'name_desc') sort.watchName = -1;
    if (Object.keys(sort).length === 0) sort.createdAt = -1;

    const [items, total] = await Promise.all([
      Watch.find(filter).sort(sort).skip(skip).limit(limit),
      Watch.countDocuments(filter)
    ]);
    res.json({ items, page, limit, total });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const doc = await Watch.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Watch not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Watch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Watch not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await Watch.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Watch not found' });
    res.json({ message: 'Watch deleted' });
  } catch (err) {
    next(err);
  }
};


