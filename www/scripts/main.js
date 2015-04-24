//Lat long for nyc
var latitude = 40.7142700;
var longitude = -74.0059700;

var galac;

var Gl;
var Gb;

var container, stats;

var camera, scene, renderer, objects;
var pointLight;

var altitude;
var azimuth;

var material30;

init();
animate();

function init() {

	//do the socket stuff
	var socket = io('http://localhost:8080');
        
        // 
        socket.on('connect', function () {
                    console.log('The server is ready!');
        });
        
        // on msg
        socket.on('msg', function (data) {
            
            // log the message
            console.log(data);
            //altitude = (data/1023)*90;
            
             // send message
            socket.emit('msg', 'hello server');
        });
    //do the threejs stuff
	container = document.createElement('div');
	document.body.appendChild(container);
	//telescop fov: 4.68
	camera = new THREE.PerspectiveCamera( 4.68, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.set( 0, 0, 0 );

	scene = new THREE.Scene();

	var size = 500, step = 100;

	var geometry = new THREE.SphereGeometry( 100, 48, 7 );

	material30 = new THREE.MeshBasicMaterial( { transparent: true, map: THREE.ImageUtils.loadTexture( 'textures/PlanckFig_map_columbi1_IDL_HighDR_12000px_30GHz_cart.png' ) } );
	var material100 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/PlanckFig_map_columbi1_IDL_HighDR_12000px_100GHz_cart.jpg' ) } );
	var material353 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/PlanckFig_map_columbi1_IDL_HighDR_12000px_353GHz_cart.jpg')});
	var material545 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/PlanckFig_map_columbi1_IDL_HighDR_12000px_545GHz_cart.jpg' ) } );
	
	var sphere30 = new THREE.Mesh( geometry, material30);
	var sphere100 = new THREE.Mesh( geometry, material100);
	var sphere353 = new THREE.Mesh( geometry, material353);
	var sphere545 = new THREE.Mesh( geometry, material545);

	//sphere30.position.x =  0;
	//sphere30.position.z = 0;
	//sphere30.rotation.z = 0;
	//sphere30.rotation.x = 0;
	
	sphere30.rotation.y = 90 * (Math.PI/180);
	sphere30.material.side = THREE.DoubleSide;
	scene.add( sphere30 );

	sphere100.rotation.y = 90 * (Math.PI/180);
	sphere100.material.side = THREE.DoubleSide;
	sphere100.scale.set(2,2,2);
	scene.add( sphere100 );

	sphere353.rotation.y = 90 * (Math.PI/180);
	sphere353.material.side = THREE.DoubleSide;
	sphere353.scale.set(3,3,3);
	scene.add( sphere353 );

	sphere545.rotation.y = 90 * (Math.PI/180);
	sphere545.material.side = THREE.DoubleSide;
	sphere545.scale.set(4,4,4);
	scene.add( sphere545 );



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

	altitude = Math.sin(Date.now()*.001);
	material30.opacity=(altitude+1)*.5;
	galac = altaz2galac(latitude, longitude, altitude, 200);

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

	//console.log(Gl);
	//console.log(Gb);

	camera.rotation.x=Gl;
	camera.rotation.y=Gb;

	pointLight.position.x = 0;
	pointLight.position.y = 0;
	pointLight.position.z = 0;

	renderer.render( scene, camera );

}

