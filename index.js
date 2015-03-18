var express = require("express");
var app = express();
var port = 3700;
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});
app.get("/crypto-js/*", function (req, res) {
	//console.log(req);
    res.sendFile(__dirname + "/node_modules/" + res.req.originalUrl);
});
/*app.get("/crypto-js/enc-utf8.js", function (req, res) {
    res.sendFile(__dirname + "/node_modules/crypto-js/enc-utf8.js");
});
app.get("/crypto-js/core.js", function (req, res) {
    res.sendFile(__dirname + "/node_modules/crypto-js/core.js");
});*/
app.use(express.static(__dirname + '/public'));
 
var io = require('socket.io').listen(app.listen(port));
var CryptoJS = require("crypto-js");

var words = CryptoJS.enc.Utf8.parse("test"); // WordArray object
var benc = CryptoJS.enc.Base64.stringify(words); // string: 'SGVsbG8gd29ybGQ='
console.log(benc);

words = CryptoJS.enc.Base64.parse(benc);
console.log(CryptoJS.enc.Utf8.stringify(words)); // 'Hello world'


var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
var test = CryptoJS.enc.Utf8.parse(encrypted);
var test2 = CryptoJS.enc.Utf8.stringify(test);
var decrypted = CryptoJS.AES.decrypt(test2, "Secret Passphrase");
console.log(CryptoJS.enc.Utf8.stringify(decrypted));
io.sockets.on('connection', function (socket) {
	console.log("User Connected ID:" + socket.client.conn.id + " IP: " + socket.client.conn.remoteAddress);
	var motd = 'Welcome to the chat';
	socket.emit('message', { 
		encrypted: false,
		type: "string",
		message: motd
	});
	
	socket.on('getUsers', function (data) {
		console.log(data);
		console.log(socket.client.conn.remoteAddress);
	});
	
	
	
	socket.on('send', function (data) {
		io.sockets.emit('message', data);
	});
});

console.log("Listening on port " + port);