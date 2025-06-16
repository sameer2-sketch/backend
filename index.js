const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const app = express();

const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const supportRoutes = require('./routes/supportRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const configRoutes = require('./routes/configRoutes');

dotenv.config();



app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/food', foodRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/support', supportRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/config', configRoutes);

app.get("/", (req, res) => {
    return res.status(200).send("<h1>Looks good!!</h1>")
})

const PORT = process.env.PORT || 8082;

app.listen(PORT), () => {
    console.log('Server running');
}