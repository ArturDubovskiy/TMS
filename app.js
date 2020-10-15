const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
// const cors = require('cors');

const app = express();

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);

app.use(express.json({ extended: true}));
// app.use(cors());
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks',  require('./routes/tasks.routes'));

if(process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
};

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        await mongoose.connect( process.env.MONGODB_URI || config.get('mongoUri'));
        app.listen(PORT, () => console.log(`App started at port ${PORT}`));
    } catch (e) {
        console.log('Server error', e);
        process.exit(code=1);
    }
}

start();


