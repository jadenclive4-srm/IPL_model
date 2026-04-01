const express = require('express');
const connectDB = require('./db');

const app = express();
const port = 3001; // Different port from React

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.post('/api/submit-answers', async (req, res) => {
  try {
    console.log('Received submit request:', req.body);
    const db = await connectDB();
    console.log('Connected to DB');
    const collection = db.collection('user_answers');

    const answers = req.body.answers;
    console.log('Answers to insert:', answers);

    // Insert multiple answers
    const result = await collection.insertMany(answers);
    console.log('Insert result:', result);

    res.status(200).json({ message: 'Answers submitted successfully', insertedCount: result.insertedCount });
  } catch (error) {
    console.error('Error saving answers:', error);
    res.status(500).json({ message: 'Failed to save answers', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});