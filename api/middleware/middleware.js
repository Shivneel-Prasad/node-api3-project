const User = require("../users/users-model");

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`${method} to ${url} at [${timestamp}]`);
  next();
}

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.getById(id);
    if (!user) {
      res.status(404).json({
        status: 404,
        message: 'User ID Not Found',
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "There seems to be a problem",
      error: err.message,
    });
  }
  next();
}

function validateUser(req, res, next) {
  const user = req.body;
  if (!user.name || !user.name.trim()) {
    res.status(400).json({
      status: 400,
      message: "Missing required name field",
    });
  } else {
      next();
  }
}

function validatePost(req, res, next) {
  const { text } = req.body
  if (!text || !text.trim()) {
    res.status(400).json({
      status: 400,
      message: 'Missing required text field',
    })
  } else {
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};

