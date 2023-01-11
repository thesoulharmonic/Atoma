var ReverbZone = pc.createScript('reverbZone');

ReverbZone.attributes.add('listener', {
    title: 'Audio Listener Entity',
    type: 'entity'
});

ReverbZone.attributes.add('verbType', {
    type: 'asset',
    assetType: 'audio'
});

// initialize code called once per entity
ReverbZone.prototype.initialize = function() {
    // console.log(this.entity);
    // Find all immediate audio source in collision zone
    console.log(this.listener.audiolistener);
    console.log(this.listener.audiolistener.system.manager.context);
    this.audioContext = this.listener.audiolistener.system.manager.context;

    this.channelSplitter = this.app.systems.sound.context.createChannelSplitter(2);
    console.log(this.channelSplitter);
    this.convolver = this.app.systems.sound.context.createConvolver();
    this.convolveSendGain = this.app.systems.sound.context.createGain();

    this.channelSplitter.connect(this.audioContext.destination, 0);
    this.channelSplitter.connect(this.convolver, 1);
    this.convolver.connect(this.convolveSendGain, 0, 0);
    this.convolveSendGain.connect(this.audioContext.destination, 0);


    let asset = this["verbType"];
    this.convolver.buffer = asset.resource.buffer;
    this.audioSources = [];
    this.zoneCentre = this.entity.getPosition();
    this.zoneRadius = this.entity.collision.radius; // This is the zone distance
    this.zoneHalfExtents = this.entity.collision.halfExtents; // This is the distance to centre

    this.insideZone = false;

    this.entity.collision.on('triggerenter', this.onZoneEnter, this);
    this.entity.collision.on('triggerleave', this.onZoneExit, this);

    console.log(this.listenerEntity);
    // this.listener = this.listenerEntity.entity.  
    this.refreshAudioSources();

    this.app.on('listener:move', function(x, y, z) {
        if (!this.insideZone) return;
        // If listener is in zone, increase reverb send of all sources according to inverse of distance 1/distance to centre
        let listenerCoord = new pc.Vec3(x, y, z);
        let distance = listenerCoord.distance(this.zoneCentre);
        let inverseDistance = 1/(distance * distance);
        console.log(1 - inverseDistance);
        this.convolveSendGain.gain = 1 - inverseDistance;
    }, this);
};

// Collects entire scene audio sources and loads them into the reverb mixer
ReverbZone.prototype.refreshAudioSources = function() {
    console.log(this.app.scene.root);

    let entities = this.app.scene.root._children;
    let soundSources = [];
    console.log(entities);
    soundSources = entities.filter((entity) => {
        if (entity.sound) return true;
    });

    console.log(soundSources);
    // console.log(soundSources);
    soundSources.map((soundSource) => {
        console.log(soundSource.sound.slots);
        let slots = soundSource.sound.slots;

        Object.entries(slots).forEach(([key, value]) => {
            // do something with key and val
            console.log({...slots[key].instances[0]});
            console.log(slots[key].instances[0]);
            console.log(slots[key].instances[0]._connectorNode);
            // slots[key].instances[0].gain.connect(this.convolver, 0, 0);
            slots[key].instances[0].gain.connect(this.channelSplitter, 0);
            console.log(slots[key].instances[0]);
        });
    });
};

ReverbZone.prototype.findListener = function() {
    // console.log(this.app.scene.root);

    // let entities = this.app.scene.root._children;
    // let soundSources = [];
    // console.log(entities);
    // soundSources = entities.filter((entity) => {
    //     if (entity.sound) return true;
    // });

    // // console.log(soundSources);
    // soundSources.map((soundSource) => {
    //     console.log("Hi");
    //     console.log(soundSource.sound.slots);
    //     // soundSource.sound.slots.map((slot) => {
    //     //     console.log(slot);
    //     //     // setExternalNodes(this.convolver);
    //     // });
    // });
};

ReverbZone.prototype.onZoneEnter = function() {
    console.log("Reverb zone entered");
    this.insideZone = true;
};

ReverbZone.prototype.onZoneExit = function() {
    console.log("Reverb zone exited");
    this.insideZone = false;
};

// update code called every frame
ReverbZone.prototype.update = function(dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// ReverbZone.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/