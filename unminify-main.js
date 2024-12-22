(async () =>{
    await Ammo();
var canvas = document.getElementById("renderCanvas"),
    level = 0,
    cacheTime = 0;
(console.warn = console.error = () => {}), console.log("%cPLAY FLEK %cGAME", "background: red; color: yellow; font-size: x-large", "background: blue; color: yellow; font-size: x-large");
var createWorld = function () {
        this.scene = new BABYLON.Scene(engine);
        var e = this.scene;
        e.enablePhysics(new BABYLON.Vector3(0, 0, 0), new BABYLON.AmmoJSPlugin()),
            (this.camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 75, new BABYLON.Vector3(0, 0, 0), e)),
            this.camera.setTarget(BABYLON.Vector3.Zero()),
            this.camera.attachControl(canvas, !0),
            (this.camera.radius = 56.50111286760352),
            (this.amb = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), e)),
            (this.amb.diffuse = new BABYLON.Color3.White()),
            (this.amb.intensity = 0.3),
            (this.light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), e)),
            (this.light.position = new BABYLON.Vector3(20, 40, 20)),
            (this.light.diffuse = new BABYLON.Color3(2, 2, 2)),
            (this.light.intensity = 0.3),
            (this.skysphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 100, segments: 32 }, e)),
            (this.skysphere.material = new BABYLON.StandardMaterial("mat", e)),
            (this.skysphere.material.diffuseTexture = new BABYLON.Texture("assets/images/sky2.jpg", e)),
            this.skysphere.flipFaces(),
            (e.clearColor = new BABYLON.Color3(0, 0, 0)),
            (new BABYLON.ShadowGenerator(24, this.light).useExponentialShadowMap = !0);
        var t = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI"),
            o = new BABYLON.DefaultRenderingPipeline("default", !1, e, [camera]);
            o.chromaticAberrationEnabled = !0;
            o.chromaticAberration.aberrationAmount = 10;
        (o.grainEnabled = !0),
            (o.grain.intensity = 10),
            (o.grain.animated = 0),
            (FLEK.dynTexture = t),
            FLEK.initialize(e),
            FLEK.setClouds(e),
            FLEK.setRocks(e),
            FLEK.setMizoSnake(10, e),
            FLEK.setTrees(),
            FLEK.setObstacles(e),
            FLEK.setDungs(),
            FLEK.guiOptionbt(t),
            FLEK.timeLimit(t),
            FLEK.dungsCollected(t),
            FLEK.playSound();
        var i = FLEK.setPlayer(e);
        (camera.parent = i.colld), (this.light.parent = i.colld), FLEK.scoreLabel(t, i.colld, "player");
        var s = FLEK.setEnemy(e);
        return (
            FLEK.scoreLabel(t, s.pM, "mizo"),
            engine.runRenderLoop(() => {
                FLEK.updatePlayer(camera), (camera.radius = 56.50111286760352), (i.pT.rotation.y = camera.alpha);
            }),
            window.addEventListener("keydown", function (e) {
                87 == e.keyCode && (FLEK.speed = -0.01), 68 == e.keyCode && (i.pT.rotation.y += 0.1), 65 == e.keyCode && (i.pT.rotation.y -= 0.1);
            }),
            window.addEventListener("keyup", function (e) {
                87 == e.keyCode && (FLEK.speed = 0);
            }),
            e
        );
    },
    FLEK = {
        worldRadius: 30,
        speed: -0.01,
        dotProduct: null,
        enemy_eat_threshold: 0,
        player_eat_threshold: 0,
        time: 60,
        timeDelta: 0,
        dynTexture: null,
        pause: !1,
        initialize: function (e) {
            (this.planet = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 * this.worldRadius, segments: 12 }, e)),
                (this.planet.material = new BABYLON.CellMaterial("mat0", e)),
                (this.planet.material.diffuseColor = new BABYLON.Color3.Green()),
                (this.planet.receiveShadows = !0),
                this.makeLowpoly(this.planet, 7);
        },
        setClouds: function (e) {
            var t = new BABYLON.CellMaterial("mat0", e);
            t.diffuseColor = new BABYLON.Color3(2, 2, 2);
            for (var o = new Array(10), i = 0; i < o.length; i++) {
                o[i] = new BABYLON.MeshBuilder.CreateSphere("m", { diameter: 10, segments: 2 }, e);
                let s = Math.random() * Math.PI * 2,
                    a = Math.random() * Math.PI;
                this.makeLowpoly(o[i], 10), (o[i].material = t), o[i].position.setFromSphericalCoords(this.worldRadius + 11, a, s, 0), o[i].lookAt(this.planet.position);
            }
            new BABYLON.Mesh.MergeMeshes(o);
        },
        setRocks: function (e) {
            var t = new BABYLON.CellMaterial("mat0", e);
            t.diffuseColor = new BABYLON.Color3(0.52, 0.29, 0.29);
            for (var o = new Array(10), i = 0; i < o.length; i++) {
                o[i] = new BABYLON.MeshBuilder.CreateSphere("m", { diameter: 10, segments: 2 }, e);
                let s = Math.random() * Math.PI * 2,
                    a = Math.random() * Math.PI,
                    n = this.randomNumber(0.5, 1);
                this.makeLowpoly(o[i], 10),
                    (o[i].material = t),
                    o[i].position.setFromSphericalCoords(this.worldRadius + 0.8, a, s, 0),
                    o[i].lookAt(this.planet.position),
                    o[i].scaling.set(n, n, this.randomNumber(1, 2)),
                    (o[i].physicsImpostor = new BABYLON.PhysicsImpostor(o[i], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1e4, damping: 1e6 }, e));
            }
            this.rocks = o;
        },
        setPebbles: function (e) {
            for (var t = new Array(50), o = 0; o < t.length; o++) {
                var i = new BABYLON.CellMaterial("mat0", e);
                (i.diffuseColor = new BABYLON.Color3(3 * Math.random(), 3 * Math.random(), 3 * Math.random())), (t[o] = new BABYLON.MeshBuilder.CreateSphere("m", { diameter: 10, segments: 2 }, e));
                let s = Math.random() * Math.PI * 2,
                    a = Math.random() * Math.PI,
                    n = this.randomNumber(0.2, 0.5);
                this.makeLowpoly(t[o], 10), (t[o].material = i), t[o].position.setFromSphericalCoords(this.worldRadius + 0.3, a, s, 0), t[o].lookAt(this.planet.position), t[o].scaling.set(n, n, n);
            }
            new BABYLON.Mesh.MergeMeshes(t, !0, !0, void 0, !1, !0);
        },
        makeTree: function (e, t, o) {
            var i = new BABYLON.CellMaterial("mat0", scene);
            i.diffuseColor = new BABYLON.Color3.Green();
            var s = new BABYLON.CellMaterial("mat1", scene);
            s.diffuseColor = new BABYLON.Color3(0.52 + 0.3, 0.59, 0.59);
            var a = new BABYLON.MeshBuilder.CreateSphere("m", { diameter: 10, segments: 2 }, scene);
            a.material = i;
            var n = BABYLON.Mesh.CreateCylinder("trunk", t, o - 2 < 1 ? 1 : o - 2, o, 10, 2, scene);
            return (n.position.y = e / 2 + 2 - t / 2), (n.scaling.y = -n.scaling.y), (n.material = s), this.makeLowpoly(a, t), this.makeLowpoly(n, t), new BABYLON.Mesh.MergeMeshes([a, n], !0, !0, void 0, !1, !0);
        },
        setTrees: function () {
            for (var e = new Array(30), t = this.makeTree(10, 5, 4), o = 0; o < e.length; o++) {
                e[o] = t.clone();
                var i = new BABYLON.Mesh("m", scene);
                let s = Math.random() * Math.PI * 2,
                    a = Math.random() * Math.PI;
                (e[o].rotation.x = Math.PI / 2), (e[o].parent = i), i.position.setFromSphericalCoords(this.worldRadius + 6, a, s, 0), i.lookAt(this.planet.position);
            }
            new BABYLON.Mesh.MergeMeshes(e, !0, !0, void 0, !1, !0);
        },
        setDungs: function () {

            for (var e = new Array(30), t = new BABYLON.CellMaterial("mat0", window.scene), o = 0; o < e.length; o++) {
                (e[o] = BABYLON.MeshBuilder.CreateSphere("sc", { diameter: 5, segments: 5 }, window.scene)), this.makeLowpoly(e[o], 3), (e[o].material = t);
                let i = Math.random() * Math.PI * 2,
                    s = Math.random() * Math.PI;
                e[o].position.setFromSphericalCoords(this.worldRadius + 0.3, s, i, 0), e[o].lookAt(this.planet.position), (e[o].rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1));
            }
            this.dungs = e;
        },
        loadPlayerAnimated: function (e, t) {
            // BABYLON.SceneLoader.ImportMesh("", "https://cdn.glitch.com/", "3b0cf707-4643-40ad-886b-220b8a3f7c44%2Fzombie.gltf?v=1572402949695", scene, (o, i, s, a) => {
            //     (o[0].parent = e), o[0].rotate(BABYLON.Axis.Z, -1.45, BABYLON.Space.LOCAL), o[0].rotate(BABYLON.Axis.Y, 1.45, BABYLON.Space.LOCAL);
            //     (e.visibility = 0), o[0].scaling.set(0.06, 0.06, 0.06), t.addShadowCaster(o[0]), null != a[0] && (a[0].stop(), a[0].start(!0, 1, 0.05, 0.8));
            //     for (var n = 0; n < o.length; n++) o[n].material && (o[n].material.albedoColor = new BABYLON.Color3(o[n].material.albedoColor.r, o[n].material.albedoColor.g, o[n].material.albedoColor.b).scale(6));
            // });
        },
        setPlayer: function (e) {
            var t = new BABYLON.Mesh("playerTransform", e),
                o = new BABYLON.Mesh("playerM", e);
            ((a = new BABYLON.StandardMaterial("playerMat", e)).diffuseColor = new BABYLON.Color3(0, 0, 1)),
                (o.material = a),
                (o.parent = t),
                (o.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 1), -Math.PI / 2));
            var i = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 12, segments: 12 }, e),
                s = BABYLON.MeshBuilder.CreateBox("Box", { size: 5 }, e);
            (t.parent = s), (t.position.y += this.worldRadius + 1);
            var a,
                n = BABYLON.MeshBuilder.CreateSphere("sc", { diameter: 7, segments: 5 }, e);
            n.position.set(0, this.worldRadius + 3, 0), (n.parent = s), ((a = new BABYLON.StandardMaterial("playerMat", e)).diffuseColor = new BABYLON.Color3(0, 0, 1)), (n.material = a), this.makeLowpoly(n, 3);
            var r = n.clone();
            r.scaling.set(0.5, 0.5, 0.5),
                r.position.set(0, -4, 0),
                (r.parent = o),
                FLEK.rocks.forEach(function (e) {
                    e.intersectsMesh(r) && (e.dispose(), e.setEnabled(!1));
                }),
                (n.physicsImpostor = new BABYLON.PhysicsImpostor(n, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, friction: 1e4, damping: 1e6 }, e)),
                (s.physicsImpostor = new BABYLON.PhysicsImpostor(s, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 2, friction: 1e4, damping: 1e6 }, e)),
                (i.physicsImpostor = new BABYLON.PhysicsImpostor(i, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0 }, e));
            var l = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.BallAndSocketJoint, { mainPivot: new BABYLON.Vector3(0, 0, 0), connectedPivot: new BABYLON.Vector3(0, 0, 0) });
            return i.physicsImpostor.addJoint(s.physicsImpostor, l), (this.playerPivot = s), (this.playerTransform = t), (this.playerCollider = n), { pP: this.playerPivot, pT: this.playerTransform, colld: n, pM: o };
        },
        setEnemy: function (e) {
            var t = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, Math.PI / 2).multiply(BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, -Math.PI / 2)),
                o = new BABYLON.Mesh("missilePivot", e),
                i = new BABYLON.Mesh("missileTransform", e),
                s = BABYLON.MeshBuilder.CreateSphere("sc", { diameter: 7, segments: 5 }, e),
                a = new BABYLON.StandardMaterial("enemyMat", e);
            (a.diffuseColor = new BABYLON.Color3(1, 0, 0)),
                (s.material = a),
                (s.parent = i),
                (s.rotationQuaternion = t),
                (i.parent = o),
                (i.position.y += this.worldRadius + 1),
                o.rotate(i.calcMovePOV(1, 0, 0), (Math.random() * Math.PI) / 2),
                this.makeLowpoly(s, 3);
            var n = s.clone();
            return n.scaling.set(0.5, 0.5, 0.5), n.position.set(0, 4, 0), (n.parent = s), (this.enemyPivot = o), (this.enemyTransform = i), (this.enemyMesh = s), { pP: this.enemyPivot, pT: this.enemyTransform, pM: s };
        },
        setMizoSnake: function (e, t) {
            (this.mizosnake_head = BABYLON.MeshBuilder.CreateBox("sc", { size: 2 }, t)),
                this.mizosnake_head.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0)),
                (this.mizosnake_head.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1)),
                (this.mizosnake_head.visibility = 0),
                (this.mizosnake_body = []),
                (this.playersnake_head = BABYLON.MeshBuilder.CreateBox("sc", { size: 2 }, t)),
                this.playersnake_head.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0)),
                (this.playersnake_head.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1)),
                (this.playersnake_head.visibility = 0),
                (this.playersnake_body = []);
            for (var o = new BABYLON.CellMaterial("mat0", t), i = 0; i < e; i++)
                (this.mizosnake_bodypart = BABYLON.MeshBuilder.CreateSphere("sc", { diameter: 5, segments: 5 }, t)),
                    (this.mizosnake_bodypart.position.x = (i / 4) * 50),
                    this.makeLowpoly(this.mizosnake_bodypart, 3),
                    (this.mizosnake_bodypart.material = o),
                    (this.mizosnake_bodypart.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1)),
                    i < Math.round(0.5 * e) ? this.mizosnake_body.push(this.mizosnake_bodypart) : this.playersnake_body.push(this.mizosnake_bodypart);
        },
        setObstacles: function (e) {
            var t = BABYLON.MeshBuilder.CreateTorus("sphere", { diameter: 30, thickness: 4 }, e);
            (t.rotation.x = -Math.PI / 2),
                (t.rotation.y = Math.PI / 2),
                this.makeLowpoly(t, 0.8),
                (t.material = new BABYLON.CellMaterial("mat2", e)),
                (t.material.diffuseColor = new BABYLON.Color3.FromHexString("#F6AB40")),
                this.globalLabel(t, "Cave"),
                t.position.setFromSphericalCoords(this.worldRadius + 3, Math.PI, 2 * Math.PI, 0),
                (t.physicsImpostor = new BABYLON.PhysicsImpostor(t, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 1e4, damping: 1e6 }, e)),
                (this.cave = BABYLON.MeshBuilder.CreatePlane("sphere", { size: 23 }, e)),
                (this.cave.rotation.y = Math.PI / 2),
                (this.cave.isVisible = !1),
                this.cave.position.copyFrom(t.position),
                (this.cave.storage = []),
                (this.caveThreshold = 0),
                FLEK.rocks.forEach(function (e) {
                    e.intersectsMesh(t) && (e.dispose(), e.setEnabled(!1));
                });
        },
        updatePlayer: function (e) {
            if (((e.beta = 0.4110720242219162), !this.pause)) {
                this.playerPivot.rotate(BABYLON.Vector3.Cross(new BABYLON.Vector3(Math.cos(-this.playerTransform.rotation.y), 0, Math.sin(-this.playerTransform.rotation.y)), this.playerTransform.position.negate()), this.speed),
                    this.playerPivot.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0)),
                    this.playerPivot.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0)),
                    this.enemyPivot.rotate(this.enemyTransform.calcMovePOV(1, 0, 0), -this.speed),
                    (this.mizosnake_head.position = BABYLON.Vector3.Lerp(this.mizosnake_head.position, this.enemyTransform.absolutePosition, 0.05)),
                    (this.mizosnake_head.rotationQuaternion = BABYLON.Quaternion.Slerp(this.mizosnake_head.rotationQuaternion, this.enemyTransform.absoluteRotationQuaternion, 0.05)),
                    (this.playersnake_head.position = BABYLON.Vector3.Lerp(this.playersnake_head.position, this.playerTransform.absolutePosition, 0.05)),
                    (this.playersnake_head.rotationQuaternion = BABYLON.Quaternion.Slerp(this.playersnake_head.rotationQuaternion, this.playerTransform.absoluteRotationQuaternion, 0.05)),
                    (this.playerLabel.text = "Dungs: " + this.playersnake_body.length),
                    (this.mizoLabel.text = "Dungs: " + this.mizosnake_body.length);
                for (var t = 0; t < this.dungs.length; t++) {
                    var o = BABYLON.Vector3.Distance(this.dungs[t].absolutePosition, this.playerCollider.absolutePosition);
                    this.playerCollider.intersectsMesh(this.dungs[t]) && !this.enemyMesh.intersectsMesh(this.dungs[t]) && (this.playersnake_body.push(this.dungs[t]), this.dungs.splice(t, 1));
                }
                for (t = 0; t < this.playersnake_body.length; t++)
                    this.cave.intersectsMesh(this.playersnake_body[t])
                        ? ((this.caveThreshold += 1), this.caveThreshold % 1 == 0 && (this.pointSound.play(), this.cave.storage.push(this.playersnake_body[t]), this.playersnake_body.splice(t, 1)))
                        : (this.caveThreshold = 0);
                for (t = 0; t < this.cave.storage.length; t++) null != this.cave.storage && this.cave.storage[t].dispose();
                var i = 0;
                for (t = 0; t < this.mizosnake_body.length; t++) {
                    for (
                        (r = this.mizosnake_body[0]).position = BABYLON.Vector3.Lerp(r.position, this.mizosnake_head.position, 0.05),
                            r.rotationQuaternion = BABYLON.Quaternion.Slerp(r.rotationQuaternion, this.mizosnake_head.rotationQuaternion, 0.05),
                            this.playerCollider.intersectsMesh(this.mizosnake_body[t])
                                ? ((this.player_eat_threshold += 1), this.player_eat_threshold % 4 == 0 && (this.playersnake_body.push(this.mizosnake_body[t]), this.mizosnake_body.splice(t, 1)))
                                : (this.player_eat_threshold = 0);
                        i < this.mizosnake_body.length;

                    ) {
                        if (0 != i) {
                            var s = this.mizosnake_body[i],
                                a = this.mizosnake_body[i - 1];
                            null != s && null != a && ((s.position = BABYLON.Vector3.Lerp(s.position, a.position, 0.05)), (s.rotationQuaternion = BABYLON.Quaternion.Slerp(s.rotationQuaternion, a.rotationQuaternion, 0.05)));
                        }
                        i++;
                    }
                }
                var n = 0;
                for (t = 0; t < this.playersnake_body.length; t++) {
                    var r;
                    for (
                        (r = this.playersnake_body[0]).position = BABYLON.Vector3.Lerp(r.position, this.playersnake_head.position, 0.05),
                            r.rotationQuaternion = BABYLON.Quaternion.Slerp(r.rotationQuaternion, this.playersnake_head.rotationQuaternion, 0.05),
                            this.enemyMesh.intersectsMesh(this.playersnake_body[t])
                                ? ((this.enemy_eat_threshold += 1), this.enemy_eat_threshold % 4 == 0 && (this.mizosnake_body.push(this.playersnake_body[t]), this.playersnake_body.splice(t, 1)))
                                : (this.enemy_eat_threshold = 0);
                        n < this.playersnake_body.length;

                    ) {
                        if (0 != n) {
                            (s = this.playersnake_body[n]), (a = this.playersnake_body[n - 1]);
                            null != s && null != a && ((s.position = BABYLON.Vector3.Lerp(s.position, a.position, 0.05)), (s.rotationQuaternion = BABYLON.Quaternion.Slerp(s.rotationQuaternion, a.rotationQuaternion, 0.05)));
                        }
                        n++;
                    }
                }
                this.timeDelta++,
                    this.timeDelta % 60 == 0 && ((this.time -= 1), (this.timeCounter.text = "TIME LIMIT: " + this.time + " sec"), 0 == this.time && ((FLEK.pause = !0), (this.optionPanel.isVisible = !0))),
                    this.cave.storage.length == this.dungGoal
                        ? ((FLEK.pause = !0), (this.optionPanel.isVisible = !0), (this.timeCounter.text = "Good job!!!"), (this.opt3.background = "purple"), (this.opt3.children[1].color = "purple"))
                        : 0 == this.time && this.cave.storage.length != this.dungGoal && ((this.timeCounter.text = "Time up!!! :("), (this.opt3.background = "purple"), (this.opt3.children[1].color = "purple")),
                    (this.dungsCounter.text = "Dungs gathered: " + this.cave.storage.length + " / " + this.dungGoal);
                o = BABYLON.Vector3.Distance(this.enemyTransform.absolutePosition, this.playerTransform.absolutePosition);
                (this.dotProduct = BABYLON.Vector3.Dot(this.enemyTransform.calcMovePOV(1, 0, 0), this.enemyTransform.getAbsolutePosition().subtract(this.playerTransform.getAbsolutePosition()))),
                    o > 5 && (this.dotProduct > 0 ? (this.enemyTransform.rotation.y -= 0.05) : (this.enemyTransform.rotation.y += 0.05));
            }
        },
        randomNumber: function (e, t) {
            return e == t ? e : Math.random() * (t - e) + e;
        },
        guiOptionbt: function (e) {
            var t = BABYLON.GUI.Button.CreateImageOnlyButton("but", "https://cdn.glitch.com/9fc921e3-db5b-4af6-9426-ecd872050c1f%2Fwhite-paint-brush-stroke-2.png?v=1568860181233");
            (t.width = 0.2),
                (t.height = "40px"),
                (t.color = "white"),
                (t.thickness = 0),
                (t.background = null),
                (t.zIndex = 10),
                (t.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP),
                (t.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT),
                e.addControl(t),
                ((n = new BABYLON.GUI.TextBlock()).text = "Menu"),
                (n.color = "gray"),
                (n.fontFamily = "Chalkduster"),
                (n.fontSize = 24),
                t.addControl(n);
            var o = new BABYLON.GUI.StackPanel();
            e.addControl(o), (o.zIndex = 10), cacheTime <= 0 ? ((o.isVisible = !0), (FLEK.pause = !0)) : ((o.isVisible = !1), (FLEK.pause = !1));
            for (var i = new Array(4), s = ["resume", "audio on", "easy", "new game"], a = 0; a < i.length; a++)
                (i[a] = BABYLON.GUI.Button.CreateImageOnlyButton("but", "https://cdn.glitch.com/9fc921e3-db5b-4af6-9426-ecd872050c1f%2Fwhite-paint-brush-stroke-2.png?v=1568860181233")),
                    (i[a].width = 0.2),
                    (i[a].height = "40px"),
                    (i[a].thickness = 0),
                    (i[a].background = null),
                    o.addControl(i[a]);
            for (a = 0; a < i.length; a++) {
                var n;
                ((n = new BABYLON.GUI.TextBlock()).text = s[a]), (n.color = "gray"), (n.fontFamily = "Chalkduster"), (n.fontSize = 24), i[a].addControl(n);
            }
            i[0].onPointerUpObservable.add(function () {
                (o.isVisible = !1), FLEK.time > 0 && (FLEK.pause = !1);
            }),
                i[1].onPointerUpObservable.add(function () {
                    "audio on" === i[1].children[1].text ? ((i[1].children[1].text = "audio off"), FLEK.ambient.stop()) : ((i[1].children[1].text = "audio on"), FLEK.ambient.play());
                }),
                i[2].onPointerUpObservable.add(function () {
                    "easy" === i[2].children[1].text ? (i[2].children[1].text = "hard") : (i[2].children[1].text = "easy");
                }),
                t.onPointerUpObservable.add(function () {
                    (FLEK.pause = !0), (o.isVisible = !0);
                }),
                i[3].onPointerUpObservable.add(async function () {
                    (cacheTime += 1),
                        (FLEK.pause = !1),
                        (FLEK.time = 60),
                        engine.dispose(),
                        FLEK.cave.storage.length == FLEK.dungGoal && (level += 2),
                        (engine = new BABYLON.Engine(canvas, !1, { preserveDrawingBuffer: !0, stencil: !0 })),
                        (scene = createWorld()),
                        engine.runRenderLoop(function () {
                            scene && (scene.render(), (document.getElementById("fpsLabel").innerHTML = engine.getFps().toFixed() + " fps"));
                        });
                }),
                (this.optionPanel = o),
                (this.opt3 = i[3]);
        },
        playSound: function () {
            (this.ambient = new BABYLON.Sound("Violons", "https://cdn.glitch.com/d5fc0468-6095-472d-b1b8-cb9cdf6fe6cf%2Fambient.wav", scene, null, { loop: !0, autoplay: !0 })),
                (this.pointSound = new BABYLON.Sound("gunshot", "https://cdn.glitch.com/d5fc0468-6095-472d-b1b8-cb9cdf6fe6cf%2Fpoints.wav", scene));
        },
        timeLimit: function (e) {
            var t = new BABYLON.GUI.Rectangle();
            (t.width = 0.2),
                (t.height = 0.1),
                (t.thickness = 0),
                (t.background = null),
                (t.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP),
                (t.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER),
                e.addControl(t);
            var o = new BABYLON.GUI.TextBlock();
            (o.text = "TIME LIMIT: 60 sec"), (o.color = "gray"), (o.fontFamily = "Chalkduster"), (o.fontSize = 24), t.addControl(o), (this.timeCounter = o);
        },
        dungsCollected: function (e) {
            var t = new BABYLON.GUI.Rectangle();
            (t.width = 0.5),
                (t.height = 0.1),
                (t.thickness = 0),
                (t.background = null),
                (t.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM),
                (t.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT),
                e.addControl(t);
            var o = new BABYLON.GUI.TextBlock();
            (o.text = "Dungs gathered: " + this.cave.storage.length + " / " + FLEK.dungs.length),
                (o.color = "red"),
                (o.fontFamily = "Chalkduster"),
                (o.fontSize = 24),
                t.addControl(o),
                (this.dungGoal = this.dungs.length - 5 + level),
                (this.dungsCounter = o);
        },
        globalLabel: function (e, t) {
            var o = new BABYLON.GUI.TextBlock();
            (o.color = "yellow"), (o.text = t), this.dynTexture.addControl(o), o.linkWithMesh(e);
        },
        scoreLabel: function (e, t, o) {
            var i = new BABYLON.GUI.TextBlock();
            (i.color = "yellow"),
                "player" === o && ((i.text = "Dungs: " + this.playersnake_body.length), (this.playerLabel = i)),
                "mizo" === o && ((i.text = "Dungs: " + this.playersnake_body.length), (this.mizoLabel = i)),
                e.addControl(i),
                i.linkWithMesh(t);
        },
        makeLowpoly: function (e, t) {
            for (var o = e.getVerticesData(BABYLON.VertexBuffer.PositionKind), i = e.getIndices(), s = o.length / 3, a = [], n = BABYLON.Vector3, r = [], l = 0; l < s; l++) {
                var h = new n(o[3 * l], o[3 * l + 1], o[3 * l + 2]);
                h.y >= t / 2 && r.push(h);
                for (var d = !1, c = 0; c < a.length && !d; c++) {
                    var p,
                        B = (p = a[c])[0];
                    (B.equals(h) || B.subtract(h).lengthSquared() < 0.01) && (p.push(3 * l), (d = !0));
                }
                if (!d) (p = []).push(h, 3 * l), a.push(p);
            }
            var m = function (e, t) {
                return e == t ? e : Math.random() * (t - e) + e;
            };
            a.forEach(function (e) {
                var i,
                    s = -t / 10,
                    a = t / 10,
                    n = m(s, a),
                    r = m(s, a),
                    l = m(s, a);
                for (i = 1; i < e.length; i++) {
                    var h = e[i];
                    (o[h] += n), (o[h + 1] += r), (o[h + 2] += l);
                }
            }),
                e.setVerticesData(BABYLON.VertexBuffer.PositionKind, o);
            var u = [];
            BABYLON.VertexData.ComputeNormals(o, i, u), e.setVerticesData(BABYLON.VertexBuffer.NormalKind, u), e.convertToFlatShadedMesh();
        },
    };
BABYLON.Vector3.prototype.setFromSphericalCoords = function (e, t, o, i) {
    var s = i || 0,
        a = Math.sin(t) * e;
    return (this.x = a * Math.sin(o) + s), (this.y = Math.cos(t) * e + s), (this.z = a * Math.cos(o) + s), this;
};
var engine = new BABYLON.Engine(canvas, !1, { preserveDrawingBuffer: !0, stencil: !0 });
scene = createWorld();
engine.runRenderLoop(function () {
    scene && (scene.render(), (document.getElementById("fpsLabel").innerHTML = engine.getFps().toFixed() + " fps"));
}),
window.addEventListener("resize", function () {
    engine.resize();
});
})();