var MouseControl = pc.createScript('mouseControl');

// initialize code called once per entity
MouseControl.prototype.initialize = function() {
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);

    this.on('destroy', function() {
        this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
        this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this);
    }, this);

    this.dragging = false;
};

// update code called every frame
MouseControl.prototype.onMouseDown = function(event) {
    this.dragging = true;
    this.app.fire('mouse:down', event);
};

MouseControl.prototype.onMouseMove = function(event) {
    this.app.fire('mouse:move', event);
};

MouseControl.prototype.onMouseUp = function(event) {
    this.dragging = false;
    this.app.fire('mouse:up', event);
};

// swap method called for script hot-reloading
// inherit your script state here
// MouseControl.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/