const {getArray} = require('../controllers/paintingController');

const getQuantity = (req,res) => {
    const quantity = getArray();   

    res.json(quantity.length);
};

module.exports = {
    getQuantity
};