var PickerRaycast = pc.createScript('pickerRaycast');

// initialize code called once per entity
PickerRaycast.prototype.initialize = function() {
    this.dragging = false;
    this.selectedEntity = undefined;
    this.hoveredEntity = undefined;
    this.mouseDownOriginalPosition = new pc.Vec3();
    this.deltaPositionChange = new pc.Vec3();
    this.currentPosition = new pc.Vec3();
    this.plane = undefined;
    this.currentTime = 0;
    this.ray = new pc.Ray();
    this.disabled = false;

    this.app.on("raycast:disable", function(state) {
        this.disabled = state;
    }.bind(this));

    this.app.on('mouse:move', function (mouseEvent) {
        if (this.disabled) return;
        if (!this.selectedEntity || !this.dragging) {
            this.onHover(mouseEvent);
        } else {
            this.onSelect(mouseEvent);
        }
    }.bind(this));

    this.app.on('mouse:down', function (mouseEvent) {
        if (this.disabled) return;
        this.onSelect(mouseEvent);
        this.dragging = true;
    }, this);

    this.app.on('mouse:up', function (mouseEvent) {
        if (this.disabled) return;
        this.dragging = false;
        this.selectedEntity = undefined;
        this.plane = undefined;
        this.currentTime = 0;
    }, this);
};

PickerRaycast.firstHitPosition = new pc.Vec3();
PickerRaycast.hitPosition = new pc.Vec3();
PickerRaycast.dragPosition = new pc.Vec3();
PickerRaycast.deltaPosition = new pc.Vec3();
PickerRaycast.newPosition = new pc.Vec3();

PickerRaycast.prototype.onHover = function (mouseEvent) {
    from = this.entity.camera.screenToWorld(mouseEvent.x, mouseEvent.y, this.entity.camera.nearClip);
    to = this.entity.camera.screenToWorld(mouseEvent.x, mouseEvent.y, this.entity.camera.farClip, this.ray.direction);
    var result = this.app.systems.rigidbody.raycastFirst(from, to);
    if (!result) {
        document.body.style.cursor = "default";
        this.hoveredEntity = null;
        return;
    };

    if (!this.hoveredEntity) {
        this.hoveredEntity = result.entity;
        if (this.hoveredEntity.script) {
            if (this.hoveredEntity.script.hoverEffect) {
                this.hoveredEntity.script.hoverEffect.enableHover();
                document.body.style.cursor = "pointer";
            } 

            // if (this.hoveredEntity.script.onHover) {
            //     this.hoveredEntity.script.onHover.hoverEnabled(true);
            // }
        } 
    }
    else if (result.entity.name != this.hoveredEntity.name) {
        console.log("Found a new object", result.entity.name);
        if (result.entity.script) {
            if (result.entity.script.hoverEffect) {
                result.entity.script.hoverEffect.enableHover();
                document.body.style.cursor = "pointer";
            } else {
                document.body.style.cursor = "default";
            }

            // if (this.hoveredEntity.script.onHover) {
            //     this.hoveredEntity.script.onHover.hoverEnabled(true);
            // } else {
            //     this.hoveredEntity.script.onHover.hoverEnabled(false);
            // }
        } else {
            document.body.style.cursor = "default";
        }

        if (this.hoveredEntity.script) {
            if (this.hoveredEntity.script.hoverEffect) {
                this.hoveredEntity.script.hoverEffect.disableHover();
            }
        }
        this.hoveredEntity = result.entity;  
    }
};

PickerRaycast.prototype.onSelect = function (mouseEvent) {
    var from, to;
    if (this.dragging && this.selectedEntity) {
        this.entity.camera.screenToWorld(mouseEvent.x, mouseEvent.y, this.entity.camera.farClip, this.ray.direction); 
        this.ray.origin.copy(this.entity.getPosition());
        this.ray.direction.sub(this.ray.origin).normalize();
        var deltaPosition = PickerRaycast.deltaPosition;
        
        var intersecting = this.plane.intersectsRay(this.ray, PickerRaycast.hitPosition);  
        this.currentTime = 0;      
        if (intersecting) {
            deltaPosition.sub2(PickerRaycast.hitPosition, PickerRaycast.firstHitPosition);
            deltaPosition.add(this.selectedEntity.getPosition());   
            this.selectedEntity.setPosition(deltaPosition);

            PickerRaycast.firstHitPosition = PickerRaycast.hitPosition.clone();
        }  
    } else {
        from = this.entity.camera.screenToWorld(mouseEvent.x, mouseEvent.y, this.entity.camera.nearClip);
        to = this.entity.camera.screenToWorld(mouseEvent.x, mouseEvent.y, this.entity.camera.farClip, this.ray.direction);

        var result = this.app.systems.rigidbody.raycastFirst(from, to);
        if (result) {
            // console.log("Select entity: ", result.entity.name);
            this.selectedEntity = result.entity;
            this.plane = new pc.Plane(this.selectedEntity.getPosition().clone(), new pc.Vec3(0, 0, -1));

            this.entity.camera.screenToWorld(mouseEvent.x, mouseEvent.y, this.entity.camera.farClip, this.ray.direction); 
            this.ray.origin.copy(this.entity.getPosition());
            this.ray.direction.sub(this.ray.origin).normalize();            
            this.plane.intersectsRay(this.ray, PickerRaycast.firstHitPosition);    
        }
    }
};

PickerRaycast.prototype.swap = function(old) {
    this.initialize();
};