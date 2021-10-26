const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();


router.get('/', userController.getMain);

router.get('/blockchain-data', userController.getBlockchainData);
router.get('/bittrex-data', userController.getBittrexData);

module.exports = router;