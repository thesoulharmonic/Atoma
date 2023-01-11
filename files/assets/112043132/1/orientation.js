var Orientation = pc.createScript('orientation');

// initialize code called once per entity
Orientation.prototype.initialize = function() {
    this.isMobile = this.isOnMobile();
    console.log("is on mobile", this.isMobile);
    this.canvas = this.app.graphicsDevice.canvas;
    this.landscape = this.isLandscape();
    if (this.landscape && this.isMobile) {
        console.log("setting landscape");
        this.canvas.classList.add('fill-mode-FILL_WINDOW');
        this.canvas.classList.remove('fill-mode-KEEP_ASPECT');
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO, 1920, 1080);
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW, 1920, 1080);
        this.resizeCanvas(this.app, this.app.graphicsDevice.canvas);
    } else if (!this.landscape && this.isMobile) {
        console.log("setting portrait");
        this.canvas.classList.remove('fill-mode-FILL_WINDOW');
        this.canvas.classList.add('fill-mode-KEEP_ASPECT');
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO, 1920, 1080);
        this.app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT, 1920, 1080);
        this.resizeCanvas(this.app, this.app.graphicsDevice.canvas);
    } else {
        console.log("not on mobile");
        // this.canvas.classList.add('fill-mode-FILL_WINDOW');
        // this.canvas.classList.remove('fill-mode-KEEP_ASPECT');
        // this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        // this.app.resizeCanvas();
    }

};
Orientation.prototype.resizeCanvas = function (app, canvas) {
    canvas.style.width = '';
    canvas.style.height = '';
    app.resizeCanvas(canvas.width, canvas.height);

    var fillMode = app._fillMode;

    if (fillMode == pc.FILLMODE_NONE || fillMode == pc.FILLMODE_KEEP_ASPECT) {
        if ((fillMode == pc.FILLMODE_NONE && canvas.clientHeight < window.innerHeight) || (canvas.clientWidth / canvas.clientHeight >= window.innerWidth / window.innerHeight)) {
            canvas.style.marginTop = Math.floor((window.innerHeight - canvas.clientHeight) / 2) + 'px';
        } else {
            canvas.style.marginTop = '';
        }
    }

    lastWindowHeight = window.innerHeight;
    lastWindowWidth = window.innerWidth;

    // Work around when in landscape to work on iOS 12 otherwise
    // the content is under the URL bar at the top
    if (this.iosVersion && this.iosVersion[0] <= 12) {
        window.scrollTo(0, 0);
    }
};
Orientation.prototype.isOnMobile = function () {
    let details = navigator.userAgent;
    let regexp = /android|iphone|kindle|ipad/i;
    let isMobileDevice = regexp.test(details);
    return isMobileDevice;
};

Orientation.prototype.isLandscape = function () {
    return window.matchMedia("(orientation: landscape)").matches;
};

// update code called every frame
Orientation.prototype.update = function(dt) {
    // console.log("matches landscape:", window.matchMedia("(orientation: portrait)").matches);
    // console.log("matches portrait:", window.matchMedia("(orientation: landscape)").matches);
    let isLandscape = this.isLandscape();
    if (!isLandscape && this.landscape && this.isMobile) {
        console.log("setting portrait");
        this.canvas.classList.remove('fill-mode-FILL_WINDOW');
        this.canvas.classList.add('fill-mode-KEEP_ASPECT');
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO, 1920, 1080);
        this.app.setCanvasFillMode(pc.FILLMODE_KEEP_ASPECT, 1920, 1080);
        this.resizeCanvas(this.app, this.app.graphicsDevice.canvas);
        this.landscape = false;
    }

    if (isLandscape && !this.landscape && this.isMobile) {
        console.log("setting landscape");
        this.canvas.classList.add('fill-mode-FILL_WINDOW');
        this.canvas.classList.remove('fill-mode-KEEP_ASPECT');
        this.app.setCanvasResolution(pc.RESOLUTION_AUTO, 1920, 1080);
        this.app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW, 1920, 1080);
        this.resizeCanvas(this.app, this.app.graphicsDevice.canvas);
        console.log(this.app.fillMode);
        this.landscape = true;
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Orientation.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/