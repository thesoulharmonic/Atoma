var UiButton = pc.createScript('uiButton');

// initialize code called once per entity
UiButton.prototype.initialize = function() {
    const button = this.entity.button;
    button.on('hoverstart', function () { 
        this.app.fire("raycast:disable", true); 
        document.body.style.cursor = 'pointer'; 
    }.bind(this));
    button.on('hoverend', function () { 
        this.app.fire("raycast:disable", false); 
        document.body.style.cursor = 'default'; 
    }.bind(this));
};

// swap method called for script hot-reloading
// inherit your script state here
// UiButton.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/