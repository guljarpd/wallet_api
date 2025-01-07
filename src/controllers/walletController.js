const {database} = require('../configs');
const {Users, Wallets, Transactions} = require('../models');
const {generateTransactionId} = require('../utils')

// Create a new wallet
const setupWallet = async (req, res) => {
  const { username, name, amount} = req.body;
  try {
    // validate request data
    if (!username) {
        return res.status(400).json({ 
            error: {
                message: 'Error! username required', 
                params: 'username'
            }
        });
    }
    if (!name) {
        return res.status(400).json({ 
            error: {
                message: 'Error! name required', 
                params: 'name'
            }
        });
    }
    if (amount <=0) {
        return res.status(400).json({ 
            error: {
                message: 'Error! Account opening balance should be  $1 or more', 
                params: 'amount'
            }
        });
    }
    // create user entry
    const user = await Users.create({username, name});
    // create initial wallet entry
    const wallet = await Wallets.create({ 
        balance: amount, 
        name: name, 
        user_id: user.id 
    });

    // Create an initial transaction for wallet setup
    const transaction = await Transactions.create({
        wallet_id: wallet.id,
        amount: amount,
        balance: amount,
        description: 'Wallet Setup',
        transaction_type: 'CREDIT',
        transactions_id: generateTransactionId(),
    });

    res.status(201).json({
        name: name,
        username: username,
        wallet_id: wallet.id,
        balance: transaction.balance,
        amount: transaction.amount,
        transactions_id: transaction.transactions_id,
        transaction_type: transaction.transaction_type,
        date: transaction.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: {message: 'Error creating wallet'} });
  }
};

// Get wallet details
const getWalletDetails = async (req, res) => {
  const walletId = req.params.id;
  try {
    const wallet = await Wallets.findOne({
        where: {
            id: walletId,
        },
        include: [{
            model: Users, // join user table for fetching username
            as: 'users',
        }]
    });

    if (!wallet) {
      return res.status(404).json({ error: {message: 'Wallet not found'} });
    }

    res.status(200).json({
        name: wallet.users.name,
        username: wallet.users.username,
        wallet_id: wallet.id,
        balance: wallet.balance,
        date: wallet.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: {message: 'Error fetching wallet details'} });
  }
};

// process the wallet transactions
const processTransaction = async (req, res) => {
    let txn;    
    try {
      const { walletId } = req.params;
      const { amount, description } = req.body;
      // validate request data
      if (!walletId) {
        return res.status(400).json({ 
            error: {
                message: 'Error! walletId required', 
                params: 'walletId'
            }
        });
      }
      if (!amount) {
        return res.status(400).json({ 
            error: {
                message: 'Error! amount required', 
                params: 'amount'
            }
        });
      }
      const transactionType = amount > 0 ? 'CREDIT' : 'DEBIT';

      // Start a transaction
      txn = await database.transaction();
  
      // Lock the wallet row for avoiding race conditions
      const wallet = await Wallets.findOne({
        where: { 
            id: walletId 
        },
        lock: txn.LOCK.UPDATE, // Lock the row for update
        txn,
      });
  
      if (!wallet) {
        await txn.rollback();
        return res.status(404).json({ message: 'Wallet not found' });
      }
  
      // Perform the credit/debit operation
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      
      // Ensure balance doesn't go negative for debit transactions
      if (newBalance < 0) {
        await txn.rollback();
        return res.status(400).json({ message: 'Insufficient balance' });
      }
  
      // Update wallet balance
      await wallet.update({ balance: newBalance }, { transaction: txn });
  
      // add wallet the transaction
      const walletTxn = await Transactions.create({
        wallet_id: wallet.id,
        balance: newBalance,
        amount: amount,
        description: description,
        transaction_type: transactionType,
        transactions_id: generateTransactionId(),
      }, {transaction: txn});
  
      // Commit the transaction
      await txn.commit();
  
      return res.status(200).json({
        wallet_id: wallet.id,
        balance: walletTxn.balance,
        amount: walletTxn.amount,
        transactions_id: walletTxn.transactions_id,
        transaction_type: walletTxn.transaction_type,
        date: walletTxn.created_at,
      });
    } catch (error) {
      console.error(error);
      if (txn && !txn.finished) {
        await txn.rollback();
      }
      return res.status(500).json({error: { message: 'Error processing transaction' }});
    }
}

// Get wallet transactions details
const getTransactions = async (req, res) => {
    try {
      const { walletId, skip = 0, limit = 10 } = req.query;
      const {count, rows} = await Transactions.findAndCountAll({
        where: { wallet_id: parseInt(walletId) },
        offset: parseInt(skip),
        limit: parseInt(limit),
        order: [['created_at', 'DESC']],
        attributes: ['wallet_id', 'balance', 'amount', 'transactions_id', [database.col('created_at'), 'date']]
      });
  
      res.status(200).json({
        totalCount: count,
        transactions: rows,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: {message: 'Error fetching transactions'} });
    }
};

module.exports = { 
    setupWallet, 
    getWalletDetails,
    processTransaction,
    getTransactions,
};
