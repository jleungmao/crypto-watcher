const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');

//initialize the app
const app = express();
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
};

//set the routes, cors
app.use(cors(corsOptions));
app.use(userRouter);


//start app
app.listen(8080);