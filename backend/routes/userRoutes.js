const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();


router.get('/', userController.getMain);

router.get('/bitcoin-data', userController.getBitcoinData);
router.get('/ethereum-data', userController.getEthereumData);

module.exports = router;