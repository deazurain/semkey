# semkey

Semantic Hotkeys jQuery plugin

## What does it do?

semkey allows you to bind multiple hotkeys to an action with a semantic name. 

## How to use

Basic usage:

	var s = jQuery(window).semkey;

	// set semantic hotkeys
	s.set('down', ['DOWN', 'S', 'J']);
	s.set('up', ['UP', 'W', 'K']);

	s.on('down', function() {
		console.log('The boogie goes down');
	});

	s.on('up', function() {
		console.log('Up in the sky, so high!');
	});
