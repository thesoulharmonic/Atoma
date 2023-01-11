var FollowWorldTarget = pc.createScript('followWorldTarget');

FollowWorldTarget.attributes.add('target', {type: "entity"});
FollowWorldTarget.attributes.add('camera', {type: "entity"});

// initialize code called once per entity
FollowWorldTarget.prototype.initialize = function() {
    // IMPORTANT: The element must be anchored to the bottom left of the screen
};

// update code called every frame
FollowWorldTarget.prototype.postUpdate = function(dt) {
    // world space position of target
    var worldPos = this.target.getPosition();
    var screenPos = new pc.Vec3();
    
    // get screen space co-ord
    this.camera.camera.worldToScreen(worldPos, screenPos);
    // check if the entity is in front of the camera
    if (screenPos.z > 0) {
        this.entity.element.enabled = true;
        // Take into account of pixel ratio
        var pixelRatio = this.app.graphicsDevice.maxPixelRatio;
        screenPos.x *= pixelRatio;
        screenPos.y *= pixelRatio;

        var device = this.app.graphicsDevice;

        // Global position of elements is normalised between -1 and 1 on both axis
        this.entity.setPosition(
            ((screenPos.x / device.width) * 2) - 1, 
            ((1 - (screenPos.y / device.height)) * 2) - 1 + 0.1, 
            0);  

    } else {
        // this.entity.element.enabled = false;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// FollowWorldTarget.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/