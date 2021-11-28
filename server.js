if (process.env.NODE_ENV!=='production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayout = require('express-ejs-layouts');
const indexRoute = require('./routes/index');


app.set('view engine', 'ejs');
app.set('views',__dirname+'/views');
app.set('layout','layouts/layout');

app.use(expressLayout);
app.use(express.static('public'));
app.use('/',indexRoute);

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on('error', error=>console.error(error));
db.once('open',()=>console.log('Connected to database..'));

app.listen(process.env.PORT || 4000, ()=>{
    console.log("Server is listening on port 4000...");
})