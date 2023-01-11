var VolumeFx = pc.createScript('volumeFx');

// initialize code called once per entity
VolumeFx.prototype.initialize = function() {
    // On intialization add new audio source to list
    this.soundSourceEntities = [];

    this.app.on('sound:register', (soundSourceEntity) => {
        this.registerSoundSource(soundSourceEntity);
    }, this);

    this.app.on('sound:move', (soundSource, newPosition) => {
        this.soundSourceMoved(soundSource, newPosition);
        // Calculate distance of 
    }, this);
};

VolumeFx.prototype.registerSoundSource = function(soundSourceEntity) {
    this.soundSourceEntities.push(soundSourceEntity);
};

VolumeFx.prototype.soundSourceMoved = function(soundSourceEntity) {
    // After sound source has moved, calculate distance to source
    console.log("moved: ", soundSourceEntity);
    // Determine volume of sound according to Y coordinate ratio
};

// swap method called for script hot-reloading
// inherit your script state here
VolumeFx.prototype.swap = function(old) { 

};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/

// swap method called for script hot-reloading
// inherit your script state here
// VolumeFx.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/