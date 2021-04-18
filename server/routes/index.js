const express = require('express');

const user = require('./user')
const item = require('./item')
const bid = require('./bid')

const route = express.Router();

route.use('/user', user);
route.use('/item', item);
route.use('/bid', bid);

module.exports = route