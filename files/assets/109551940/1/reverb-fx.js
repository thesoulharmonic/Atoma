var ReverbFx = pc.createScript('reverbFx');

ReverbFx.attributes.add('listener', {
    title: 'Audio Listener Entity',
    type: 'entity'
});

ReverbFx.attributes.add('verbType', {
    title: 'Impulse',
    type: 'asset',
    assetType: 'audio'
});

ReverbFx.prototype.createReverbModule = function() {
    const reverbEffectConvolver = this.app.systems.sound.context.createConvolver();
    let verbIR = this.verbType;
    reverbEffectConvolver.buffer = verbIR.resource.buffer;
    const stereoPanner = this.app.systems.sound.context.createStereoPanner();
    const splitter = this.app.systems.sound.context.createChannelSplitter(2);
    const merger = this.app.systems.sound.context.createChannelMerger(1);
    const gainNodeDry = this.app.systems.sound.context.createGain();
    const gainNodeWet = this.app.systems.sound.context.createGain();
    gainNodeDry.gain.value = 1;
    gainNodeWet.gain.value = 0;
    stereoPanner.connect(splitter);
    splitter.connect(gainNodeDry, 0);
    splitter.connect(gainNodeDry, 1);

    // gainNodeDry.connect(merger, 0, 0);

    // gainNodeWet.connect(reverbEffectConvolver);

    // gainNodeWet.connect(merger, 0, 0);
    // splitter.connect(reverbEffectConvolver, 1, 0);

    // stereoPanner.connect(merger, 0, 0);
    // stereoPanner.connect(merger, 1, 1);

    // stereoPanner.connect(reverbEffectConvolver, 0, 0);
    // reverbEffectConvolver.connect(merger, 0, 0);
    // merger.connect(firstNode.panner);

    // splitter.connect(gainNodeDry, 0, 0);
    // splitter.connect(gainNodeWet, 1, 0);
    // gainNodeDry.connect(merger, 0, 0);
    // gainNodeWet.connect(merger, 0, 0);

    return {firstNode: stereoPanner, lastNode: gainNodeDry, gainNodes: {
        dryNode: gainNodeDry,
        wetNode: gainNodeWet
    }};
};

ReverbFx.prototype.sourceEffectNodes = [];

// initialize code called once per entity
ReverbFx.prototype.initialize = function() {
    this.audioContext = this.app.systems.sound.context;
    console.log(this.audioContext.destination);
    this.reverbEffectConvolver = this.app.systems.sound.context.createConvolver();
    let verbIR = this.verbType;
    this.reverbEffectConvolver.buffer = verbIR.resource.buffer;
    // Initialize sources
    this.soundSources = [];
    this.sourceEffectNodes = [];

    this.app.on('sound:registerSound', (soundSource) => {
        this.registerSoundSource(soundSource);
    }, this);

    this.app.on('sound:buildrouting', (soundSource) => {
        this.buildRouting();
        // this.entityMoved();
    }, this);

    this.app.on('sound:move', (soundSourceEntity) => {
        // console.log("sound source is moving");
        const soundSourceIndex = this.soundSources.findIndex((source) => {
            return source._guid == soundSourceEntity._guid;
        });
        // console.log(soundSourceEntity);
        this.updateDryWet(soundSourceEntity, soundSourceIndex);
    }, this);

    this.entityPosition = this.entity.getPosition().clone();
};

ReverbFx.prototype.buildRouting = function() {
    // const speakers = this.app.systems.sound.context.destination;
    // this.reverbEffectConvolver.connect(speakers);
    this.soundSources.forEach((sourceEntity) => {
        const verbModule = this.createReverbModule();
        console.log(verbModule);
        this.sourceEffectNodes.push(verbModule);
    });
};

// update code called every frame
ReverbFx.prototype.registerSoundSource = function(newSoundSource) {
    console.log("registering sound source to reverb fx", newSoundSource);
    this.soundSources.push(newSoundSource);
};

ReverbFx.prototype.updateDryWet = function(soundSource, i) {
    const entityPosition = this.entityPosition.clone();
    entityPosition.z = 0;
    const soundSourcePosition = soundSource.getPosition().clone();
    soundSourcePosition.z = 0;

    const distance = soundSourcePosition.distance(entityPosition);
    let dryWet = -1 + 2*(1/(distance + 0.01));
    dryWet = Math.min(Math.max(dryWet, -1), 1);
    // This controls dry wet
    this.sourceEffectNodes[i]['firstNode'].pan.value = dryWet * 1.2;
};

ReverbFx.prototype.soundSourceMoved = function(soundSource) {
    // After sound source has moved, calculate distance to the reverb entity
    const soundSourcePosition = soundSource.getPosition().clone();
    const entityPosition = this.entity.getPosition().clone();
    entityPosition.set(entityPosition.x, entityPosition.y, 0);
    soundSourcePosition.set(soundSourcePosition.x, soundSourcePosition.y, 0);
    const distance = soundSourcePosition.distance(entityPosition);
};

ReverbFx.prototype.entityMoved = function() {
    this.entityPosition = this.entity.getPosition().clone();

    const entityPosition = this.entityPosition.clone();
    entityPosition.z = 0;
    // If reverb entity moved calculate distance to all sound sources
    this.soundSources.forEach((soundSource, i) => {
        this.updateDryWet(soundSource, i);
    });
};

ReverbFx.prototype.update = function() {
    if (this.entityPosition.equals(this.entity.getPosition())) return;

    this.entityMoved();
};

// swap method called for script hot-reloading
// inherit your script state here
ReverbFx.prototype.swap = function(old) { 
    this.initialize();
};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/