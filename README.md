# Wallet Api



### Database Schema
---

~~~~sql
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE (username)
    );

    CREATE TABLE wallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        balance DECIMAL(11, 4) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_id INT,
        amount DECIMAL(11, 4) NOT NULL,
        balance DECIMAL(11, 4) NOT NULL,
        transactions_id VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        transaction_type ENUM('CREDIT', 'DEBIT') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (wallet_id) REFERENCES wallets(id),
        UNIQUE(transactions_id)
    );
~~~~
