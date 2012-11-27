/*
 * semkey - Semantic Hotkeys for jQuery
 *
 * Issues: If another program steals focus, the keyup event is not fired for all
 * the keys that have been pressed. It is very hard to detect whether or not the
 * actual browser loses focus with javascript. 
 */

(!function($) {

	var keyTable = {
		// upper row
		'ESC': 27,
		'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115,
		'F5': 116, 'F6': 117, 'F7': 118, 'F8': 119,
		'F9': 120, 'F10': 121, 'F11': 122, 'F12': 123,
		'PRINTSCREEN': 44, 'SCROLLLOCK': 145,'PAUSEBREAK': 144,
		// left block
		'`': 192, '1': 49, '2': 50, '3': 51, '4': 52, '5': 53, '6': 54, '7': 55, '8': 56, '9': 57, '0': 48, '-': 189, '=': 187, 'BACKSPACE': 8,
		'TAB': 9, 'Q': 81, 'W': 87, 'E': 69, 'R': 82, 'T': 84, 'Y': 89, 'U': 85, 'I': 73, 'O': 79, 'P': 80, '[': 219, ']': 221, '\\': 220,
		'CAPSLOCK': 20, 'A': 65, 'S': 83, 'D': 68, 'F': 70, 'G': 71, 'H': 72, 'J': 74, 'K': 75, 'L': 76, ';': 186, "'": 222, "ENTER": 13,
		'SHIFT': 16, 'Z': 90, 'X': 88, 'C': 67, 'V': 86, 'B': 66, 'N': 78, 'M': 77, ',': 188, '.': 190, '/': 191, 
		'CONTROL': 17, 'WINDOWS': 19, 'ALT': 18, 'SPACE': 32, 'RIGHTALT': 0, 'RIGHTWINDOWS': 92, 
		// 6 block
		'INSERT': 45, 'HOME': 36, 'PAGEUP': 33, 
		'DELETE': 46, 'END': 35, 'PAGEDOWN': 34,
		// arrow keys
		'UP': 38, 'LEFT': 37, 'DOWN': 40, 'RIGHT': 39,
		// numpad
		'NUMLOCK':144, 'DIVIDE': 111, 'MULTIPLY': 106, 'SUBTRACT': 109,
		'NUM7': 103, 'NUM8': 104, 'NUM9': 105, 'ADD': 107,
		'NUM4': 100, 'NUM5': 101, 'NUM6': 102, 
		'NUM4':  97, 'NUM5':  98, 'NUM6':  99, 
		'NUM0':  96, 'DOT' : 110
	};

	var keyTableInverse = {};

	var state = [];
	var stateChanged = false;

	function stateReset() {
		if(state.length) {
			state = [];
			stateChanged = true;
		}
	}

	function stateAdd(keycode) {
		for(var i = 0, l = state.length; i < l; i++) {
			if(state[i] === keycode) { return; }
		}
		state.push(keycode);
		stateChanged = true;
	}

	function stateRemove(keycode) {
		for(var i = 0, l = state.length; i < l; i++) {
			if(state[i] === keycode) {
				state.splice(i, 1);
				stateChanged = true;
				return;
			}
		}
	}

	function stateCheck(control, shift, alt) {
		var c = false, s = false, a = false;
		for(var i = 0, l = state.length; i < l; i++) {
			switch(state[i]) {
				case keyTable['CONTROL']: c = true; break;
				case keyTable['SHIFT']: s = true; break;
				case keyTable['ALT']: a = true; break;
			}
		}
		return (control === c) && (shift === s) && (alt === a);
	}

	function parse(s) {
		var parts = s.toUpperCase().split('+');
		var keys = [];
		for(var i = 0, l = parts.length; i < l; i++) {
			keys.push(keyTable[parts[i]]);
		}
		return keys;
	}

	function keydown(e) {
		var k = e.which;
		//e.stopPropagation();
		//e.preventDefault();

		// Add the pressed key to the internal keyboard state
		stateAdd(k);

		// Check if the modifier keys are conform with the state
		var valid = stateCheck(e.ctrlKey, e.shiftKey, e.altKey);
		if(!valid) {
			// Reset the internal state and add the pressed key
			stateReset();
			stateAdd(k);
		}
		
		match();
	}

	function keyup(e) {
		var k = e.which;
		stateRemove(k);
	}

	function match() {
		if(stateChanged === false) { return; }
		stateChanged = false;

		// print state
		var s = [];
		for(var i = 0, l = state.length; i < l; i++) {
			s.push(keyTableInverse[state[i]]);
		}
		console.log('semkey state: (' + s.join(' + ') + ')');

		// find matching hotkey
		var current = hotkeys;
		var found = true;
		for(var i = 0, l = state.length; i < l; i++) {
			var h = state[i];
			if(!current[h]) { found = false; break; }
			current = current[h];
		}
		if(found && current['event']) {
			console.log('event', current['event']);
		}
	}

	var semkey = function() {
		// TODO: Compile static version
		for(key in keyTable) {
			keyTableInverse[keyTable[key]] = key;
		}

		this.keydown(keydown);
		this.keyup(keyup);
		return this;
	};

	var hotkeys = {}; // {key1: {key2: {key3: {event:['x']}}, event:['y']}}
	var bindings = {}; // {name: [keycomb1, keycomb2]}

	semkey.set = function(name, hotkey) {
		hotkey = parse(hotkey);
		name = name.toLowerCase();

		// add the hotkey to the collection of bindings
		if(!bindings[name]) { bindings[name] = []; }
		bindings[name].push(hotkey);
		
		// add the hotkey to the hotkey tree
		var current = hotkeys;
		for(var i = 0, l = hotkey.length; i < l; i++) {
			var h = hotkey[i];
			if(!current[h]) { current[h] = {}; }
			current = current[h];
		}
		if(!current['event']) { current['event'] = []; }
		current['event'].push(name);

		console.log(hotkeys);
		console.log(bindings);
	};

	$.fn.semkey = semkey;

}(jQuery))

/*
SemkeyState
	add(keycode, undefined || (control, shift, alt))
	remove(keycode)
	reset()

SemkeyTree
	add(hotkey || hotkey_array)
	has(hotkey || hotkey_array)
	remove(hotkey || hotkey_array)
	match(hotkey) : returns events associated with hotkey
	
SemkeyEvents
	add(name, hotkey || hotkey_array)
	remove(name, undefined || hotkey || hotkey_array)

	event {
		hotkeys: [h1, ...]
		listeners: [f1, ...]
	}

*/
