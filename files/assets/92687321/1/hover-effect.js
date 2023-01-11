var HoverEffect = pc.createScript('hoverEffect');

// initialize code called once per entity
HoverEffect.prototype.initialize = function() {
    this.originalEntityScale = this.entity.getLocalScale().clone();
    this.currentScale = this.entity.getLocalScale().clone();
    this.isHovering = false;
    this.timer = 0;
};

HoverEffect.prototype.enableHover = function() {
    this.isHovering = true;
    this.timer = 0;
    // let newScale = this.originalEntityScale.clone();
    // newScale.mulScalar(1.1);
    // this.entity.setLocalScale(newScale);
};

HoverEffect.prototype.disableHover = function() {
    this.isHovering = false;
    this.timer = 1;
    // this.entity.setLocalScale(this.originalEntityScale);
};

HoverEffect.newScale = new pc.Vec3();

// update code called every frame
HoverEffect.prototype.update = function(dt) {
    if (this.isHovering) {
        // this.timer += dt*4;
        // HoverEffect.newScale = this.originalEntityScale.clone();
        // HoverEffect.newScale.mulScalar(1 + Math.sin(this.timer)/10);
        // this.currentScale = HoverEffect.newScale.clone();
        // this.entity.setLocalScale(HoverEffect.newScale);
    } else if (this.timer >= 0) {
        // this.timer -= dt*3;
        // HoverEffect.newScale = new pc.Vec3();
        // // newScale.lerp(this.currentScale, this.orikginalEntityScale, this.timer);
        // HoverEffect.newScale.lerp(this.originalEntityScale, this.currentScale,  this.timer);
        // this.entity.setLocalScale(HoverEffect.newScale);
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// HoverEffect.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/