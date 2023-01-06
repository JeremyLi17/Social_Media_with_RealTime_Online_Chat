const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const conversationRoute = require('./routes/coversations');
const messageRoute = require('./routes/messages');

// config dotenv
dotenv.config();
const app = express();

// initializa mongoDB connection
const connectToMongoDB = () => {
  mongoose.set('strictQuery', false);
  try {
    mongoose.connect(process.env.MONGO_URL, {
      dbName: 'SocialMedia',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    throw error;
  }
};

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// all apis route
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(8800, () => {
  connectToMongoDB();
  console.log('Backend server is running on localhost:8800');
});
