const express = require('express');

const Bid = require('../handlers/Bid')

const route = express.Router();

route.post('/:username', Bid.placeBid);
route.get('/:itemId', Bid.getBids);

module.exports = route