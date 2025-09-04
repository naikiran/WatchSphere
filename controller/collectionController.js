const Collection = require('../model/Collection');

const buildPagination = (req) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

exports.create = async (req, res, next) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(req);
    const filter = {};
    if (req.query.brandId) filter.brandId = req.query.brandId;
    if (req.query.q) filter.name = { $regex: req.query.q, $options: 'i' };

    const yearMin = req.query.releaseYearMin ? parseInt(req.query.releaseYearMin, 10) : undefined;
    const yearMax = req.query.releaseYearMax ? parseInt(req.query.releaseYearMax, 10) : undefined;
    if (!Number.isNaN(yearMin) || !Number.isNaN(yearMax)) {
      const yr = {};
      if (!Number.isNaN(yearMin)) yr.$gte = yearMin;
      if (!Number.isNaN(yearMax)) yr.$lte = yearMax;
      filter.releaseYear = yr;
    }

    const sort = {};
    if (req.query.sort === 'name_asc') sort.name = 1;
    if (req.query.sort === 'name_desc') sort.name = -1;
    if (req.query.sort === 'year_asc') sort.releaseYear = 1;
    if (req.query.sort === 'year_desc') sort.releaseYear = -1;
    if (Object.keys(sort).length === 0) sort.createdAt = -1;

    const [items, total] = await Promise.all([
      Collection.find(filter).sort(sort).skip(skip).limit(limit),
      Collection.countDocuments(filter)
    ]);
    res.json({ items, page, limit, total });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const doc = await Collection.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Collection not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Collection not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await Collection.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Collection not found' });
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    next(err);
  }
};


