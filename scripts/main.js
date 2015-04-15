//Lat long for nyc
var latitude = 40.7142700;
var longitude = -74.0059700;

var galac;

var Gl;
var Gb;

var container, stats;

var camera, scene, renderer, objects;
var pointLight;

init();
animate();

function init() {
	container = document.createElement('div');
	document.body.appendChild(container);
	//telescop fov: 4.68
	camera = new THREE.PerspectiveCamera( 4.68, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 0, 0 );

	scene = new THREE.Scene();

	var size = 500, step = 100;

	var geometry = new THREE.SphereGeometry( 100, 48, 7 );

	var material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/Planck_8192px_30GHz.png' ) } );

	var sphere = new THREE.Mesh( geometry, material);

	sphere.position.x =  0;
	sphere.position.z = 0;

	sphere.rotation.x = 0;
	sphere.rotation.y = 90 * (Math.PI/180);
	sphere.rotation.z = 0;

	sphere.material.side = THREE.DoubleSide;

	scene.add( sphere );


	// Lights

	scene.add( new THREE.AmbientLight( Math.random() * 0x202020 ) );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	pointLight = new THREE.PointLight( 0xffffff, 1 );
	scene.add( pointLight );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	var debugCanvas = document.createElement( 'canvas' );
	debugCanvas.width = 512;
	debugCanvas.height = 512;
	debugCanvas.style.position = 'absolute';
	debugCanvas.style.top = '0px';
	debugCanvas.style.left = '0px';

	container.appendChild( debugCanvas );

	debugContext = debugCanvas.getContext( '2d' );
	debugContext.setTransform( 1, 0, 0, 1, 256, 256 );
	debugContext.strokeStyle = '#000000';

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function loadImage( path ) {

	var image = document.createElement( 'img' );
	var texture = new THREE.Texture( image, THREE.UVMapping )

	image.onload = function () { texture.needsUpdate = true; };
	image.src = path;

	return texture;

}

function animate() {

	galac = altaz2galac(latitude, longitude, 70, 200);

	Gl = parseFloat(galac[0])*(Math.PI/180);
	Gb = parseFloat(galac[1])*(Math.PI/180);

	render();
}

function render() {

	requestAnimationFrame( animate );

	var timer = Date.now() * 0.0001;

	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 0;

	console.log(Gl);
	console.log(Gb);

	camera.rotation.x=Gl;
	camera.rotation.y=Gb;

	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;

	renderer.render( scene, camera );

}

