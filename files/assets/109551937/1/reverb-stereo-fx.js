var ReverbStereoFx = pc.createScript('reverbStereoFx');

ReverbStereoFx.attributes.add('listener', {
    title: 'Audio Listener Entity',
    type: 'entity'
});

ReverbStereoFx.attributes.add('verbType', {
    title: 'Impulse',
    type: 'asset',
    assetType: 'audio'
});

ReverbStereoFx.prototype.createGainNode = function() {
    // const reverbEffectConvolver = this.app.systems.sound.context.createConvolver();
    // let verbIR = this.verbType;
    // reverbEffectConvolver.buffer = verbIR.resource.buffer;
    const gainNode = this.app.systems.sound.context.createGain();
    gainNode.gain.value = 0;
    // gainNodeDry.connect(merger, 0, 0);

    // gainNodeWet.connect(reverbEffectConvolver);

    // gainNodeWet.connect(merger, 0, 0);
    // splitter.connect(reverbEffectConvolver, 1, 0);

    // stereoPanner.connect(merger, 0, 0);
    // stereoPanner.connect(merger, 1, 1);

    // stereoPanner.connect(reverbEffectConvolver, 0, 0);
    // reverbEffectConvolver.connect(merger, 0, 0);
    // merger.connect(firstNode.panner);
    gainNode.connect(this.reverbEffectConvolver);
    // splitter.connect(gainNodeDry, 0, 0);
    // splitter.connect(gainNodeWet, 1, 0);
    // gainNodeDry.connect(merger, 0, 0);
    // gainNodeWet.connect(merger, 0, 0);

    return {firstNode: gainNode, lastNode: gainNode};
};

ReverbStereoFx.prototype.sourceEffectNodes = [];

// initialize code called once per entity
ReverbStereoFx.prototype.initialize = function() {
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

ReverbStereoFx.prototype.buildRouting = function() {
    const speakers = this.app.systems.sound.context.destination;
    // const splitter = this.app.systems.sound.context.createChannelSplitter(2);
    // const merger = this.app.systems.sound.context.createChannelMerger(2);
    // this.reverbEffectConvolver.connect(splitter);
    // splitter.connect(merger, 0, 0);
    // splitter.connect(merger, 1, 1);
    // splitter.connect(speakers);

    // if (this.sourceEffectNodes.length > 0) {
    //     if (this.splitter) this.splitter.disconnect();
    //     if (this.merger) this.splitter.disconnect();
    //     if (this.reverbEffectConvolver) {
    //         this.reverbEffectConvolver.disconnect();
    //         this.reverbEffectConvolver = this.app.systems.sound.context.createConvolver();
    //         this.reverbEffectConvolver.buffer = this.verbType.resource.buffer;
    //     };
    //     this.soundEffectNodes.forEach((node) => {
    //         node.disconnect();
    //     });
    //     this.sourceEffectNodes = [];
    // }

    this.splitter = this.app.systems.sound.context.createChannelSplitter(2);
    this.merger = this.app.systems.sound.context.createChannelMerger(2);
    this.reverbEffectConvolver.connect(this.splitter);
    this.splitter.connect(this.merger, 0, 0);
    this.splitter.connect(this.merger, 1, 1);
    this.splitter.connect(speakers);

    this.soundSources.forEach((sourceEntity) => {
        const wetNode = this.createGainNode();
        console.log(wetNode);
        this.sourceEffectNodes.push(wetNode);
    });
};

// update code called every frame
ReverbStereoFx.prototype.registerSoundSource = function(newSoundSource) {
    this.soundSources.push(newSoundSource);
};

ReverbStereoFx.prototype.updateDryWet = function(soundSource, i) {
    const entityPosition = this.entityPosition.clone();
    entityPosition.z = 0;
    const soundSourcePosition = soundSource.getPosition().clone();
    soundSourcePosition.z = 0;

    const distance = soundSourcePosition.distance(entityPosition);
    let dryWet = (1/(distance * distance * distance + 0.01));
    dryWet = Math.min(Math.max(dryWet, 0), 1.0);
    // This controls dry wet
    this.sourceEffectNodes[i]['firstNode'].gain.value = dryWet;
};

ReverbStereoFx.prototype.soundSourceMoved = function(soundSource) {
    // After sound source has moved, calculate distance to the reverb entity
    const soundSourcePosition = soundSource.getPosition().clone();
    const entityPosition = this.entity.getPosition().clone();
    entityPosition.set(entityPosition.x, entityPosition.y, 0);
    soundSourcePosition.set(soundSourcePosition.x, soundSourcePosition.y, 0);
    const distance = soundSourcePosition.distance(entityPosition);
};

ReverbStereoFx.prototype.entityMoved = function() {
    this.entityPosition = this.entity.getPosition().clone();

    const entityPosition = this.entityPosition.clone();
    entityPosition.z = 0;
    // If reverb entity moved calculate distance to all sound sources
    this.soundSources.forEach((soundSource, i) => {
        this.updateDryWet(soundSource, i);
    });
};

ReverbStereoFx.prototype.update = function() {
    if (this.entityPosition.equals(this.entity.getPosition())) return;

    this.entityMoved();
};

// swap method called for script hot-reloading
// inherit your script state here
ReverbStereoFx.prototype.swap = function(old) { 
    this.initialize();
};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/