//--------------- POST EFFECT DEFINITION ------------------------//
pc.extend(pc, function () {

    /**
     * @name pc.VisualFeedbackEffect
     * @class Implements the VisualFeedbackEffect post processing effect.
     * @extends pc.PostEffect
     * @param {pc.GraphicsDevice} graphicsDevice The graphics device of the application
     * @property {Number} offset Controls the offset of the effect.
     * @property {Number} darkness Controls the darkness of the effect.
     */
    var VisualFeedbackEffect = function (graphicsDevice) {
        // Shaders
        var attributes = {
            aPosition: pc.SEMANTIC_POSITION
        };

        var passThroughVert = [
            "attribute vec2 aPosition;",
            "",
            "varying vec2 vUv0;",
            "",
            "void main(void)",
            "{",
            "    gl_Position = vec4(aPosition, 0.0, 1.0);",
            "    vUv0 = (aPosition.xy + 1.0) * 0.5;",
            "}"
        ].join("\n");

        var feedbackFrag = [
            "precision " + graphicsDevice.precision + " float;",
            "",
            "float norm(float v, float s) {",
            "   return 1.0 / sqrt(2.0 * 3.14) * exp(-0.5 * v * v / (s * s)) / s;",
            "}",
            "uniform float iTime;",
            "uniform sampler2D uColorBuffer;",
            "uniform sampler2D uFrameHistory[15];",
            "uniform vec3 iResolution;",
            "",
            "varying vec2 vUv0;",
            "",
            "void main() {",
            "   vec4 feedback = vec4(0.0);",
            "   vec4 currentFrame = texture2D(uColorBuffer, vUv0);",
            // "   for (int i = -1; i <= 1; i++) {",
            // "       for (int j = -1; j <= 1; j++) {",
            // "           vec2 o = vec2(i, j);",
            // "           float v = length(o);",
            // "           feedback += texture2D(uColorBuffer, (vUv0 + o / iResolution.xy - 0.5) * 1.05 + 0.5) * 0.8 * norm(v, 3.0);",
            // "       }",
            // "    }",
            "   for (int i = 0; i < 15; i++) {",
            "       vec2 o = vec2(i, i);",
            "       float v = length(o);",
            "       feedback += texture2D(uFrameHistory[i], vUv0);",
            "   }",
            "   feedback /= 15.0;",
            // "   gl_FragColor = mix(currentFrame, feedback, (sin(iTime * 2.0) + 1.0)/2.0);",
            "   gl_FragColor = mix(currentFrame, feedback, 0.5);",
            "}"
        ].join("\n");

        this.VisualFeedbackShader = new pc.Shader(graphicsDevice, {
            attributes: attributes,
            vshader: passThroughVert,
            fshader: feedbackFrag
        });
        this.device = graphicsDevice;
        this.noFrames = 15;
        this.frameHistory = new Array(this.noFrames);
        this.frameCounter = 0;
        this.shouldCapture = false;
    };
    VisualFeedbackEffect = pc.inherits(VisualFeedbackEffect, pc.PostEffect);
    VisualFeedbackEffect.prototype = pc.extend(VisualFeedbackEffect, {
        time: function(dt) {
            var scope = this.device.scope;
            scope.resolve("iTime").setValue(dt);
        },
        capture: function() {
            this.shouldCapture = true;
        },
        render: function (inputTarget, outputTarget, rect) {
            var device = this.device;
            var scope = device.scope;
            if (this.shouldCapture) {
                console.log("recording frame");
                console.log(inputTarget.colorBuffer);
                this.frameHistory[this.frameCounter] = new pc.RenderTarget().copy(inputTarget);
                this.frameCounter++;
                this.shouldCapture = false;
            }
            if (this.frameCounter == this.noFrames) {
                console.log("set frames in shader");
                scope.resolve(`uFrameHistory[0]`).setValue(this.frameHistory);
                this.frameCounter = 0;
            }
            scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);
            scope.resolve("iResolution").setValue(new pc.Vec3(device.width, device.height, 0.0).data);
            pc.drawFullscreenQuad(device, outputTarget, this.vertexBuffer, this.VisualFeedbackShader, rect);
        }
    });

    return {
        VisualFeedbackEffect: VisualFeedbackEffect
    };
}());


//--------------- SCRIPT DEFINITION------------------------//
var VisualFeedback = pc.createScript('visualFeedback');

// initialize code called once per entity
VisualFeedback.prototype.initialize = function() {
    this.effect = new pc.VisualFeedbackEffect(this.app.graphicsDevice);
    this.timer = 0;
    this.frameCapTimer = 0;

    this.frameCapInterval = 2; // secondss

    this.on('attr', function (name, value) {
        this.effect[name] = value;
    }, this);

    var queue = this.entity.camera.postEffects;
    queue.addEffect(this.effect);

    this.on('state', function (enabled) {
        if (enabled) {
            console.log("add effect");
            queue.addEffect(this.effect);
        } else {
            queue.removeEffect(this.effect);
        }
    });

    this.on('destroy', function () {
        queue.removeEffect(this.effect);
    });
};

VisualFeedback.prototype.update = function (dt) {
    this.timer += dt;
    this.frameCapTimer += dt;
    this.effect.time(this.timer);
    if (this.frameCapTimer >= this.frameCapInterval) {
        this.effect.capture();
        this.frameCapTimer = 0;
    }
};