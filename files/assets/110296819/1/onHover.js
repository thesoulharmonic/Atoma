var OnHover = pc.createScript('onHover');

// initialize code called once per entity
OnHover.prototype.initialize = function() {
    this.isHovered = false;
    this.intensity = 1;
};

// update code called every frame
OnHover.prototype.update = function(dt) {
    if (this.isHovered && this.intensity < 1) {

    } else if (this.isHovered && this.intensity > 0)  {

    }
};

OnHover.prototype.enableHover = function(hoverEnabled) {
    this.isHovered = hoverEnabled;
};

// swap method called for script hot-reloading
// inherit your script state here
// OnHover.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/