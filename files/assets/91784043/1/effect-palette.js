var EffectPalette = pc.createScript("effectPalette");
EffectPalette.attributes.add("shader", {
    type: "asset",
    assetType: "shader"
});
EffectPalette.attributes.add("alphaShader", {
    type: "asset",
    assetType: "shader"
});
EffectPalette.attributes.add("dithering", {
    type: "asset",
    assetType: "texture"
});
EffectPalette.attributes.add("skybox", {
    type: "asset",
    assetType: "cubemap"
});
EffectPalette.prototype.initialize = function() {
    this.moveAngles = new pc.Vec3();
    // this.camera = this.entity.parent;
    this.camera = this.app.root.findByTag('camera')[0];
    this.player = this.app.root.findByTag("player")[0];
    this.timer = 0;
    this.material = this.entity.render.meshInstances[0].material;
    console.log(this.entity.render.meshInstances[0]);
    console.log(this.material);
    console.log(this.shader.resource);
    console.log(this.alphaShader.resource);
    console.log(new pc.Vec3(this.app.graphicsDevice.width,this.app.graphicsDevice.height,0).data);

    this.material.chunks.diffusePS = this.shader.resource;
    this.material.chunks.reflectionCubePS = this.alphaShader.resource;
    this.material.setParameter("texture_dithering", this.dithering.resource);
    this.material.setParameter("texture_skybox", this.skybox.resource);
    this.material.setParameter("iResolution", new pc.Vec3(this.app.graphicsDevice.width,this.app.graphicsDevice.height,0).data);
    window.onresize = function(e) {
        this.material.setParameter("iResolution", new pc.Vec3(this.app.graphicsDevice.width,this.app.graphicsDevice.height,0).data);
    }.bind(this);
    this.material.update();
    console.log(this.material);
};

EffectPalette.prototype.update = function(e) {
    if (!1 === this.ready)
        return !1;
    this.material.setParameter("lookDir", this.camera.forward.data);
    this.timer += e;
    this.material.setParameter("iTime", this.timer);
    // this.player.setEulerAngles(9 * Math.sin(this.timer), 0, 0);
};

EffectPalette.prototype.swap = function(e) {
    this.initialize();
};

EffectPalette.prototype.setMoveDir = function(e) {
    // this.player.setLocalEulerAngles(0, e, 0);
};
