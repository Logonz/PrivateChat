function Decrypt(data, pwd)
{
	var de = CryptoJS.enc.Utf8.stringify(data);
	var te = CryptoJS.AES.decrypt(de, pwd);
	if(te != "")
	{
		return CryptoJS.enc.Utf8.stringify(te);
	}
	else
	{
		return "Wrong Key, Cannot decrypt";
	}
}


window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://81.170.250.249:3700');
	socket.emit('getUsers', {
		Username: "asdf"
	});
    var field = document.getElementById("field");
	var password = document.getElementById("password");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
 
    socket.on('message', function (data) {
        if(data.message) {
			messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
				console.log(messages[i].message);
				var msg = messages[i].message;
				if(messages[i].encrypted == false)
				{
					if(msg != "")
					{
						html += msg + '<br />';
					}
				}
				else
				{
					msg = Decrypt(msg, password.value);
					if(msg != "")
					{
						html += msg + '<br />';
					}
					else
					{
						
					}
				}
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
    sendButton.onclick = function() {
		var msg = CryptoJS.AES.encrypt(
		  field.value,
		  password.value
		);
		msg = CryptoJS.enc.Utf8.parse(msg);
		field.value = "";
        socket.emit('send', { 
			encrypted: true,
			type: "string",
			message: msg
		});
    };
 
}

/*
window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://81.170.250.249:3700');
    var field = document.getElementById("field");
	var password = document.getElementById("password");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(messages[i],password.value)) + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
    sendButton.onclick = function() {
		//var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
		//var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
		var msg = CryptoJS.AES.encrypt(field.value, password.value);
		field.value = "";
        socket.emit('send', { message: benc });
    };
 
}
*/