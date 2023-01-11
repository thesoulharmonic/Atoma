var FilterFx = pc.createScript('filterFx');

FilterFx.attributes.add('listener', {
    title: 'Audio Listener Entity',
    type: 'entity'
});

FilterFx.attributes.add('maxFreq', {
    title: 'Max Filter Freq',
    type: 'number',
    max: 22000,
    min: 10,
});

FilterFx.attributes.add('minFreq', {
    title: 'Max Filter Freq',
    type: 'number',
    max: 22000,
    min: 10,
});

FilterFx.prototype.sourceEffectNodes = [];

// initialize code called once per entity
FilterFx.prototype.initialize = function() {
    this.audioContext = this.app.systems.sound.context;
    console.log(this.audioContext.destination);
    // this.filterEffect = this.app.systems.sound.context.createBiquadFilter();
    // Initialize sources
    this.soundSources = [];
    this.sourceEffectNodes = [];

    this.app.on('sound:registerSound', (soundSource) => {
        this.registerSoundSource(soundSource);
    }, this);

    this.app.on('sound:buildrouting', (soundSource) => {
        // if (this.routingBuilt) return;
        this.buildRouting();
        this.entityMoved();
        this.routingBuilt = true;
    }, this);

    this.app.on('sound:move', (soundSourceEntity) => {
        // console.log("sound source is moving");
        const soundSourceIndex = this.soundSources.findIndex((source) => {
            return source._guid == soundSourceEntity._guid;
        });
        // console.log(soundSourceEntity);
        this.updateFilter(soundSourceEntity, soundSourceIndex);
    }, this);

    this.entityPosition = this.entity.getPosition().clone();
    this.routingBuilt = false;
};


FilterFx.prototype.buildRouting = function() {
    const speakers = this.app.systems.sound.context.destination;
    // this.filterEffect.connect(speakers);
    this.sourceEffectNodes = [];
    this.soundSources.forEach((sourceEntity) => {
        let source = sourceEntity.sound;
        let slots = source.slots;
        let slotName = Object.entries(slots)[0][0];

        source.play(slotName);
        console.log("connecting source", source);
        const filterNode = this.audioContext.createBiquadFilter();

        filterNode.type = "lowpass";

        filterNode.frequency.value = 100;
        filterNode.gain.value = 1;

        filterNode.Q.value = 1;

        this.sourceEffectNodes.push({firstNode: filterNode, lastNode: filterNode});
    });
};

// update code called every frame
FilterFx.prototype.registerSoundSource = function(newSoundSource) {
    console.log("registering sound source to reverb fx", newSoundSource);
    this.soundSources.push(newSoundSource);
};

FilterFx.prototype.updateFilter = function(soundSource, i) {
    const entityPosition = this.entityPosition.clone();
    entityPosition.z = 0;
    const soundSourcePosition = soundSource.getPosition().clone();
    soundSourcePosition.z = 0;
    const distance = soundSourcePosition.distance(entityPosition);
    // console.log(`Updating filter effect for source: ${i}`);
    // console.log(distance);
    // Determine left right
    // // console.log(soundSourcePosition.x, soundSourcePosition.y);
    // console.log(soundSourcePosition.y);
    // console.log((soundSourcePosition.y + 3)/8);
    // console.log(Math.sin(((soundSourcePosition.y + 3)/8) * Math.PI) * 8000);

    // console.log(Math.min(Math.max(Math.sin(((soundSourcePosition.y + 3)/8) * Math.PI) * 8000 + 100, 100), 22000));
    // console.log(Math.sin(((soundSourcePosition.y + 6)/18) * Math.PI));
    // const filterFreq = Math.min(Math.max((2/(distance * distance * distance * distance + 0.01)) * 8000 + 100, 100), 22000);
    const filterFreq = Math.min(Math.max(Math.sin(((soundSourcePosition.y + 3)/8) * Math.PI) * 8000 + 100, 100), 22000);
    this.sourceEffectNodes[i]['firstNode'].frequency.value = filterFreq;
};

FilterFx.prototype.entityMoved = function() {
    this.entityPosition = this.entity.getPosition().clone();
    // If reverb entity moved calculate distance to all sound sources
    this.soundSources.forEach((soundSource, i) => {
        this.updateFilter(soundSource, i);
    });
};

FilterFx.prototype.update = function() {
    if (this.entityPosition.equals(this.entity.getPosition())) return;

    this.entityMoved();
};

// swap method called for script hot-reloading
// inherit your script state here
FilterFx.prototype.swap = function(old) { 
    this.initialize();
};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/