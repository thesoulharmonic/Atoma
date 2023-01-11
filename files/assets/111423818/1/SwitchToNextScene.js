var SwitchToNextScene = pc.createScript('switchToNextScene');

// initialize code called once per entity
SwitchToNextScene.prototype.initialize = function() {
    console.log(this.entity.button)
    this.entity.button.on("mousedown", () => {
        console.log("mousedown");
        this.app.fire("scene:load", "MainScene");
    });

    this.entity.button.on("touchstart", () => {
        console.log("mousedown");
        this.app.fire("scene:load", "MainScene");
    });
};

// update code called every frame
SwitchToNextScene.prototype.update = function(dt) {
    if (this.app.keyboard.isPressed(pc.KEY_ENTER)) {
        this.app.fire("scene:load", "MainScene");
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// SwitchToNextScene.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/