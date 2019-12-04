<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <title>FLEK</title>

        <!-- Babylon.js -->
        <script src="https://code.jquery.com/pep/0.4.2/pep.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.2/dat.gui.min.js"></script>
        <script src="https://preview.babylonjs.com/ammo.js"></script>
        <script src="https://preview.babylonjs.com/cannon.js"></script>
        <script src="https://preview.babylonjs.com/Oimo.js"></script>
        <script src="https://preview.babylonjs.com/gltf_validator.js"></script>
        <script src="https://preview.babylonjs.com/earcut.min.js"></script>
        <script src="https://preview.babylonjs.com/babylon.js"></script>
        <script src="https://preview.babylonjs.com/inspector/babylon.inspector.bundle.js"></script>
        <script src="https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js"></script>
        <script src="https://preview.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
        <script src="https://preview.babylonjs.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
        <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.js"></script>
        <script src="https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js"></script>
        <script src="https://preview.babylonjs.com/gui/babylon.gui.min.js"></script>
        
        <style>
            html, body {
                overflow: hidden;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
              -webkit-tap-highlight-color: transparent;
                 -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
            }

            #renderCanvas {
                width: 100%;
                height: 100%;
                touch-action: none;

            }
          #fpsLabel {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #999;
    cursor: default;

}


        </style>
    </head>
