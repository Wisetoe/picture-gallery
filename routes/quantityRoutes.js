const express = require('express');
const router = express.Router();

const {getQuantity} = require('../controllers/quantityController');

router.get('/', getQuantity);

module.exports = router;