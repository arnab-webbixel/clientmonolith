const express = require('express');
const bodyParser = require('body-parser');
const {PORT} = require('./config/server-config');
const apiRoutes = require('./routes/clientRoutes');
const connectDB = require('./config/db');
const cors = require('cors');


const startAndStop = ()=>{
   try {
    const app = express();
    // app.use(bodyParser.json());
    app.use(express.json());
    app.use(cors({
        origin: 'https://dev.webbixel.com', 
        credentials: true,
    }));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/api/v1/', apiRoutes),
    connectDB(); 
    app.listen(PORT, ()=>{
        console.log(`Server listening on port ${PORT}`);
    });
   } catch (error) {
    console.error(error);
    process.exit(error);
   }
}

startAndStop();