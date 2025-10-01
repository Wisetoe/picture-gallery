const express = require('express');
const router = express.Router();

const {getPaintings, getPaintingById, getFeatured, getGenre} = require('../controllers/paintingController');
const validateQueryParams = require('../middleware/validateQueryParams');

router.get('/', validateQueryParams ,getPaintings);

router.get('/featured', getFeatured);

router.get('/genre/:genre', getGenre);

router.get('/:id', getPaintingById);

module.exports = router;