const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blog')(router);
const masters = require('./routes/master')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err){console.log('can not connect to db: ', err)}
    else{console.log('Connected to db: ' + config.db)}
});
app.use(cors({
    origin:'*'
}))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/client'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);
app.use('/masters', masters);

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname + '/client/dist/client/index.html'));
});

app.listen(8080, ()=>{console.log('Listening 8080')});