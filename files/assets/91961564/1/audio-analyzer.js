var AudioAnalyzer = pc.createScript('audioAnalyzer');

AudioAnalyzer.attributes.add('soundSourceEntity', {
    title: 'Sound Source Entity',
    type: 'entity'
});

AudioAnalyzer.attributes.add('fftsize', {
    title: 'FFT Size',
    type: 'number',
    min: 32,
    max: 32768
});

// initialize code called once per entity
AudioAnalyzer.prototype.initialize = function() {
    this.timer = 0;

    const audioContext = this.app.systems.sound.context;
     // create analyser node and set up
    this.analyser = audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = this.fftsize;

    this.freqData = new Float32Array(this.fftsize/2);
    this.timeData = new Float32Array(this.fftsize/2);
    this.timeIndex = Math.round(this.timeData.length / 2);

    var slot = this.soundSourceEntity.sound.slot("Slot 1");
    slot.setExternalNodes(this.analyser);

    this.currentSampledLoudness = 0.0;
    this.filteredLoudness = 0.0;

    // Peak filter settings
    const samplingTime = 30/1000;  // fps (could be more, need to measure)
    const smoothingTime = 500; // ms
    this.filterConstant = 1 - Math.exp(-1/(smoothingTime * samplingTime));
};

AudioAnalyzer.prototype.filter = function(x, y) {
    return this.filterConstant * (x - y);
};

// update code called every frame
AudioAnalyzer.prototype.update = function(dt) {
    this.timer += dt;
    if (this.timer >= 1) {
        // this.analyser.getFloatFrequencyData(this.freqData);
        this.analyser.getFloatTimeDomainData(this.timeData);
        this.currentSampledLoudness = Math.max(0, (1 + this.timeData[this.timeIndex]) / 2.0) * 3.0;
        this.timer = 0;
    }
    this.filteredLoudness += this.filter(this.currentSampledLoudness, this.filteredLoudness);
    // console.log(this.filteredLoudness);
    this.app.fire('analyzer:loudness', this.filteredLoudness);
    // Every few seconds get data and fire a change to lerp to new intensity
};

// swap method called for script hot-reloading
// inherit your script state here
AudioAnalyzer.prototype.swap = function() {
    this.initialize();
 };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/