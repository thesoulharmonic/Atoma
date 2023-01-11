var ListenerManager = pc.createScript('listenerManager');

// initialize code called once per entity
ListenerManager.prototype.initialize = function() {
    this.x = 0; 
    this.y = 0; 
    this.z = 0;
};

// update code called every frame
ListenerManager.prototype.update = function(dt) {
    let position = this.entity.getPosition();

    if (position.x == this.x && position.y == this.y && position.z == this.z) return;

    this.x = position.x;
    this.y = position.y;
    this.z = position.z;

    this.app.fire('listener:move', this.x, this.y, this.z);
};

// swap method called for script hot-reloading
// inherit your script state here
// ListenerManager.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/