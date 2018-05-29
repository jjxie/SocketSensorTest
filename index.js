var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var connectedIDArray = [];


// Node serialport
var Serialport = require('serialport');
var myPort = new Serialport("/dev/tty.wchusbserial1420",{
	baudrate: 9600,
	parser: Serialport.parsers.readline("\n")
});


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	console.log('a user connected');
	// console.log(socket.id);
	connectedIDArray.push(socket.id);
	// console.log("Connected array length: " + connectedIDArray.length); 

	// // Send message
	// socket.on('chat message', function(msg){
	// 	// console.log('message: ' + msg);
	// 	// send to all
	// 	io.emit('chat message', socket.id + " : " + msg);
	// 	// send to others except the sender
	// 	// socket.broadcast.emit('chat message', msg);
	// });

	// Send sensor data red
	socket.on('sensor data red', function(sensorData){
		io.emit('sensor data red',  sensorData);
		// send to others except the sender
		// socket.broadcast.emit('chat message', msg);
	});

	// Send sensor data green
	socket.on('sensor data green', function(sensorData){
		io.emit('sensor data green',  sensorData);
	});

	// Send sensor data 3
	socket.on('sensor data blue', function(sensorData){
		io.emit('sensor data blue',  sensorData);
	});

	// Online event
	io.emit('online', socket.id);
	// Read initial file data when connected for the first time
	fs.readFile('test.json', function(err, data) {
		if (err) throw err;
		//io.emit("initial content", data);
		// Receive intial data when connected to server
		io.to(socket.id).emit("initial content", data);
		//console.log("First connection data: " + data);
	});

	// Disconnect	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		console.log(socket.id);
		var index = connectedIDArray.indexOf(socket.id); 
		if(index > -1){	
			connectedIDArray.splice(index, 1);
		}
		// console.log("Connected array length: " + connectedIDArray.length); 
		// Offline event
		io.emit('offline', socket.id);
	});

	// If led message received
	socket.on('ledFrequencySet', function (data) {
		console.log(data);
		io.sockets.emit('ledFrequency',data);
	});

	// Milk selection status
	socket.on('Milk selection status', function (data) {
		console.log("Milk selection status ", data);
		if(data == true){
			io.sockets.emit('milkIsSelected', true);
		}
		else{
			io.sockets.emit('milkIsDeselected', false);
		}
		
	});

	// Orange selection status
	socket.on('Orange selection status', function (data) {
		console.log("Orange selection status ", data);
		if(data == true){
			io.sockets.emit('orangeIsSelected', true);
		}
		else{
			io.sockets.emit('orangeIsDeselected', false);
		}
		
	});

	// Meat selection status
	socket.on('Meat selection status', function (data) {
		console.log("Meat selection status ", data);
		if(data == true){
			io.sockets.emit('meatIsSelected', true);
		}
		else{
			io.sockets.emit('meatIsDeselected', false);
		}
		
	});

	// Broccoli selection status
	socket.on('Broccoli selection status', function (data) {
		console.log("Broccoli selection status ", data);
		if(data == true){
			io.sockets.emit('broccoliIsSelected', true);
		}
		else{
			io.sockets.emit('broccoliIsDeselected', false);
		}
		
	});

	// Fish selection status
	socket.on('Fish selection status', function (data) {
		console.log("Fish selection status ", data);
		if(data == true){
			io.sockets.emit('fishIsSelected', true);
		}
		else{
			io.sockets.emit('fishIsDeselected', false);
		}
		
	});

});

// Read data from serial port and emit the data
myPort.on('data', function (scaleDataMilk){
	console.log(scaleDataMilk);
	io.emit("scaleData", scaleDataMilk);
});

// Print error message on console when has problem connecting to the port
myPort.on('error', function(err) {
  console.log('Error: ', err.message);
});

// Real time check file content changes
fs.watch('test.json', 
	function(event, filename){
		fs.readFile('test.json',
			function(err, data){
				if (err) throw err;
				io.emit("update content", data);
				console.log('file data: ' + data);
			});
	});


http.listen(3000, function(){
	console.log('listening on *:3000');
});
