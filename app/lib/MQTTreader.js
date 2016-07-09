var mqtt = require('mqtt');
var broker = 'mqtt://a955900d:ade60d7ea25819d9@broker.shiftr.io';
var client = mqtt.connect(broker);
client.subscribe('data/');

var fun_1 = function($scope) {
	// console.log($scope);
	client.handleMessage = function(packet, cb) {
		console.log(packet.payload.toString());
		// $scope.message2 = packet.payload.toString();
		cb();
	};
	// console.log($scope.message2);
	return $scope;
};

module.exports = fun_1;