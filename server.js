const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {database} = require('./src/configs');
const routers = require('./src/routes');

const PORT = process.env.PORT || 8080;

const app = express();
// Configure CORS to allow all origins 
app.use(cors());
app.use(express.json())

app.use(routers);


app.use('/', (req, res) => {
    return res.status(200).json({
        status: 'ok',
        message: 'Wallet api'
    });
})


app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
    await database.sync();
});
