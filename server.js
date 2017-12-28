var express = require('express');
    app = express();
    server = require('http').createServer(app);
    io=require('socket.io').listen(server);
    usernames=[];

app.get('/', (req, res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.on('connection', (socket)=>{
    console.log('ChatRoom Socket Connected');

    socket.on('new user', (data, callback)=>{
        console.log(data);
        if(usernames.indexOf(data) !== -1){
            callback(false);
        }else{
                callback(true);
                // console.log(socket);
                socket.username=data;
                usernames.push(socket.username);
                updateUsernames();
            }
    });

    //Update User names
    function updateUsernames(){
        io.emit('usernames', usernames);
    }

    //Send Message
    socket.on('send message', (data)=>{
        console.log(data);
        io.emit('new message', { user: socket.username , msg : data});
    });

    //Disconnect
    socket.on('disconnect', (data)=>{
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();

    })
});



app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

