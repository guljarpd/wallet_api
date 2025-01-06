const express = require('express');
require('dotenv').config();
const {database} = require('./src/configs');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json())


app.listen(PORT, async () => {
    console.log(`Server is running on port: ${PORT}`);
    await database.sync();
});
