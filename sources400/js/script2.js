/**
 *
 * WebGL With Three.js - Lesson 5 - shader skybox and refraction
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
    rSphere: null,
    rSphereCamera: null,

    init: function() { // Initialization

        // create main scene
        this.scene = new THREE.Scene();

        var SCREEN_WIDTH = window.innerWidth,
            SCREEN_HEIGHT = window.innerHeight;

        // prepare camera
        var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1000;
        this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.position.set(0, 0, 300);
        this.camera.lookAt(new THREE.Vector3(0,0,0));

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
        this.controls.target = new THREE.Vector3(0, 0, 0);
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
        var cube = new THREE.Mesh( new THREE.CubeGeometry(20, 5, 20), new THREE.MeshLambertMaterial({color:0xff0000 * Math.random()}) );
        cube.position.set(0, 0, 0);
        this.scene.add(cube);

        // add shader skybox without textures
        this.drawShaderSkybox();

        // add refracting object
        this.drawRefractingObject();
    },
    drawShaderSkybox: function() {

        // prepare ShaderMaterial without textures
        var vertexShader = document.getElementById('sky-vertex').textContent, fragmentShader = document.getElementById('sky-fragment').textContent;
        var uniforms = {
            topColor: {type: "c", value: new THREE.Color(0x0055ff)}, bottomColor: {type: "c", value: new THREE.Color(0xffffff)},
            offset: {type: "f", value: 50}, exponent: {type: "f", value: 0.6}
        }
        var skyMaterial = new THREE.ShaderMaterial({vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide, fog: false});

        // create Mesh with sphere geometry and add to the scene
        var skyBox = new THREE.Mesh( new THREE.SphereGeometry(250, 60, 40), skyMaterial);

        this.scene.add(skyBox);
    },
    drawRefractingObject: function() {

        // create additional camera
        this.rSphereCamera = new THREE.CubeCamera(0.1, 1000, 1000);
        this.scene.add(this.rSphereCamera);
        this.rSphereCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();

        // create refracting material and spherical mesh
        var rMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffdd, 
            envMap: this.rSphereCamera.renderTarget, 
            refractionRatio: 0.995, 
            reflectivity: 0.5
        });

        this.rSphere = new THREE.Mesh( new THREE.SphereGeometry(40, 32, 32), rMaterial);
        this.rSphere.position.set(0, 0, 100);
        this.rSphereCamera.position = this.rSphere.position;
        this.scene.add(this.rSphere);
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

        // update refracting object
        lesson5.rSphere.visible = false;
        lesson5.rSphereCamera.updateCubeMap(lesson5.renderer, lesson5.scene);
        lesson5.rSphere.visible = true;

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
