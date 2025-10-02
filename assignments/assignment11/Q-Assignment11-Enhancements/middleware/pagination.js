const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Validate pagination parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ 
      error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100' 
    });
  }

  req.pagination = {
    page,
    limit,
    skip,
    createResponse: (data, total) => ({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    })
  };

  next();
};

module.exports = { paginate };