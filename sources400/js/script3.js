/**
 *
 * WebGL With Three.js - Lesson 5 - spherical skybox and bubble
 * http://www.script-tutorials.com/webgl-with-three-js-lesson-5/
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Script Tutorials
 * http://www.script-tutorials.com/
 */

var lesson5 = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    controls: null,
    clock: null,
    stats: null,
    bSphere: null,
    bSphereCamera: null,

    init: function() { // Initialization

        // create main scene
        this.scene = new THREE.Scene();

        var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight;

        // prepare camera
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.position.set(0, 0, 0);
        this.camera.lookAt(new THREE.Vector3(1, 1, 1));

        // prepare renderer
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: false});
        this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        this.renderer.setClearColor(0xffffff);

        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapSoft = true;

        // prepare container
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        this.container.appendChild(this.renderer.domElement);

        // events
        THREEx.WindowResize(this.renderer, this.camera);

        // prepare controls (OrbitControls)
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(1, 0, 0);
        this.controls.maxDistance = 700;

        // prepare clock
        this.clock = new THREE.Clock();

        // prepare stats
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '50px';
        this.stats.domElement.style.bottom = '50px';
        this.stats.domElement.style.zIndex = 1;
        this.container.appendChild( this.stats.domElement );

        // add point light
        var spLight = new THREE.PointLight(0xffffff, 1.75, 1000);
        spLight.position.set(-100, 200, 200);
        this.scene.add(spLight);

        // add simple cube
        var cube = new THREE.Mesh( new THREE.CubeGeometry(40, 10, 40), new THREE.MeshLambertMaterial({color:0xff0000 * Math.random()}) );
        cube.position.set(75, 0, 0);
      //  this.scene.add(cube);

        // add spherical skybox
        this.drawSphericalSkybox();

        // add bubble object
        this.drawBubbleObject();
    },
    drawSphericalSkybox: function() {
        // prepare ShaderMaterial
        var uniforms = {
            texture: { type: 't', value: THREE.ImageUtils.loadTexture('milkyway_edit.jpg') }
        };
        var skyMaterial = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById('sky-vertex').textContent, fragmentShader: document.getElementById('sky-fragment').textContent
        });

        // create Mesh with sphere geometry and add to the scene
        var skyBox = new THREE.Mesh(new THREE.SphereGeometry(400, 400, 400), skyMaterial);
        skyBox.scale.set(-1, 1, 1);
        skyBox.eulerOrder = 'XZY';
        skyBox.renderDepth = 500.0;

        this.scene.add(skyBox);
    },
    drawBubbleObject: function() {

        // create additional camera
        this.bSphereCamera = new THREE.CubeCamera(0.1, 1000, 1000);
        this.scene.add(this.bSphereCamera);

        // prepare custom ShaderMaterial
        var uniforms =  {
            "mRefractionRatio": { type: "f", value: 1.02 },
            "mBias":     { type: "f", value: 0.1 },
            "mPower":    { type: "f", value: 2.0 },
            "mScale":    { type: "f", value: 1.0 },
            "tCube":     { type: "t", value: this.bSphereCamera.renderTarget } //  textureCube }
        };

        // create custom material for the shader
        var customMaterial = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            vertexShader:   document.getElementById('bubble-vertex').textContent,
            fragmentShader: document.getElementById('bubble-fragment').textContent
        });

        // create spherical mesh
        this.bSphere = new THREE.Mesh( new THREE.SphereGeometry(50, 32, 32), customMaterial);
        this.bSphere.position.set(0, 0, 0);
        this.scene.add(this.bSphere);

        this.bSphereCamera.position = this.bSphere.position;
    }
};

// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    render();
    update();
}

// Update controls and stats
function update() {
    lesson5.controls.update(lesson5.clock.getDelta());
    lesson5.stats.update();
}

// Render the scene
function render() {
    if (lesson5.renderer) {

        // update bubble object
        lesson5.bSphere.visible = false;
        lesson5.bSphereCamera.updateCubeMap(lesson5.renderer, lesson5.scene);
        lesson5.bSphere.visible = true;

        lesson5.renderer.render(lesson5.scene, lesson5.camera);
    }
}

// Initialize lesson on page load
function initializeLesson() {
    lesson5.init();
    animate();
}

if (window.addEventListener)
    window.addEventListener('load', initializeLesson, false);
else if (window.attachEvent)
    window.attachEvent('onload', initializeLesson);
else window.onload = initializeLesson;
