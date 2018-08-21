const express = require('express');
const app = express();
// const http = require('http');
// const httpServer = http.createServer(app);
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
// const WebSocket = require('ws');
// const server = new WebSocket.Server({'server': httpServer});
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blog')(router);
const masters = require('./routes/master')(router);
const bodyParser = require('body-parser');
// const cors = require('cors');
const port = process.env.PORT || 8080;

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err){console.log('can not connect to db: ', err)}
    else{console.log('Connected to db: ' + config.db)}
});
// app.use(cors({
//     origin:'*'
// }))

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);
app.use('/masters', masters);
// server.on('connection',ws=>{
//     ws.on('message',message=>{
//         server.clients.forEach(client=>{
//             if(client.readyState === WebSocket.OPEN){
//                 client.send(message);
//             }
//         })
//     })
//     ws.send(JSON.stringify({type:'message', author:'Ilia',message:'Hello from server'}));
// })
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(port, ()=>{console.log('Listening ' + port)});