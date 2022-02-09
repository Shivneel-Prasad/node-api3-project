const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const {
  validateUserId,
  validateUser,
  validatePost,
} = require("../middleware/middleware");
const User = require("./users-model");
const Post = require("../posts/posts-model");

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then((allUsers) => {
      res.status(200).json(allUsers);
    })
    .catch(next);
});

router.get('/:id', validateUserId, (req, res, next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params
  User.getById(id)
    .then(confirmUser => {
      res.status(200).json(confirmUser)
    })
    .catch(next)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert(req.body)
    .then((addUser) => {
      res.status(201).json(addUser);
    })
    .catch(next);
});

router.put("/:id", validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const change = req.body;
  User.update(id, change)
    .then(redoUsers => {
      if(redoUsers) {
        res.status(201).json(redoUsers);
      } else {
          res.status(404).json({
            status: 404,
            message: 'User Not Found',
        })
      }
    })    
    .catch(next);
});

router.delete("/:id", validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const { id } = req.params;
    const removeUser = await User.remove(id);
      res.status(200).json(removeUser);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/posts", validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const { id } = req.params;
    const response = await User.getUserPosts(id);
      res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/posts", validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const newPostInfo = {...req.body, user_id: id}
  Post.insert(newPostInfo)
    .then(addNewPost => {
      res.status(201).json(addNewPost)
    })
    .catch(next)
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "Unable to find User",
    message: err.message,
    stack: err.stack,
  });
  next()
});

// do not forget to export the router
module.exports = router;