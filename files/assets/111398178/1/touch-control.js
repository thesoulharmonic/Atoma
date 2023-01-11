// More information about touch events can be found here
// http://developer.playcanvas.com/en/api/pc.TouchControl.html

var TouchControl = pc.createScript("touchControl");

// initialize code called once per entity
TouchControl.prototype.initialize = function() {
    this.pos = new pc.Vec3();

    // Only register touch events if the device supports touch
    var touch = this.app.touch;
    if (touch) {
        touch.on(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
        touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
        touch.on(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
        touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchCancel, this);
    }

    this.on('destroy', function() {
        if (touch) {
            touch.off(pc.EVENT_TOUCHSTART, this.onTouchStart, this);
            touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
            touch.off(pc.EVENT_TOUCHEND, this.onTouchEnd, this);
            touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchCancel, this);  
        }
    }, this);
};

TouchControl.prototype.onTouchStart = function (event) {
    event.event.preventDefault();
    event.x = event.changedTouches[0].x;
    event.y = event.changedTouches[0].y;
    console.log(event);
    this.app.fire('mouse:down', event);
};


TouchControl.prototype.onTouchMove = function (event) {
    event.event.preventDefault();
    event.x = event.changedTouches[0].x;
    event.y = event.changedTouches[0].y;
    this.app.fire('mouse:move', event);
};


TouchControl.prototype.onTouchEnd = function (event) { 
    event.event.preventDefault();
    event.x = event.changedTouches[0].x;
    event.y = event.changedTouches[0].y;
    this.app.fire('mouse:up', event);
};


TouchControl.prototype.onTouchCancel = function (event) {
    event.event.preventDefault();
};