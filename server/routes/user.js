const express = require('express');

const User = require('../handlers/User')

const route = express.Router();

route.post('/', User.createUser);
route.get('/:username', User.getUser);

module.exports = route