/*
Public functionality:

SemkeyState
	add(keycode, undefined || (control, shift, alt))
	remove(keycode)
	changed(falsy || true) // check whether or not 
	reset()

	[keycode1, ...]
*/

/*
 * Expects:
 *
 *   keyTable -> table of keynames to keycodes
 */

function SemkeyState() { 
	this.reset();
};

var p = SemkeyState.prototype;

p.add = function(keycode, control, shift, alt) {
	if(!this._has(keycode)) {
		this._add(keycode);
	}
	if(!this._valid(control, shift, alt)) {
		this.reset();
		this._add(keycode);
	}
}

p.remove(keycode) {
	var state = this._state;
	for(var i = 0, l = state.length; i < l; i++) {
		if(state[i] === keycode) {
			state.splice(i, 1);
			this._changed = true;
			break;
		}
	}
}

p.reset() {
	if (this._state.length > 0) {
		this._changed = true;
	} else {
		this._changed = false || this._changed;
	}
	this._state = {};
}

p.changed(testOnly) {
	if(testOnly) {
		return this._changed;
	}
	if(this._changed) {
		this._changed = false;
		return true;
	}
	return false;
}

p._add(keycode) {
	this._state.push(keycode);
	this._changed = true;
}

p._has(keycode) {
	var state = this._state;
	for(var i = 0, l = state.length; i < l; i++) {
		if(state[i] === keycode) { return true; }
	}
	return false;
}

p._valid(control, shift, alt) {
	var c = false, s = false, a = false;
	var state = this._state;
	for(var i = 0, l = state.length; i < l; i++) {
		switch(state[i]) {
			case keyTable['CONTROL']: c = true; break;
			case keyTable['SHIFT']: s = true; break;
			case keyTable['ALT']: a = true; break;
		}
	}
	return c === control && s === shift && a === alt;
}





