var Billboard = pc.createScript('billboard');

// initialize code called once per entity
Billboard.prototype.initialize = function() {

    this.vec = new pc.Vec3();
    this.camera = this.app.root.findByName('Camera');
};

// update code called every frame
Billboard.prototype.update = function(dt) {

    this.vec.copy(this.camera.getPosition());
    this.vec.y = this.entity.getPosition().y;
    this.entity.lookAt(this.vec);
};