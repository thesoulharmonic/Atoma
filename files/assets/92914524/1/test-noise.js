var TestNoise = pc.createScript('testNoise');

// initialize code called once per entity
TestNoise.prototype.initialize = function() {
    
    this.audioContext = this.app.systems.sound.context;
    console.log(this.audioContext);
    const noiseProcResource = this.app.assets.find('random-noise-processor.js', 'script');
    console.log(noiseProcResource);
    async function setupNoise(context) {
        console.log(this.audioContext);
        console.log(context);

        await context.audioWorklet.addModule(noiseProcResource.getFileUrl());
        const randomNoiseNode = new AudioWorkletNode(context, 'random-noise-processor');
        randomNoiseNode.connect(context.destination);
    }

    setupNoise(this.audioContext);
};

// update code called every frame
TestNoise.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// TestNoise.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/