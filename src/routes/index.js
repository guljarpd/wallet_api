const express = require('express');
const router = express.Router();

const { setupWallet, getWalletDetails, processTransaction, getTransactions } = require('../controllers/walletController');

router.post('/setup/', setupWallet);
router.post('/transact/:walletId', processTransaction);
router.get('/wallet/:id', getWalletDetails);
router.get('/transactions/', getTransactions);

module.exports = router;
