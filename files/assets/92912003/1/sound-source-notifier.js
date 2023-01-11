var SoundSourceNotifier = pc.createScript('soundSourceNotifier');

// initialize code called once per entity
SoundSourceNotifier.prototype.initialize = function() {
    if (!this.entity.sound) return;
    this.soundSourceEntityPosition = this.entity.getPosition().clone();
};

// swap method called for script hot-reloading
// inherit your script state here
SoundSourceNotifier.prototype.swap = function(old) { 
    this.initialize();
};

SoundSourceNotifier.prototype.update = function () {
    if (!this.soundSourceEntityPosition.equals(this.entity.getPosition())) {
        this.app.fire('sound:move', this.entity);
        this.soundSourceEntityPosition = this.entity.getPosition().clone();
    }
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/