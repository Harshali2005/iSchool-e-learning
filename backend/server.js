require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://e-learning-frontend.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI || 'mongodb+srv://bagulharshu2005_db_user:H%40123@cluster0.z53ra9k.mongodb.net/elearning?retryWrites=true&w=majority');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/lessons', require('./routes/lessons')); 

app.get('/api/admin/users', (req, res) => {
  const auth = require('./middleware/auth');
  return auth('admin')(req, res, async () => {
    const User = require('./models/User');
    const users = await User.find().select('-password');
    res.json(users);
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
