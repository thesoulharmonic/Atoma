var SceneLoader = pc.createScript('sceneLoader');

SceneLoader.attributes.add("introScene", {
    type: "entity"
});

SceneLoader.attributes.add("mainScene", {
    type: "entity"
});

// initialize code called once per entity
SceneLoader.prototype.initialize = function() {
    console.log(pc);
    console.log(this.app);

    this.sceneRootEntity = this.app.root.findByName("SceneRoot");
    this._loadingScene = false;

    this.mainSceneLoaded = false;

    // this.loadScene = function(sceneName) {
    //     console.log("Loading: ", sceneData);
    //     // if (sceneToLoad !== this.currentWaypointInfo.playcanvasScene) {
    //     //     // Mock scene loader function if not loading from Root scene
    //     //     this.currentWaypointInfo.playcanvasScene = sceneToLoad;
    //     //     if (this.useChangeSceneFunction) {
    //     //         this.app.scenes.changeScene(sceneToLoad, () => {
    //     //             console.log(this.app.root);
    //     //         });
    //     //     } else {
    //     //         this.loadScene(sceneToLoad);
    //     //     }
    //     // }

    // }.bind(this);

    window.addEventListener("blur", () => {
        // console.log("window focused");
        this.app.fire("scene:load", this.introScene.name);
    })

    this.app.on("scene:load", function (sceneName) {
        // console.log("loading scene");
        if (sceneName == this.introScene.name) {
            this.introScene.enabled = true;
            this.mainScene.enabled = false;
        } else {
            this.introScene.enabled = false;
            this.mainScene.enabled = true;
            if (this.mainSceneLoaded) {
                // this.app.fire("sound:buildrouting");
                this.app.fire("audio:setupRouting");
            }
            this.mainSceneLoaded = true;
        }
        // this.loadScene(sceneName);
    }.bind(this));
};

SceneLoader.prototype.loadScene = function (sceneName) {
    // if (!this._loadingScene) {
    //     this._loadingScene = true;
        
    //     // Remove the current scene that is loaded
    //     if (this.sceneRootEntity.children.length > 0) {
    //         // Assume that there is only one entity attached to the sceneRootEntity
    //         // which would be the loaded scene
    //         this.sceneRootEntity.children[0].destroy();
    //     }
    
    //     var self = this;
    //     var scene = this.app.scenes.find(sceneName);
    //     this.app.scenes.loadSceneHierarchy(scene, function (err, loadedSceneRootEntity) {
    //         if (err) {
    //             console.error(err);
    //         } else {
    //             loadedSceneRootEntity.reparent(self.sceneRootEntity);    
    //             self._loadingScene = false;
    //         }
    //     });
    // }
};

// swap method called for script hot-reloading
// inherit your script state here
// SceneLoader.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/