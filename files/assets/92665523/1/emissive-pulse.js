var EmissivePulse = pc.createScript('emissivePulse');

EmissivePulse.attributes.add('shaderChunk', {
    type: 'asset',
    title: 'Shader Chunk',
    description: ''
});

// initialize code called once per entity
EmissivePulse.prototype.initialize = function() {
    console.log(this.entity.name);
    console.log(this.entity);

    console.log(pc.shaderChunks);
    this.randomOffset = Math.random() * 0.02;
    this.timer = 0;
    if (this.shaderChunk.resource) {
        console.log(this.entity.render.material);
        this.entity.render.meshInstances.forEach((meshInstance) => {
            meshInstance.material.chunks.emissivePS = this.shaderChunk.resource;
            meshInstance.material.emissive.set(1, 1, 1);
            meshInstance.material.emissiveIntensity = 0.25;

            meshInstance.material.update();
            meshInstance.material.setParameter("iResolution", new pc.Vec3(this.app.graphicsDevice.width, this.app.graphicsDevice.height, 0.0).data);
        });

    }
};

// update code called every frame
EmissivePulse.prototype.update = function(dt) {
    this.entity.render.meshInstances.forEach((meshInstance) => {
        meshInstance.material.setParameter('iTime', this.timer);
        meshInstance.material.update();
    });
    this.entity.render.material.setParameter('iTime', this.timer);
    this.entity.render.material.update();
    this.timer += dt + this.randomOffset;
};

// swap method called for script hot-reloading
// inherit your script state here
EmissivePulse.prototype.swap = function(old) {
    this.initialize();
};

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/