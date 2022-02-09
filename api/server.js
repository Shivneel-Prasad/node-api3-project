const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const usersRouter = require("./users/users-router");

const server = express();

// remember express by default cannot parse JSON in request bodies
server.use(cors())
server.use(express.json());
server.use(morgan('dev'))

// global middlewares and the user's router need to be connected here
server.use("/api/users", usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('*', (req, res) => {
  res.status(404).json({
      status: 404,
      message: 'Not Found',
  })
})

module.exports = server;
