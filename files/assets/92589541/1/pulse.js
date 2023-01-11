var Pulse = pc.createScript('pulse');

// initialize code called once per entity
Pulse.prototype.initialize = function() {
    this.factor = 0;
    this.entityPosition = this.entity.getLocalPosition();
};

Pulse.prototype.pulse = function () {
    this.factor = 3;
};

// update code called every frame
Pulse.prototype.update = function(dt) {
    if (this.factor > 0) {
        this.factor -= dt;
        var s = 10 * Math.sin(this.factor * 10) * this.factor;
        this.entity.setLocalPosition(this.entityPosition.x, this.entityPosition.y, this.entityPosition.z + s);
    } 
};
