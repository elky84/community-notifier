const open = require('open');
const notifier = require('node-notifier');

// String
//notifier.notify('Message');

// Object
notifier.notify({
	title: 'My notification',
	message: 'Hello, there!',
	sound: true,
	wait: true
}, function (err, response) {
	open('https://www.google.com');
});
