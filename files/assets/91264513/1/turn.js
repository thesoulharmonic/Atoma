var Turn = pc.createScript('turn');

Turn.prototype.update = function(dt) {
    this.entity.rotate(0, 45 * dt, 0);
};
