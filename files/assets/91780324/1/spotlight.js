// based on https://github.com/jeromeetienne/threex.volumetricspotlight

var Spotlight = pc.createScript('spotlight');

// Example of creating curve attribute with multiple curves (in this case, x, y, z)
Spotlight.attributes.add('peakRadius', {type: 'number', default: 0.1, title: 'Peak radius of light cone'});
Spotlight.attributes.add('offsetCurve', {type: 'curve', title: 'Offset Curve', curves: [ 'x', 'y', 'z' ]});
Spotlight.attributes.add('duration', {type: 'number', default: 3, title: 'Duration (secs)'});
Spotlight.attributes.add('angelPower', {type: 'number', default: 5, min: 0, max: 10, title: 'Angel power'});
Spotlight.attributes.add('attenuationFactor', {type: 'number', default: 1, min: 0, max: 1, title: 'Attenuation factor of light range'});
Spotlight.attributes.add('vertexShader', {type: 'asset', title: 'Vertex Shader'});
Spotlight.attributes.add('fragmentShader', {type: 'asset', title: 'Fragment Shader'});


// initialize code called once per entity
Spotlight.prototype.initialize = function() {
    
    // Store the original rotation of the entity so we can offset from it
    this.startRotation = this.entity.getEulerAngles().clone();
    
    // Keep track of the current rotation
    this.rotation = new pc.Vec3();
    
    this.time = 0;
    
    
    var lightRange = this.entity.light.range;
    var outherConeAngle = this.entity.light.innerConeAngle;
    var lightColor = this.entity.light.color;
    var lightRadius = Math.tan(outherConeAngle * pc.math.DEG_TO_RAD) * lightRange;
    var lightPosition = this.entity.getPosition();
    
    
    // create the cone entity
    lightCone = new pc.Entity('lightCone');
    this.entity.addChild(lightCone);
    
    // create the cone mesh
    var mesh = pc.createCone(this.app.graphicsDevice, {
        height: lightRange,
        baseRadius: lightRadius,
        peakRadius: this.peakRadius,
        capSegments: 48,
        heightSegments: 12
        
    });   
    
  
    // vertex and fragment shader
    var vertexShader = this.vertexShader.resource;
    var fragmentShader = 'precision ' + this.app.graphicsDevice.precision + ' float;\n';
    fragmentShader = fragmentShader + this.fragmentShader.resource;
    
    // A shader definition used to create a new shader.
    var shaderDefinition = {
        attributes: {
            aPosition: pc.SEMANTIC_POSITION,
            aNormal: pc.SEMANTIC_NORMAL,
        },
        vshader: vertexShader,
        fshader: fragmentShader
    };

    // Create the shader from the definition
    var shader = new pc.Shader(this.app.graphicsDevice, shaderDefinition);

    // Create a new material and set the shader
    var material = new pc.Material();
    material.shader = shader;
    material.setParameter('u_lightColor', [lightColor.r, lightColor.g, lightColor.b]);         
    material.setParameter('u_spotPosition', [lightPosition.x, lightPosition.y, lightPosition.z]);
    material.setParameter('u_attenuation', lightRange * this.attenuationFactor);
    material.setParameter('u_anglePower', this.angelPower);
    
    material.depthWrite = false;
    material.blend = true;
    material.blendType = pc.BLEND_NORMAL;
    
    /*
    material.blendSrc = pc.gfx.BLENDMODE_SRC_ALPHA;
    material.blendDst = pc.gfx.BLENDMODE_ONE_MINUS_SRC_ALPHA;
    */
            
    // create the cone model
    var node = new pc.GraphNode();
    var meshInstance = new pc.MeshInstance(node, mesh, material);
    //meshInstance.castShadow = false;    
    //meshInstance.receiveShadow = false;
    
    var model = new pc.Model();
    model.graph = node;
    model.meshInstances.push(meshInstance);    
    
    lightCone.addComponent('model');
    lightCone.model.model = model;
    //lightCone.model.receiveShadows = false;
    lightCone.model.castShadows = false;
    
    //lightCone.setLocalScale(lightRadius * 2, lightRange, lightRadius * 2);
    lightCone.setLocalPosition(0, -lightRange/2, 0);
};

// update code called every frame
Spotlight.prototype.update = function(dt) {
    this.time += dt;
    
    // Loop the animation forever
    if (this.time > this.duration) {
        this.time -= this.duration;
    }
    
    // Calculate how far in time we are for the animation
    var percent = this.time / this.duration;
    
    // Get curve values using current time relative to duration (percent)
    // The offsetCurve has 3 curves (x, y, z) so the returned value will be a set of 
    // 3 values
    var curveValue = this.offsetCurve.value(percent);
    
    // Create our new position from the startPosition and curveValue
    this.rotation.copy(this.startRotation);
    this.rotation.x += curveValue[0];
    this.rotation.y += curveValue[1];
    this.rotation.z += curveValue[2];
    //this.rotation.z = -60;
    
    this.entity.setEulerAngles(this.rotation);
    
};

// swap method called for script hot-reloading
// inherit your script state here
// Spotlight.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/