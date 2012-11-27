var options = {};
var s = $(window).semkey(options);

// keybindings
s.set('escape', ['TAB', 'ESCAPE', 'Q']);
s.set('confirm', ['SPACE', 'ENTER', 'E']);

s.set('up', ['UP', 'K', 'W']);
s.set('down', ['DOWN', 'J', 'S']);
s.set('left', ['LEFT', 'H', 'A']);
s.set('right', ['RIGHT', 'L', 'D']);

s.set('reset', 'R');
s.set('hard-reset', 'SHIFT+R');

// listeners
s.on('escape', function(e) {
	console.log('escape');
});

s.on('confirm', function(e) {
	console.log('confirm');
});

s.on('up', function(e) {
	console.log('up');
});

s.on('down', function(e) {
	console.log('down');
});

s.on('left', function(e) {
	console.log('left');
});

s.on('right', function(e) {
	console.log('right');
});

s.on('reset', function(e) {
	console.log('reset');
	window.location = window.location;
});

s.on('hard-reset', function(e) {
	console.log('hard-reset');
});
