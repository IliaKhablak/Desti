const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const WebSocket = require('ws');
const server = new WebSocket.Server({'server': httpServer});
const Storage = require('@google-cloud/storage');
const storage = new Storage({
    projectId: config.projectId,
    keyFilename: '/home/ilia/code/test/config/DestiAwesomeapplication-c9ca255aa79c.json',
});
const authentication = require('./routes/authentication')(router,server);
const blogs = require('./routes/blog')(router,server);
const masters = require('./routes/master')(router,storage);
const schedule = require('./routes/day')(router,server);
const bodyParser = require('body-parser');
const cors = require('cors');

const port = process.env.PORT || 8080;

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
app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/blogs', blogs);
app.use('/masters', masters);
app.use('/schedule', schedule);
server.on('connection',(ws)=>{
    ws.on('message',message=>{
        server.clients.forEach(client=>{
            // console.log(client)
            if(client.readyState === WebSocket.OPEN){
                client.send(message);
            }
        })
    })
    ws.send(JSON.stringify({type:'message', author:'Ilia',message:'Hello from server'}));
    ws.timer=setInterval(()=>{
        server.clients.forEach(client=>{
            if(client.readyState === WebSocket.OPEN){
                client.send(JSON.stringify({type:'keep alive'}));
            }
        })
    },25000);
});
app.get('/uploads/:id',(req,res)=>{
    res.sendFile(path.join(__dirname + '/uploads/'+req.params['id']));
});
app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

httpServer.listen(port, ()=>{console.log('Listening ' + port)});

