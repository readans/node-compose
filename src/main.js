require('dotenv').config();
const express = require('express');
const userRoute = require('./routes/user')
const taskRoute = require('./routes/task')

const app = express();

const { PORT } = process.env;

app.set('port', PORT || 3000);

app.use('/user', userRoute);
app.use('/task', taskRoute);

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.listen(app.get('port'), () => {
  console.log(`Server started on port ${app.get('port')}`)
})