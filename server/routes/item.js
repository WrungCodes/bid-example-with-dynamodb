const express = require('express');

const Item = require('../handlers/Item')

const route = express.Router();

route.get('/all', Item.getItems);
route.post('/:username', Item.createItem);
route.get('/:itemId', Item.getItem);

module.exports = route