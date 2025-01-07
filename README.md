# Wallet Api

This project implements a simple wallet with below functionalities:

- Set up a new wallet with an initial balance.
- Credit and debit transactions.
- Fetch transaction history for a specific wallet.
- Get wallet details.



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


### Run this project
---

**1. System requirement:**

node -v `14.x.x` and above

Database `MySQL`

**2. Clone the code:**

```bash
git clone https://github.com/guljarpd/wallet_api.git
cd wallet_api
```

**3. Install dependencies:**

```bash
npm i
```
**4. Set up the MySQL database:**

```.bash
CREATE DATABASE wallet;
```
and execute the above db scheme query as well.

**5. Setup env:**

Create a `.env` file in the root of the project with below configs

```bash
USER_NAME=<username>
PASSWORD=<password>
HOST=<host>
DATABASE_PORT=<port>
DATABASE=<database name>

PORT=8080
```

**6. Run the application:**

```bash
npm start
```
The server will run on http://127.0.0.1:8080


### Api Endpoints
---

**1. Setup wallet:**

Setup a new wallet with initial balance.

Api: `/setup`

Method: `POST`

Request body:

```json
{   
    "username":"guljar55", 
    "name": "Guljar", 
    "amount": 10.00
}
```

Response:

```json
{
   "name":"Guljar",
   "username":"guljar55",
   "wallet_id":5,
   "balance":10,
   "amount":10,
   "transactions_id":"1736234798188269895",
   "transaction_type":"CREDIT",
   "date":"2025-01-07T07:26:38.188Z"
}
```

**2. Transaction on wallet:**

Debits or Credits the given amount from the wallet with `walletId`.

Api: `/transact/:walletId`

Method: `POST`

eg: `/transact/5`

Request body CREDIT:

```json
{
    "amount": 100.00, 
    "description": "Recharge Wallet"
}
```

Response:

```json
{
   "wallet_id":5,
   "balance":110,
   "amount":100,
   "transactions_id":"1736235147380696015",
   "transaction_type":"CREDIT",
   "date":"2025-01-07T07:32:27.380Z"
}
```

Request body DEBIT:

```json
{
    "amount": -75.1230, 
    "description": "Buy"
}
```

Response:

```json
{
   "wallet_id":5,
   "balance":34.876999999999995,
   "amount":-75.123,
   "transactions_id":"1736235308858473304",
   "transaction_type":"DEBIT",
   "date":"2025-01-07T07:35:08.858Z"
}
```

**3. Transactions History:**

Fetches transaction history for a wallet with `walletId`.

Api: `/transactions?walletId=<walletId>&skip=<Skip>&limit=<Limit>`

Method: `GET`

eg: `/transactions?walletId=5&skip=0&limit=10`

Response:

```json
{
    "totalCount": 3,
    "transactions": [
        {
            "wallet_id": 5,
            "balance": "34.8770",
            "amount": "-75.1230",
            "transactions_id": "1736235308858473304",
            "date": "2025-01-07T07:35:08.000Z"
        },
        {
            "wallet_id": 5,
            "balance": "110.0000",
            "amount": "100.0000",
            "transactions_id": "1736235147380696015",
            "date": "2025-01-07T07:32:27.000Z"
        },
        {
            "wallet_id": 5,
            "balance": "10.0000",
            "amount": "10.0000",
            "transactions_id": "1736234798188269895",
            "date": "2025-01-07T07:26:38.000Z"
        }
    ]
}
```


**4. Wallet Details:**

Fetch wallet details by `walletId`.

Api: `/wallet/:walletId`

Method: `GET`

eg: `/wallet/5`

Response:

```json
{
    "name": "Guljar",
    "username": "guljar55",
    "wallet_id": 5,
    "balance": "34.8770",
    "date": "2025-01-07T07:26:38.000Z"
}
```

