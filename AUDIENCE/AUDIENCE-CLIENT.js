$(function () {

	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////

	function rgbToHex(R, G, B){
	    return toHex(R) + toHex(G) + toHex(B);
	}

	function toHex(n){
	    n = parseInt(n, 10);
	    if( isNaN(n) ){ 
	        return "00";
	    }
	    n = Math.max(0, Math.min(n,255));
	    return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
	}
	
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////

	// Web socket connections
	var uuid = "";
	var audienceMemberSocket;
	
	var main = document.getElementById("main");
	
	var send_message = function (key, d) {
		audienceMemberSocket.send(JSON.stringify({message: key, id: uuid, data: d}));
	}

	audienceMemberSocket = new WebSocket("ws://18.111.9.98:3000", "protocolOne");
	
	audienceMemberSocket.onopen = function (event) {
		console.log("Socket connection opened.");
	};

	audienceMemberSocket.onmessage = function (event) {

		var obj = JSON.parse(event.data);
		uuid = obj['id'];
		var message = obj['message'];
		console.log(obj);

		// Establishing a new connection
		if (message == 'connection') {
			var res = {message: "identify", id: uuid, data: 'audience'};
		  	audienceMemberSocket.send(JSON.stringify(res)); 

		// Play the audio file
		} else if (message == 'sync-start') {
			var water = document.getElementById("water");
			water.play();

		// Update the display
		} else if (message == 'audio-amp') {
			var val = parseFloat(obj['data']);
			var rgb = "#" + rgbToHex(val * 30, val * 90, val * 255); 
			main.style.backgroundColor = rgb;

			if ("vibrate" in navigator) {
				console.log("vibration supported");
				// main.style.backgroundColor = '#FFFF00';
			} else {
				console.log("vibration not supported");
			}
		}
	}
});