<body>
  <div id ="fpsLabel">
    
  </div>
    <canvas id="renderCanvas"></canvas>
    <script>
  var canvas = document.getElementById("renderCanvas");
  //needed global variable
  var level = 0
  var cacheTime = 0
  console.warn = console.error = () => {};
  console.log("%cFLEK %cGAME", "background: red; color: yellow; font-size: x-large", "background: blue; color: yellow; font-size: x-large");
  var createWorld = function () {
    
    this.scene = new BABYLON.Scene(engine);
    var scene = this.scene
    scene.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.AmmoJSPlugin());

    // This creates and positions a free camera (non-mesh)
    this.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 75, new BABYLON.Vector3(0, 0, 0), scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(canvas, true);
    this.camera.radius = 56.50111286760352


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    this.amb = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    this.amb.diffuse = new BABYLON.Color3.White()
    this.amb.intensity = .3;

    this.light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
	  this.light.position = new BABYLON.Vector3(20, 40, 20);
    this.light.diffuse = new BABYLON.Color3(2, 2, 2)
	  this.light.intensity = 0.3;
    
    this.skysphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 100, segments: 32}, scene);

    this.skysphere.material = new BABYLON.StandardMaterial("mat", scene)
    this.skysphere.material.diffuseTexture = new BABYLON.Texture("https://cdn.glitch.com/03c1b291-1ddc-415e-afd8-2c410c525542%2FMaterial__25__background_JPG_002_emissive.jpg?v=1563077337997", scene)
    this.skysphere.flipFaces()
   
    scene.clearColor = new BABYLON.Color3(.0, .0, .0)//.2
    
    var shadowGenerator = new BABYLON.ShadowGenerator(24, this.light);
    shadowGenerator.useExponentialShadowMap = true;
    
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
    
    //window.onload = function(){
       var pipeline = new BABYLON.DefaultRenderingPipeline(
        "default", // The name of the pipeline
        false, // Do you want HDR textures ?
        scene, // The scene instance
        [camera] // The list of cameras to be attached to
        );
        
        pipeline.grainEnabled = true;
        pipeline.grain.intensity = 10;
        
        pipeline.grain.animated = .0;

      
        FLEK.dynTexture = advancedTexture
        FLEK.initialize(scene)
        FLEK.setClouds(scene)
        FLEK.setRocks(scene)
        //FLEK.setPebbles(scene)
        FLEK.setMizoSnake(10, scene)
        FLEK.setTrees()
        FLEK.setObstacles(scene)
        FLEK.setDungs();
        FLEK.guiOptionbt(advancedTexture)
        FLEK.timeLimit(advancedTexture)
        FLEK.dungsCollected(advancedTexture)
        FLEK.playSound()
        var playerObject = FLEK.setPlayer(scene)
        camera.parent = playerObject.colld
        this.light.parent = playerObject.colld

        FLEK.scoreLabel(advancedTexture, playerObject.colld, "player")
        //FLEK.loadPlayerAnimated(playerObject.pM, shadowGenerator)
      
        var enemyObject = FLEK.setEnemy(scene)
        
        FLEK.scoreLabel(advancedTexture, enemyObject.pM, "mizo")
      
        engine.runRenderLoop(() => {
          FLEK.updatePlayer(camera)
          camera.radius = 56.50111286760352
          playerObject.pT.rotation.y = camera.alpha
        })
     window.addEventListener("keydown", function handleKeyUp(evt) { 
        
      if (evt.keyCode == 87) {
               FLEK.speed = -.01
      }
          if (evt.keyCode == 68) {
        playerObject.pT.rotation.y += 0.1;

      }
          if (evt.keyCode == 65) {
        playerObject.pT.rotation.y -= 0.1;

      }

      });
      window.addEventListener("keyup", function handleKeyUp(evt) { 
             if (evt.keyCode == 87) {
              FLEK.speed = 0
             }
      })
 
    return scene
    
  }
  
  var FLEK = {
    worldRadius: 30,
    speed: -.01                                                             ,
    dotProduct: null,
    enemy_eat_threshold: 0,
    player_eat_threshold: 0,
    time: 60,
    timeDelta: 0,
    dynTexture: null,
    pause: false,
    initialize: function(scene){
    this.planet = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: this.worldRadius*2, segments: 12}, scene);
    this.planet.material = new BABYLON.CellMaterial("mat0", scene)
    this.planet.material.diffuseColor = new BABYLON.Color3.Green()
    this.planet.receiveShadows = true;
    this.makeLowpoly(this.planet, 7)
    },
    setClouds: function(scene){
    var cloudMat = new BABYLON.CellMaterial("mat0", scene)
    cloudMat.diffuseColor = new BABYLON.Color3(2, 2, 2)
    var clouds = new Array(10)
    for (var i = 0; i < clouds.length; i++){
      clouds[i]= new BABYLON.MeshBuilder.CreateSphere("m", {diameter: 10., segments: 2}, scene)
      let rx=Math.random() * Math.PI * 2;
      let ry=Math.random() * Math.PI;
      this.makeLowpoly(clouds[i], 10)
      clouds[i].material = cloudMat
      clouds[i].position.setFromSphericalCoords(this.worldRadius+11, ry, rx, 0);
      clouds[i].lookAt(this.planet.position);
      }
       var cloud = new BABYLON.Mesh.MergeMeshes(clouds)
    },
    setRocks: function(scene){
    var rockMat = new BABYLON.CellMaterial("mat0", scene)
    rockMat.diffuseColor = new BABYLON.Color3(0.52, 0.29, 0.29)
    var rocks = new Array(10)
    for (var i = 0; i < rocks.length; i++){
    rocks[i]= new BABYLON.MeshBuilder.CreateSphere("m", {diameter: 10., segments: 2}, scene)
          let rx=Math.random() * Math.PI * 2;
          let ry=Math.random() * Math.PI;
          let sx = this.randomNumber(.5, 1)//1, 2.5
          this.makeLowpoly(rocks[i], 10)
          rocks[i].material = rockMat
          rocks[i].position.setFromSphericalCoords(this.worldRadius+.8, ry, rx, 0);
          rocks[i].lookAt(this.planet.position);
          rocks[i].scaling.set(sx, sx, this.randomNumber(1, 2))
          rocks[i].physicsImpostor = new BABYLON.PhysicsImpostor(rocks[i], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 10000, damping: 1000000 }, scene);

    }
     //  var rock = new BABYLON.Mesh.MergeMeshes(rocks)
      this.rocks = rocks
    },
    setPebbles: function(scene){
    
    var rocks = new Array(50)
    for (var i = 0; i < rocks.length; i++){
        var rockMat = new BABYLON.CellMaterial("mat0", scene)
    rockMat.diffuseColor = new BABYLON.Color3(Math.random()*3, Math.random()*3, Math.random()*3)
      
      rocks[i]= new BABYLON.MeshBuilder.CreateSphere("m", {diameter: 10., segments: 2}, scene)
          let rx=Math.random() * Math.PI * 2;
          let ry=Math.random() * Math.PI;
          let sx = this.randomNumber(.2, .5)
          this.makeLowpoly(rocks[i], 10)
          rocks[i].material = rockMat
          rocks[i].position.setFromSphericalCoords(this.worldRadius+.3, ry, rx, 0);
          rocks[i].lookAt(this.planet.position);
          rocks[i].scaling.set(sx, sx, sx)
     
    }
      var pebbles = new BABYLON.Mesh.MergeMeshes(rocks,true, true, undefined, false, true)
    },
    makeTree: function(sizeBranch, sizeTrunk, radius){
    var leafmaterial = new BABYLON.CellMaterial("mat0", scene)
    leafmaterial.diffuseColor = new BABYLON.Color3.Green()
      
    var trunkmaterial = new BABYLON.CellMaterial("mat1", scene)
    trunkmaterial.diffuseColor = new BABYLON.Color3(0.52+.3, 0.29+.3, 0.29+.3)
      
    var leaves = new BABYLON.MeshBuilder.CreateSphere("m", {diameter: 10., segments: 2}, scene)
    leaves.material = leafmaterial
    var trunk = BABYLON.Mesh.CreateCylinder("trunk", sizeTrunk, radius-2<1?1:radius-2, radius, 10, 2, scene );
    trunk.position.y = (sizeBranch/2+2)-sizeTrunk/2;
    trunk.scaling.y = -trunk.scaling.y
    trunk.material = trunkmaterial
    this.makeLowpoly(leaves, sizeTrunk)
    this.makeLowpoly(trunk, sizeTrunk)
    var tree = new BABYLON.Mesh.MergeMeshes([leaves, trunk], true, true, undefined, false, true)
    
    return tree
    },
    setTrees: function(){
    var trees = new Array(30)
    var tree_instance = this.makeTree(10, 5, 4)
    for (var i = 0; i < trees.length; i++){
    trees[i] = tree_instance.clone()
      
    var psdTree = new BABYLON.Mesh("m", scene)
        let rx=Math.random() * Math.PI * 2;
        let ry=Math.random() * Math.PI;
        trees[i].rotation.x = Math.PI/2
        trees[i].parent = psdTree
        psdTree.position.setFromSphericalCoords(this.worldRadius+6, ry, rx, 0);
        psdTree.lookAt(this.planet.position);
    }
      
      var mergedTree = new BABYLON.Mesh.MergeMeshes(trees, true, true, undefined, false, true)
    },
    
    setDungs: function(){
    var dungs = new Array(30)
    var dungMat = new BABYLON.CellMaterial("mat0", scene)
    //var tree_instance = this.makeTree(10, 5, 4)
    for (var i = 0; i < dungs.length; i++){
    dungs[i] = BABYLON.MeshBuilder.CreateSphere("sc", {diameter: 5, segments: 5}, scene)
    this.makeLowpoly(dungs[i], 3)
    dungs[i].material = dungMat
    let rx=Math.random() * Math.PI * 2;
    let ry=Math.random() * Math.PI;
    dungs[i].position.setFromSphericalCoords(this.worldRadius+.3, ry, rx, 0);
    dungs[i].lookAt(this.planet.position);
    dungs[i].rotationQuaternion = new BABYLON.Vector4(0, 0, 0, 1)
    }
      
      this.dungs = dungs
    },
    loadPlayerAnimated: function(playerMesh, shadowGenerator){
     BABYLON.SceneLoader.ImportMesh("", "https://cdn.glitch.com/", "3b0cf707-4643-40ad-886b-220b8a3f7c44%2Fzombie.gltf?v=1572402949695", scene, (newMeshes, particleSystems, skeletons, animationGroups) => {
  
        newMeshes[0].parent = playerMesh
        newMeshes[0].rotate(BABYLON.Axis.Z, -1.45, BABYLON.Space.LOCAL);
        newMeshes[0].rotate(BABYLON.Axis.Y, 1.45, BABYLON.Space.LOCAL);
        
        var n = .06
        
        playerMesh.visibility = 0
        newMeshes[0].scaling.set(n, n, n)
        shadowGenerator.addShadowCaster(newMeshes[0]);
        
        if(animationGroups[0] != undefined){
        animationGroups[0].stop();
        animationGroups[0].start(true, 1, .05, .8);
        }

         for(var i = 0; i<newMeshes.length; i++){
         if(newMeshes[i].material){
                //newMeshes[i].material = new BABYLON.CellMaterial("birdmat", scene)
                newMeshes[i].material.albedoColor = new BABYLON.Color3(newMeshes[i].material.albedoColor.r, newMeshes[i].material.albedoColor.g, newMeshes[i].material.albedoColor.b).scale(6)
            }
         }

       

    })

    },
  
    setPlayer: function(scene){
    var playerTransform = new BABYLON.Mesh('playerTransform', scene);
	  var playerMesh = new BABYLON.Mesh("playerM", scene)
	  var playerMaterial = new BABYLON.StandardMaterial('playerMat', scene);
    playerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
	  playerMesh.material = playerMaterial;
	
    
      
    playerMesh.parent = playerTransform;
    playerMesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 1), -Math.PI/2);

    var planetCenter = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 12, segments: 12}, scene);

    var playerPivot = BABYLON.MeshBuilder.CreateBox("Box", {size:5}, scene);


    playerTransform.parent = playerPivot;
    playerTransform.position.y += this.worldRadius + 1;
      
    var playerCollider = BABYLON.MeshBuilder.CreateSphere("sc", {diameter: 7, segments: 5}, scene)
    playerCollider.position.set(0, this.worldRadius + 3, 0)
    playerCollider.parent = playerPivot
    var playerMaterial = new BABYLON.StandardMaterial('playerMat', scene);
    playerMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
    playerCollider.material = playerMaterial;
    this.makeLowpoly(playerCollider, 3)
    var playerMesh_head = playerCollider.clone()
    playerMesh_head.scaling.set(.5, .5, .5)
    playerMesh_head.position.set(0, -4, 0)
    playerMesh_head.parent = playerMesh
      
    FLEK.rocks.forEach(function(m){
        if(m.intersectsMesh(playerMesh_head)){
          m.dispose()
          m.setEnabled(false)
          
        }
       
      })
      
    //playerCollider.visibility = 0
    playerCollider.physicsImpostor = new BABYLON.PhysicsImpostor(playerCollider, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, friction: 10000, damping: 1000000 }, scene);
    playerPivot.physicsImpostor = new BABYLON.PhysicsImpostor(playerPivot, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, friction: 10000, damping: 1000000 }, scene);
    planetCenter.physicsImpostor = new BABYLON.PhysicsImpostor(planetCenter, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0}, scene);

    //join player to world
    var joint1 = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.BallAndSocketJoint, {
    mainPivot: new BABYLON.Vector3(0, 0, 0),
    connectedPivot: new BABYLON.Vector3(0, 0, 0),
    }); 

    planetCenter.physicsImpostor.addJoint(playerPivot.physicsImpostor, joint1); 

    this.playerPivot = playerPivot
    this.playerTransform = playerTransform
    this.playerCollider = playerCollider
    return {pP: this.playerPivot, pT: this.playerTransform, colld: playerCollider, pM: playerMesh}
    },
    setEnemy: function(scene){
      var startRotation = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI / 2).multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, -Math.PI/2));
      var enemyPivot = new BABYLON.Mesh('missilePivot', scene);
      var enemyTransform = new BABYLON.Mesh('missileTransform', scene);
      var enemyMesh = BABYLON.MeshBuilder.CreateSphere("sc", {diameter: 7, segments: 5}, scene)
      var enemyMaterial = new BABYLON.StandardMaterial('enemyMat', scene);
      enemyMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
      enemyMesh.material = enemyMaterial;
      enemyMesh.parent = enemyTransform;
      enemyMesh.rotationQuaternion = startRotation
      enemyTransform.parent = enemyPivot;
      enemyTransform.position.y += this.worldRadius + 1;
      enemyPivot.rotate(enemyTransform.calcMovePOV(1, 0, 0), Math.random()*Math.PI/2);
      this.makeLowpoly(enemyMesh, 3)
      var enemyMesh_head = enemyMesh.clone()
      enemyMesh_head.scaling.set(.5, .5, .5)
      enemyMesh_head.position.set(0, 4, 0)
      enemyMesh_head.parent = enemyMesh
      
      this.enemyPivot = enemyPivot
      this.enemyTransform = enemyTransform
      this.enemyMesh = enemyMesh
      return {pP: this.enemyPivot, pT: this.enemyTransform, pM: enemyMesh}
    },
    setMizoSnake: function(length, scene){
    this.mizosnake_head = BABYLON.MeshBuilder.CreateBox("sc", {size: 2}, scene)
    this.mizosnake_head.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0))
    this.mizosnake_head.rotationQuaternion = new BABYLON.Vector4(0, 0, 0, 1)
    this.mizosnake_head.visibility = 0
    this.mizosnake_body = []
    
    this.playersnake_head = BABYLON.MeshBuilder.CreateBox("sc", {size: 2}, scene)
    this.playersnake_head.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0))
    this.playersnake_head.rotationQuaternion = new BABYLON.Vector4(0, 0, 0, 1)
    this.playersnake_head.visibility = 0
    this.playersnake_body = []
      
    var bodyMat = new BABYLON.CellMaterial("mat0", scene)
    //bodyMat.diffuseColor = new BABYLON.Color3(0.52, 0.29, 0.29)
    for(var i = 0; i<length; i++){
    this.mizosnake_bodypart = BABYLON.MeshBuilder.CreateSphere("sc", {diameter: 5, segments: 5}, scene)
    this.mizosnake_bodypart.position.x = 50*(i/4)
    this.makeLowpoly(this.mizosnake_bodypart, 3)
    this.mizosnake_bodypart.material = bodyMat
    this.mizosnake_bodypart.rotationQuaternion = new BABYLON.Vector4(0, 0, 0, 1)
      if(i < Math.round(length*.5)){

    this.mizosnake_body.push(this.mizosnake_bodypart)
    }else{
      
      this.playersnake_body.push(this.mizosnake_bodypart)
      
    }
      
    }
    },
    
    setObstacles: function(scene){
      var pole = BABYLON.MeshBuilder.CreateTorus("sphere", {diameter: 30, thickness: 4}, scene);
      pole.rotation.x = -Math.PI/2
      pole.rotation.y = Math.PI/2
      this.makeLowpoly(pole, .8)
      pole.material = new BABYLON.CellMaterial("mat2", scene)
      pole.material.diffuseColor = new BABYLON.Color3.FromHexString('#F6AB40')
      this.globalLabel(pole, "Cave")
      pole.position.setFromSphericalCoords(this.worldRadius+3, Math.PI, Math.PI*2, 0);
      pole.physicsImpostor = new BABYLON.PhysicsImpostor(pole, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 10000, damping: 1000000 }, scene);
     
      this.cave = BABYLON.MeshBuilder.CreatePlane("sphere", {size: 23}, scene);
      this.cave.rotation.y = Math.PI/2
      this.cave.isVisible = false
      this.cave.position.copyFrom(pole.position)
      this.cave.storage = []
      this.caveThreshold = 0
      FLEK.rocks.forEach(function(m){
        if(m.intersectsMesh(pole)){
          m.dispose()
          m.setEnabled(false)
          
        }
       
      })
      
    },
    
    updatePlayer: function(camera){
      camera.beta = 0.4110720242219162
      if(!this.pause){
      
      this.playerPivot.rotate(BABYLON.Vector3.Cross(new BABYLON.Vector3(Math.cos(-this.playerTransform.rotation.y), 0, Math.sin(-this.playerTransform.rotation.y)), this.playerTransform.position.negate()), this.speed);
		  this.playerPivot.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0))
      this.playerPivot.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0))
      this.enemyPivot.rotate(this.enemyTransform.calcMovePOV(1, 0, 0), -this.speed);
      //update mizosnake body locomotion
      this.mizosnake_head.position = BABYLON.Vector3.Lerp(this.mizosnake_head.position, this.enemyTransform.absolutePosition, .05)
      this.mizosnake_head.rotationQuaternion = BABYLON.Quaternion.Slerp(this.mizosnake_head.rotationQuaternion, this.enemyTransform.absoluteRotationQuaternion, .05)

      this.playersnake_head.position = BABYLON.Vector3.Lerp(this.playersnake_head.position, this.playerTransform.absolutePosition, .05)
      this.playersnake_head.rotationQuaternion = BABYLON.Quaternion.Slerp(this.playersnake_head.rotationQuaternion, this.playerTransform.absoluteRotationQuaternion, .05)

      //update dungs score
      this.playerLabel.text = "Dungs: "+this.playersnake_body.length
      this.mizoLabel.text = "Dungs: "+this.mizosnake_body.length
      
      for(var i = 0; i<this.dungs.length; i++){
        var dist = BABYLON.Vector3.Distance(this.dungs[i].absolutePosition, this.playerCollider.absolutePosition)
       
        if(this.playerCollider.intersectsMesh(this.dungs[i]) && (!this.enemyMesh.intersectsMesh(this.dungs[i]))){
          
          this.playersnake_body.push(this.dungs[i])
          this.dungs.splice(i, 1)
        }
        
        }
      
      //this.caveThreshold
      for(var i = 0; i<this.playersnake_body.length; i++){
        if(this.cave.intersectsMesh(this.playersnake_body[i])){
          
       
          this.caveThreshold += 1
          if(this.caveThreshold % 1 == 0){
            this.pointSound.play()
            
                    this.cave.storage.push(this.playersnake_body[i])
                    this.playersnake_body.splice(i, 1)
                    }
                  }else{
                    this.caveThreshold  = 0
                  }
        
        
      }
      
      for(var i = 0; i<this.cave.storage.length; i++){
        if(this.cave.storage != undefined)this.cave.storage[i].dispose()
      }
      var j = 0;
      
      
        for(var i = 0; i<this.mizosnake_body.length; i++){
               var origin = this.mizosnake_body[0]
    
                    origin.position = BABYLON.Vector3.Lerp(origin.position, this.mizosnake_head.position, .05)
                    origin.rotationQuaternion = BABYLON.Quaternion.Slerp(origin.rotationQuaternion, this.mizosnake_head.rotationQuaternion, .05)
                  
               
                  if(this.playerCollider.intersectsMesh(this.mizosnake_body[i])){
                    this.player_eat_threshold += 1
                    
                    if(this.player_eat_threshold % 4 == 0){
                    this.playersnake_body.push(this.mizosnake_body[i])
                    this.mizosnake_body.splice(i, 1)
                    }
                  }else{
                    this.player_eat_threshold = 0
                  }
                  while(j < this.mizosnake_body.length){
                      if(j != 0){
                      
                      var body = this.mizosnake_body[j]
                      var alter = this.mizosnake_body[j-1]
                      if(body != undefined && alter != undefined){
                      body.position = BABYLON.Vector3.Lerp(body.position, alter.position, .05)
                      body.rotationQuaternion = BABYLON.Quaternion.Slerp(body.rotationQuaternion, alter.rotationQuaternion, .05)
                      
                         }
                      }
                      j++
                  }
          
        }

       var k = 0;
        for(var i = 0; i<this.playersnake_body.length; i++){
               var origin = this.playersnake_body[0]
    
                    origin.position = BABYLON.Vector3.Lerp(origin.position, this.playersnake_head.position, .05)
                    origin.rotationQuaternion = BABYLON.Quaternion.Slerp(origin.rotationQuaternion, this.playersnake_head.rotationQuaternion, .05)
                   
                  
                  if(this.enemyMesh.intersectsMesh(this.playersnake_body[i])){
                    this.enemy_eat_threshold += 1
                    
                    if(this.enemy_eat_threshold % 4 == 0){
                    this.mizosnake_body.push(this.playersnake_body[i])
                    this.playersnake_body.splice(i, 1)
                    }
                  }else{
                    this.enemy_eat_threshold  = 0
                  }
          
                  while(k < this.playersnake_body.length){
                      if(k != 0){
                      
                      var body = this.playersnake_body[k]
                      var alter = this.playersnake_body[k-1]
                      if(body != undefined && alter != undefined){
                      body.position = BABYLON.Vector3.Lerp(body.position, alter.position, .05)
                      body.rotationQuaternion = BABYLON.Quaternion.Slerp(body.rotationQuaternion, alter.rotationQuaternion, .05)
                      
                         }
                      }
                      k++
                  }
          
        }
      //start time
      this.timeDelta ++
      
      if((this.timeDelta % 60) == 0){
      this.time -= 1
      
      this.timeCounter.text = "TIME LIMIT: "+this.time+" sec"
      if(this.time == 0)FLEK.pause = true, this.optionPanel.isVisible = true;
      }
      if(this.cave.storage.length == this.dungGoal)FLEK.pause = true, this.optionPanel.isVisible = true, this.timeCounter.text = "Good job!!!", this.opt3.background = "purple", this.opt3.children[1].color = "purple";
      else if(this.time == 0 && this.cave.storage.length != this.dungGoal) this.timeCounter.text = "Time up!!! :(", this.opt3.background = "purple", this.opt3.children[1].color = "purple";
        
      this.dungsCounter.text = "Dungs gathered: "+this.cave.storage.length+" / "+this.dungGoal;
      var dist = BABYLON.Vector3.Distance(this.enemyTransform.absolutePosition, this.playerTransform.absolutePosition)
     
      //make sure the enemy moves facing the direction of the player when the angle between them....
      this.dotProduct = BABYLON.Vector3.Dot(this.enemyTransform.calcMovePOV(1, 0, 0), this.enemyTransform.getAbsolutePosition().subtract(this.playerTransform.getAbsolutePosition()));
      if(dist > 5){
      if (this.dotProduct > 0) {
        this.enemyTransform.rotation.y -= 0.05;
      } else {
        this.enemyTransform.rotation.y += 0.05;
      }
      }
      }
    },
    randomNumber: function(min, max){
   
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    
    },
    guiOptionbt: function(dynTexture){
            
            
            var button = BABYLON.GUI.Button.CreateImageOnlyButton("but", "https://cdn.glitch.com/9fc921e3-db5b-4af6-9426-ecd872050c1f%2Fwhite-paint-brush-stroke-2.png?v=1568860181233");
            button.width = 0.2;
            button.height = "40px";
            button.color = "white";
            button.thickness = 0
            button.background = null;
            button.zIndex = 10
            button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
            button.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            dynTexture.addControl(button);   
            
            
            var text1 = new BABYLON.GUI.TextBlock();
            text1.text = "Menu";
            text1.color = "gray";
            text1.fontFamily = "Chalkduster";
            text1.fontSize = 24;
            button.addControl(text1)  
      
             
            var panel = new BABYLON.GUI.StackPanel();    
            dynTexture.addControl(panel);   
            
            panel.zIndex = 10
      
           if(cacheTime <= 0){
            panel.isVisible = true
            FLEK.pause = true
           }else{
             panel.isVisible = false
            FLEK.pause = false
           }
      
            var optionsButton = new Array(4)
            var texts = ["resume", "audio on", "easy", "continue"]
            for(var i = 0; i<optionsButton.length; i++){
              optionsButton[i] = BABYLON.GUI.Button.CreateImageOnlyButton("but", "https://cdn.glitch.com/9fc921e3-db5b-4af6-9426-ecd872050c1f%2Fwhite-paint-brush-stroke-2.png?v=1568860181233");
              optionsButton[i].width = 0.2;
              optionsButton[i].height = "40px";
              optionsButton[i].thickness = 0
              optionsButton[i].background = null;
              
              panel.addControl(optionsButton[i])
            }
            for(var i = 0; i<optionsButton.length; i++){
            var text1 = new BABYLON.GUI.TextBlock();
            text1.text = texts[i]
            text1.color = "gray";
            text1.fontFamily = "Chalkduster";
            text1.fontSize = 24;
            optionsButton[i].addControl(text1) 
            
            }
          
          optionsButton[0].onPointerUpObservable.add(function() {
            panel.isVisible = false
            
            if(FLEK.time > 0)FLEK.pause = false
          })
      
          optionsButton[1].onPointerUpObservable.add(function() {
            
            if(optionsButton[1].children[1].text === "audio on"){
            optionsButton[1].children[1].text = "audio off"
            FLEK.ambient.stop()
          }else{
            optionsButton[1].children[1].text = "audio on"
            FLEK.ambient.play()
          } 
            
          })
          
          optionsButton[2].onPointerUpObservable.add(function() {
            
            if(optionsButton[2].children[1].text === "easy"){
            optionsButton[2].children[1].text = "hard"
          }else{
            optionsButton[2].children[1].text = "easy"
          } 
            
          })

          button.onPointerUpObservable.add(function() {
           FLEK.pause = true
           panel.isVisible = true  
            
          });
      
     optionsButton[3].onPointerUpObservable.add(function() {
      cacheTime += 1
      FLEK.pause = false
      FLEK.time = 60
      engine.dispose()
       
      if(FLEK.cave.storage.length == FLEK.dungGoal)level += 2;
       
      engine = new BABYLON.Engine(canvas, false, { preserveDrawingBuffer: true, stencil: true });
      scene = createWorld()
      engine.runRenderLoop(function () {
      if (scene) {
        scene.render();
        var fpsLabel = document.getElementById("fpsLabel");
        fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";
            }
      });
       
       })
      
          this.optionPanel = panel
          this.opt3 = optionsButton[3]
    },
    playSound: function(){
       this.ambient = new BABYLON.Sound("Violons", "https://cdn.glitch.com/d5fc0468-6095-472d-b1b8-cb9cdf6fe6cf%2Fambient.wav", scene, null, { loop: true, autoplay: true });
       this.pointSound = new BABYLON.Sound("gunshot", "https://cdn.glitch.com/d5fc0468-6095-472d-b1b8-cb9cdf6fe6cf%2Fpoints.wav", scene);
	       
      
    },
    timeLimit: function(dynTexture){
      
            var rect1 = new BABYLON.GUI.Rectangle();
            rect1.width = .2
            rect1.height = .1
            rect1.thickness = 0;
            rect1.background = null;
            rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
            rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
            dynTexture.addControl(rect1)
            
      
            var text1 = new BABYLON.GUI.TextBlock();
            text1.text = "TIME LIMIT: 60 sec";
            text1.color = "gray";
            text1.fontFamily = "Chalkduster";
            text1.fontSize = 24;
            rect1.addControl(text1)
            this.timeCounter = text1
    },
    dungsCollected: function(dynTexture){
      var rect1 = new BABYLON.GUI.Rectangle();
      rect1.width = .5
      rect1.height = .1
      rect1.thickness = 0;
      rect1.background = null;
      rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
      rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      dynTexture.addControl(rect1)
            
      
      var text1 = new BABYLON.GUI.TextBlock();
      text1.text = "Dungs gathered: "+this.cave.storage.length+" / "+FLEK.dungs.length;
      text1.color = "red";
      text1.fontFamily = "Chalkduster";
      text1.fontSize = 24;
      rect1.addControl(text1)
      this.dungGoal = this.dungs.length - 5 + level;
      this.dungsCounter = text1
    },
    globalLabel: function(object, text){
    var label = new BABYLON.GUI.TextBlock();
    label.color = "yellow"
    label.text = text
    this.dynTexture.addControl(label);
    label.linkWithMesh(object); 
      
    },
    scoreLabel: function(dynTexture, player, type){
    
    var label = new BABYLON.GUI.TextBlock();
    label.color = "yellow"
    if(type === "player")label.text = "Dungs: "+this.playersnake_body.length, this.playerLabel = label;
    if(type === "mizo")label.text = "Dungs: "+this.playersnake_body.length, this.mizoLabel = label;
      
    dynTexture.addControl(label);
    label.linkWithMesh(player);   
    },
    makeLowpoly: function(mesh, amount){
      var positions = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
            var indices = mesh.getIndices();
            var numberOfPoints = positions.length/3;
        
            var map = [];
        
            var v3 = BABYLON.Vector3;
            var max = [];
        
            for (var i=0; i<numberOfPoints; i++) {
                var p = new v3(positions[i*3], positions[i*3+1], positions[i*3+2]);
        
                if (p.y >= amount/2) {
                    max.push(p);
                }
        
                var found = false;
                for (var index=0; index<map.length&&!found; index++) {
                    var array = map[index];
                    var p0 = array[0];
                    if (p0.equals (p) || (p0.subtract(p)).lengthSquared() < 0.01){
                        array.push(i*3);
                        found = true;
                    }
                }
                if (!found) {
                    var array = [];
                    array.push(p, i*3);
                    map.push(array);
                }
        
            }
            var randomNumber = function (min, max) {
                if (min == max) {
                    return (min);
                }
                var random = Math.random();
                return ((random * (max - min)) + min);
            };
        
            map.forEach(function(array) {
                var index, min = -amount/10, max = amount/10;
                var rx = randomNumber(min,max);
                var ry = randomNumber(min,max);
                var rz = randomNumber(min,max);
        
                for (index = 1; index<array.length; index++) {
                    var i = array[index];
                    positions[i] += rx;
                    positions[i+1] += ry;
                    positions[i+2] += rz;
                }
            });
        
            mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
            var normals = [];
            BABYLON.VertexData.ComputeNormals(positions, indices, normals);
            mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
            mesh.convertToFlatShadedMesh();
    }
  }
  
   BABYLON.Vector3.prototype.setFromSphericalCoords = function( radius, phi, theta, radialDist ) {
       var dist = radialDist||0
		var sinPhiRadius = (Math.sin( phi ) * radius);

		this.x = (sinPhiRadius * Math.sin( theta ))+dist;
		this.y = (Math.cos( phi ) * radius)+dist;
		this.z = (sinPhiRadius * Math.cos( theta ))+dist;

		return this;

	}
      
  var engine = new BABYLON.Engine(canvas, false, { preserveDrawingBuffer: true, stencil: true });
  var scene = createWorld();
  engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
        var fpsLabel = document.getElementById("fpsLabel");
        fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";
            }
  });

        // Resize
        window.addEventListener("resize", function () {
            engine.resize();
        });
      
  </script>
  </body>
</html>