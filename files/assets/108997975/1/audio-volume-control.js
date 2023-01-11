var AudioVolumeControl = pc.createScript('audioVolumeControl');

// initialize code called once per entity
AudioVolumeControl.prototype.initialize = function() {
    this.firstMoveFadeComplete = false;
    this.startFade = false;
    this.fadeTime = 2;
    this.timer = 0;
    this.fadeVol = 0;
    this.volume = Math.min(Math.max(this.entity.getPosition().y/6 + 0.5, 0), 1);

    this.app.on('sound:move', (soundSourceEntity) => {
        if (soundSourceEntity._guid == this.entity._guid) {
            if (!this.startFade) {
                this.startFade = true;
            }
            this.volume = Math.min(Math.max(this.entity.getPosition().y/6 + 0.5, 0), 1);
        } 
    }, this);
    this.entity.sound.volume = 0;
};

AudioVolumeControl.prototype.fadeIn = function() {
    this.firstMoveFadeComplete = true;
};

AudioVolumeControl.prototype.update = function(dt) {
    this.timer += dt;
    if (this.startFade && this.timer < this.fadeTime) {
        this.fadeVol += dt / 2;
        this.volume = Math.max(Math.min(this.volume, this.fadeVol), 1);
    } else if (this.startFade && this.timer > this.fadeTime) {
        this.firstMoveFadeComplete = true;
        this.fadeVol = 0;
    }

    if (this.entity.sound.volume != this.volume && this.startFade) {
        this.entity.sound.volume = this.volume;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// AudioVolumeControl.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/