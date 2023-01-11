class MatrixMixerProcessor extends AudioWorkletProcessor {
    constructor(options) {
        console.log(options);
        super();
        this.numberOfInputs = options.numberOfInputs;
        this.numberOfOutputs = options.numberOfOutputs;
        // this.mixValues = this._initializeGainValues();
    }

    static get parameterDescriptors () {
        return [{
            name: 'volume',
            defaultValue: 1,
            minValue: 0,
            maxValue: 1,
            automationRate: 'a-rate'
        }];
    }

    process (inputs, outputs, parameters) {
        const noInputs = inputs.length;
        outputs[0].forEach((outputChannelBuffer, outputChanNo) => {
            inputs[0].forEach((inputChannelBuffer, inputChanNo) => {
                // Add each sample in buffer
                outputChannelBuffer.forEach((outputSample, i) => {
                    outputSample += (inputChannelBuffer[i]/noInputs) * 1;
                });
            });
        });
        return true;
    }
}

registerProcessor('matrix-mixer-processor', MatrixMixerProcessor);