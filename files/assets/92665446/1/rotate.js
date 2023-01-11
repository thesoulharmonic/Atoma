var Rotate = pc.createScript('rotate');

Rotate.prototype.initialize = function() {
    this.rotateSpeed = 0;
    this.app.on('setrotation', function (speed) {
        this.rotateSpeed = speed;
    }, this);

    /*this.app.on('setcolor', function (color) {
        var renders = this.entity.findComponents('render');

        for (var i = 0; i < renders.length; ++i) {
            var meshInstances = renders[i].meshInstances;
            for (var j = 0; j < meshInstances.length; j++) {
                meshInstances[j].material.diffuse.copy(color);
                meshInstances[j].material.update();
            }
        }  
    }, this);*/
};

Rotate.prototype.update = function(dt) {
    this.entity.rotate(0, this.rotateSpeed * dt, 0.05);
};