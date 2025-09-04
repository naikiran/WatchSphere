const Brand = require('../model/Brand');

const buildPagination = (req) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

exports.create = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = buildPagination(req);
    const filter = {};
    if (req.query.q) {
      filter.name = { $regex: req.query.q, $options: 'i' };
    }

    if (req.query.country) {
      const countries = String(req.query.country)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (countries.length === 1) {
        filter.country = { $regex: `^${countries[0]}$`, $options: 'i' };
      } else if (countries.length > 1) {
        filter.country = { $in: countries };
      }
    }

    const foundedMin = req.query.foundedMin ? parseInt(req.query.foundedMin, 10) : undefined;
    const foundedMax = req.query.foundedMax ? parseInt(req.query.foundedMax, 10) : undefined;
    if (!Number.isNaN(foundedMin) || !Number.isNaN(foundedMax)) {
      const foundedRange = {};
      if (!Number.isNaN(foundedMin)) foundedRange.$gte = foundedMin;
      if (!Number.isNaN(foundedMax)) foundedRange.$lte = foundedMax;
      filter.founded = foundedRange;
    }

    const sort = {};
    if (req.query.sort === 'name_desc') sort.name = -1; else sort.name = 1;

    const [items, total] = await Promise.all([
      Brand.find(filter).sort(sort).skip(skip).limit(limit),
      Brand.countDocuments(filter)
    ]);
    res.json({ items, page, limit, total });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Brand not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const removed = await Brand.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Brand not found' });
    res.json({ message: 'Brand deleted' });
  } catch (err) {
    next(err);
  }
};


