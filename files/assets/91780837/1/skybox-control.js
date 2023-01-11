var SkyboxControl = pc.createScript('skyboxControl');
SkyboxControl.attributes.add("shader", {
    type: "asset",
    assetType: "shader"
});
SkyboxControl.attributes.add("alphaShader", {
    type: "asset",
    assetType: "shader"
});
SkyboxControl.attributes.add("dithering", {
    type: "asset",
    assetType: "texture"
});
SkyboxControl.attributes.add("skybox", {
    type: "asset",
    assetType: "cubemap"
});
// initialize code called once per entity
SkyboxControl.prototype.initialize = function() {
    const app = this.app;
    pc.shaderChunks.skyboxHDRPS = app.assets.find("skyboxShaderTest").resource;
    this.timer = 0.0; 
    this.initialParamsSet = false;
    this.material;
};

SkyboxControl.prototype.postInitialize = function() {
    // console.log(this.app.scene.skyboxModel);

    // this.material = this.app.scene.skyboxModel.meshInstances[0].material;
    // this.material.setParameter("iResolution", new pc.Vec3(this.app.graphicsDevice.width,this.app.graphicsDevice.height,0).data);

    // this.material.update();
    this.app.on('analyzer:loudness', function (loudness) {
        if (!this.initialParamsSet) return;
        this.material.setParameter("iColorIntensity", loudness + 0.2    );
        this.material.update();
    }.bind(this));
}

SkyboxControl.prototype.swap = function() {
    this.initialize();
    this.postInitialize();
}

// update code called every frame
SkyboxControl.prototype.update = function(dt) {
    const app = this.app;
    this.timer += dt;
    if (app.scene.skyboxModel) { // wait for skybox being created
        if (!this.initialParamsSet) {
            this.material = app.scene.skyboxModel.meshInstances[0].material;

            this.material.setParameter("iResolution", new pc.Vec3(this.app.graphicsDevice.width,this.app.graphicsDevice.height,0).data);
            this.initialParamsSet = true;
            window.onresize = function(e) {
                this.material.setParameter("iResolution", new pc.Vec3(this.app.graphicsDevice.width,this.app.graphicsDevice.height,0).data);
            }.bind(this);
        }
        this.material.setParameter("iTime", this.timer);
        this.material.update();
    }
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/