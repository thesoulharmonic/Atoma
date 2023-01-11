var Ui = pc.createScript('ui');
Ui.attributes.add('screenShotButtonEntity', {type: 'entity'});

// initialize code called once per entity
Ui.prototype.initialize = function() {
    this.screenShotButtonEntity.button.on('click', function () {
        this.app.fire('ui:takeScreenshot');
    }, this);

    this.screenShotButtonEntity.button.on('touchstart', function () {
        this.app.fire('ui:takeScreenshot');
    }, this);
};