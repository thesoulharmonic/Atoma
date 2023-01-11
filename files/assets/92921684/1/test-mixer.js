var TestMixer = pc.createScript('testMixer');

// initialize code called once per entity
TestMixer.prototype.initialize = function() {
    this.audioContext = this.app.systems.sound.context;

    this.mixerProcResource = this.app.assets.find('matrix-mixer-processor.js', 'script');
    this.matrixMixerNode = undefined;

    // Initialize sources
    this.soundSources = [];
    this.soundSourceIndex = 0;

    this.app.on('sound:register', (soundSource) => {
        this.registerSoundSource(soundSource);
    }, this);

    this.app.on('sound:buildrouting', () => {
        this.buildRouting();
    }, this);

    this.timer = 0;
};

TestMixer.prototype.createMixerFileWithParameeters = async function (fileUrl) {
    const data = await fetch(fileUrl);
    console.log(await data.text());
};

TestMixer.prototype.buildRouting = async function() {
    console.log("builing routing");
    // const mixerParam = await this.createMixerFileWithParameeters(this.mixerProcResource.getFileUrl());
    await this.audioContext.audioWorklet.addModule(this.mixerProcResource.getFileUrl());
    this.matrixMixerNode = new AudioWorkletNode(this.audioContext, 'matrix-mixer-processor', {
        numberOfInputs: this.soundSources.length,
        numberOfOutputs: 1,
        processorOptions: {
            test: 'data'
        }
    });
    console.log(this.matrixMixerNode);

    this.matrixMixerNode.connect(this.audioContext.destination, 0);

    this.soundSources.forEach((soundSource) => {
        console.log(soundSource);
        let slots = soundSource.sound.slots;
        
        Object.entries(slots).forEach(([key, value]) => {
            // do something with key and val
            console.log({...slots[key]});
            console.log(slots[key]);

            // console.log(slots[key].instances[0]);
            // console.log(slots[key].instances[0]._connectorNode);
            // // slots[key].instances[0].gain.connect(this.convolver, 0, 0);
            console.log("Connecting to matrix mixer input:", this.soundSourceIndex);
            // console.log(slots[key].instances[0].getExternalNodes());

            // slots[key].instances[0].panner.connect(this.matrixMixerNode, this.soundSourceIndex);
            slots[key].instances[0].setExternalNodes(this.matrixMixerNode);
            // console.log(slots[key].instances[0].getExternalNodes());
        });
    });

};

// update code called every frame
TestMixer.prototype.registerSoundSource = function(newSoundSource) {
    this.soundSources.push(newSoundSource);
};

TestMixer.prototype.update = function(dt) {
    this.timer += dt;
    if (this.timer >= 1) {
        // console.log(this.matrixMixerNode);
        this.timer = 0;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
TestMixer.prototype.swap = function(old) { 
    this.initialize();
};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/