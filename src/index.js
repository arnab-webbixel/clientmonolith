const express = require('express');
const bodyParser = require('body-parser');
const {PORT} = require('./config/server-config');
const clientRoutes = require('./routes/clientRoutes');
const emailRoutes = require('./routes/upload.routes');
const pipelineRoutes = require('./routes/pipeline.routes');
const connectDB = require('./config/db');
const cors = require('cors');
// require('./utils/consumer');

const startAndStop = ()=>{
   try {
    const app = express();
    // app.use(bodyParser.json());
    app.use(express.json());
    app.use(cors({
        origin: ['https://dev.webbixel.com', 'http://localhost:5173', 'http://192.168.0.142:5173'], 
        credentials: true,
    }));

    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use('/api/v1/pipelines', pipelineRoutes);
    app.use('/api/v1/', clientRoutes);
    app.use('/api/v1/email', emailRoutes);
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