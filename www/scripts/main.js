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
var focus;

var sphere30,sphere100,sphere353,sphere545;

var f30,
	f100,
	f353,
	f545;

var material30, material100, material353, material545;

init();
animate();

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
setInterval("checkCursor()", 1000);
function checkCursor(){
//alert("Cursor at: " + cursorX + ", " + cursorY);
}

function convertToRange(value, srcRange, dstRange){
  // value is outside source range return
  if (value < srcRange[0] || value > srcRange[1]){
    return NaN; 
  }

  var srcMax = srcRange[1] - srcRange[0],
      dstMax = dstRange[1] - dstRange[0],
      adjValue = value - srcRange[0];

  return (adjValue * dstMax / srcMax) + dstRange[0];

}

function init() {
	altitude = 30;
        azimuth = 30;
        focus = 512;
        /*
	//do the socket stuff
	var socket = io('http://localhost:8080');

        // 
        socket.on('connect', function () {
                    console.log('The server is ready!');
        });
        
        // on msg
        socket.on('A0', function (data) {
            
            // log the message
            console.log('A0 '+data);
            altitude = (data/1023)*90;
            
             // send message
            socket.emit('A0', 'hello server');
        });

         socket.on('A1', function (data) {
            
            // log the message
            console.log('A1 '+data);
            azimuth = (data/1023)*90;
            
             // send message
            socket.emit('A1', 'hello server');
        });

         socket.on('A2', function (data) {
            
            // log the message
            console.log('A2 '+data);
            focus = data;
            
             // send message
            socket.emit('A2', 'hello server');
        });
*/
    //do the threejs stuff
	container = document.createElement('div');
	document.body.appendChild(container);
	//telescop fov: 4.68
	camera = new THREE.PerspectiveCamera( 4.68, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set( 0, 0, 0 );

	scene = new THREE.Scene();

	var size = 500, step = 100;

	var geometry30 = new THREE.SphereGeometry( 100, 48, 7 );
	var geometry100 = new THREE.SphereGeometry( 110, 48, 7 );
	var geometry353 = new THREE.SphereGeometry( 120, 48, 7 );
	var geometry545 = new THREE.SphereGeometry( 130, 48, 7 );

	material30 = new THREE.MeshBasicMaterial( { transparent: true, map: THREE.ImageUtils.loadTexture( 'textures/CMB_30.png' )});
	material100 = new THREE.MeshBasicMaterial( { transparent: true, map: THREE.ImageUtils.loadTexture( 'textures/CMB_100.png' )});
	material353 = new THREE.MeshBasicMaterial( { transparent: true, map: THREE.ImageUtils.loadTexture( 'textures/CMB_353.png' )});
	material545 = new THREE.MeshBasicMaterial( { transparent: true, map: THREE.ImageUtils.loadTexture( 'textures/CMB_857.png' )});

	sphere30 = new THREE.Mesh( geometry30, material30);
	sphere100 = new THREE.Mesh( geometry100, material100);
	sphere353 = new THREE.Mesh( geometry353, material353);
	sphere545 = new THREE.Mesh( geometry545, material545);

	
	
	sphere30.rotation.y = 90 * (Math.PI/180);
	sphere30.material.side = THREE.DoubleSide;
	sphere30.material.depthWrite = false;
	scene.add( sphere30 );

	sphere100.rotation.y = 90 * (Math.PI/180);
	sphere100.material.side = THREE.DoubleSide;
	sphere100.material.depthWrite = false;
	scene.add( sphere100 );

	sphere353.rotation.y = 90 * (Math.PI/180);
	sphere353.material.side = THREE.DoubleSide;
	sphere353.material.depthWrite = false;
	scene.add( sphere353 );

	sphere545.rotation.y = 90 * (Math.PI/180);
	sphere545.material.side = THREE.DoubleSide;
	sphere545.material.depthWrite = false;
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

	f30=0;
	f100=0;
	f353=0;
	f545=0;

	if(cursorY<200){
		f30 = 1;
		f100 = convertToRange(cursorY, [0,200], [0,1]);
	}	else if (cursorY<400){
		f100 = 1;
		f353 = convertToRange(cursorY, [200,400], [0,1]);
	}	else if (cursorY<600){
		f353 = 1;
		f545 = convertToRange(cursorY, [400,600], [0,1]);
	}else{
		f545=1;
	}

	material30.opacity = f30;
	material100.opacity = f100;
	material353.opacity = f353;
	material545.opacity = f545;

	altitude = Math.sin(Date.now()*.0001)*10;
	azimuth = Math.cos(Date.now()*.0001)*10;

	galac = altaz2galac(latitude, longitude, altitude, azimuth);

	Gl = parseFloat(galac[0])*(Math.PI/180);
	Gb = parseFloat(galac[1])*(Math.PI/180);

	render();
}

function render() {

	//console.log(material545.opacity);
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

	sphere30.material.opacity = 1;
	renderer.render( scene, camera );

}

