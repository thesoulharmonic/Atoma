var AudioControl = pc.createScript('audioControl');

AudioControl.attributes.add('fxEntities', {
    type: 'entity',
    array: true,
    title: 'FX Entities'
});

// initialize code called once per entity
AudioControl.prototype.initialize = function() {
    this.soundSources = [];
    this.routingBuilt = false;

    this.app.on("audio:setupRouting", function() {
        this.setupAudio();
    }.bind(this));
};

AudioControl.prototype.setupAudio = function() {
    this.refreshAudioSources();
    this.app.systems.sound.volume = 0;
    this.playSources();
    // setTimeout(() => {
    //     this.setupRoutingChainForSourceSlots();
    //     this.app.systems.sound.volume = 1;
    // }, 5000);
    this.setupRoutingChainForSourceSlots();
    this.app.systems.sound.volume = 1;
}

AudioControl.prototype.postInitialize = function() {
    this.setupAudio();
    // window.addEventListener('focus', () => {
    //     this.setupRoutingChainForSourceSlots();
    // });
};

AudioControl.prototype.playSources = function() {
    console.log(this.soundSources);
    if (this.soundSources.length )
    this.soundSources.forEach((sourceEntity) => {
        let source = sourceEntity.sound;
        let slots = source.slots;
        let slotName = Object.entries(slots)[0][0];
        // console.log(Object.entries(slots)[0][0]);
        // console.log(slotName);
        // console.log(source);
        source.play(slotName);
        console.log("Playing source", source);
        console.log(source);
    });
};

AudioControl.prototype.setupRoutingChainForSourceSlots = function() {
    console.log(this.soundSources);
    const speakers = this.app.systems.sound.context.destination;
    console.log(this.app.systems.sound);

    // this.soundSources.forEach((sourceEntity, i) => {
    for (let i = 0; i < this.soundSources.length; i++) {
        let sourceEntity = this.soundSources[i];
        let source = sourceEntity.sound;
        let slots = source.slots;
        let slotName = Object.entries(slots)[0][0];
        // connect each source module as a chain
        console.log(sourceEntity);
        if (slots[slotName].instances[0]._preConnectorNode) {
            // setTimeout(() => {
            //     if (i == this.soundSources.length - 1) {
            //         this.app.systems.sound.volume = 1;
            //     }
            // }, 600);
            continue;
        };

        let stereoFx = [];
        // Build up large fx chain plugging in each effect one after the other
        const sourceEffectNodeList = this.fxEntities.map((fxEntity) => {
            console.log(fxEntity);
            let effectNodes = {};
            if (fxEntity.script['reverbFx'] && fxEntity.script['reverbFx'].enabled) {
                const reverbEffect = fxEntity.script['reverbFx'];
                return reverbEffect.sourceEffectNodes[i];
            } else if (fxEntity.script['reverbStereoFx'] && fxEntity.script['reverbStereoFx'].enabled) {
                const reverbStereoEffect = fxEntity.script['reverbStereoFx'];
                stereoFx.push(reverbStereoEffect.sourceEffectNodes[i]);
                return undefined;
            } else if (fxEntity.script['filterFx'] && fxEntity.script['filterFx'].enabled) {
                const filterEffect = fxEntity.script['filterFx'];
                return filterEffect.sourceEffectNodes[i];
            }
        })
        .filter((effect) => effect !== undefined);
        
        let currentEffect = sourceEffectNodeList[0];
        console.log(sourceEffectNodeList.length)
        console.log(currentEffect);

        for (let i = 1; i < sourceEffectNodeList.length - 1; i++) {
            console.log("Source effect node")
            console.log(sourceEffectNodeList[i]) 
            if (sourceEffectNodeList[i].firstNode && currentEffect.lastNode) {
                console.log("Connect", currentEffect.lastNode, "to", sourceEffectNodeList[i].firstNode);
                currentEffect.lastNode.connect(sourceEffectNodeList[i].firstNode);
                currentEffect = sourceEffectNodeList[i];
            }
        }
        const firstNodeInChain = sourceEffectNodeList[0].firstNode;
        const lastNodeInChain = currentEffect.lastNode;
        console.log(slots);
        console.log("First node", firstNodeInChain, "Last node", lastNodeInChain);
        console.log(slots[slotName]);

        // // this.playSources();
        // setTimeout(() => {

        //     if (i == this.soundSources.length - 1) {
        //         this.app.systems.sound.volume = 1;
        //     }
        // }, 500);
        console.log(slots[slotName].instances[0])
        if (slots[slotName].instances[0].source) {
            // console.log(firstNodeInChain);
            // console.log(lastNodeInChain);
            // console.log(slots[slotName].instances[0]);

            // console.log(slots[slotName].instances[0]._connectorNode);
            // console.log(slots[slotName].instances[0]._inputNode);

            // console.log(slots[slotName].instances[0].panner);
            const sourceNode = slots[slotName].instances[0].source;
            const inputNode = slots[slotName].instances[0]._inputNode;
            // const connectorNode = slots[slotName].instances[0]._connectorNode;
            // sourceFirstNode.gain.value = 0;
            // connectorNode.disconnect(speakers);
            // const sourceLastNode = slots[slotName].instances[0].panner;
            console.log("Connect", sourceNode, "to", firstNodeInChain);
            slots[slotName].instances[0]._preConnectorNode = firstNodeInChain;
            try {
                sourceNode.disconnect(inputNode);
                sourceNode.connect(firstNodeInChain);
                lastNodeInChain.connect(inputNode);
                console.log("connect stereo FX")
                console.log(stereoFx);
                stereoFx.forEach((effect, j) => {
                    console.log("Connecting to stereo fx", effect)
                    lastNodeInChain.connect(effect.firstNode);
                });
                // Parallel verb
            } catch (err) {
                throw err;
            }
        }

        // const sourceEffectChain = sourceEffectNodeList.reduce((acc, currentNode, i) => {
        //     console.log(acc);
        //     if (sourceEffectNodeList[i + 1].firstNode) {
        //         console.log("still more to connect")
        //         console.log('connect', acc.lastNode, 'to', sourceEffectNodeList[i + 1].firstNode);
        //         return {firstNode: acc.lastNode.connect(sourceEffectNodeList[i + 1].firstNode)};
        //     } else {
        //         console.log("End of list");
        //         return acc;
        //     }
        // }, sourceEffectNodeList[0]);

    };
};

AudioControl.prototype.getSoundSourceEntities = function(entity, array) {
    if (entity.sound && entity.enabled) {
        array.push(entity);
        return;
    } else if (entity._children) {
        entity._children.forEach((entityChild) => {
            return this.getSoundSourceEntities(entityChild, array);
        });
        return;
    }
    return array;
};

AudioControl.prototype.refreshAudioSources = function() {
    let entities = this.app.scene.root;
    let soundSourceEntities = [];
    this.getSoundSourceEntities(entities, soundSourceEntities);
    this.soundSources = soundSourceEntities;

    this.soundSources.forEach((soundSource) => {
        this.app.fire('sound:registerSound', soundSource);
    });
    this.app.fire('sound:buildrouting');
};

// swap method called for script hot-reloading
// inherit your script state here
AudioControl.prototype.swap = function() {
    this.postInitialize();
};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/