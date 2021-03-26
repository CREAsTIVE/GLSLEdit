var wi = 500;
var he = 500;
var scene;
var camera;
var renderer;
var dateObj;
var s;
var uniforms;
var material;
var geometry;
var sprite;
var rendering = false;
function scene_setup(){
	//This is all code needed to set up a basic ThreeJS scene

	//First we initialize the scene and our camera
	scene = new THREE.Scene();
	//camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera = new THREE.PerspectiveCamera( 75, wi / he, 0.1, 1000 );

	//We create the WebGL renderer and add it to the document
	renderer = new THREE.WebGLRenderer();
	//renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( wi, he );
	document.body.appendChild( renderer.domElement );
}

scene_setup();

//Add your code here!
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00} );//We make it green
var cube = new THREE.Mesh( geometry, material );
//Add it to the screen
scene.add( cube );
cube.position.z = -3;//Shift the cube back so we can see it
window.onload=function(){ 
	document.getElementById("startComp").addEventListener('click',function(){
		dateObj = new Date();
		s = 0;
		//var haveTime = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000)/1000;
		//Load the GLSL code from the HTML as a string
		var shaderCode = document.getElementById('code').value; 
		THREE.ImageUtils.crossOrigin = '';// Позволяет загружать внешнее изображение
		//var tex = THREE.ImageUtils.loadTexture( "https://i.ibb.co/TLSZ443/1000.png" );
		//Our data to be sent to the shader
		uniforms = {};
		var ul =  document.getElementById('uniformsList');
		for (var i = ul.childElementCount - 1; i >= 0; i--) {
			uniforms[ul.childNodes[i].childNodes[0].value] = {type: ul.childNodes[i].childNodes[2].value, value: getValue(ul.childNodes[i].childNodes[2].value, ul.childNodes[i].childNodes[1].value)}
		}
		//uniforms.resolution = {type:'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)};
		uniforms.resolution = {type:'v2',value:new THREE.Vector2(wi,he)};
		//uniforms.texture = {type:'t',value:tex};
		uniforms.time = {type: 'f', value:0}

		//Create an object to apply the shaders to
		
		material = new THREE.ShaderMaterial({uniforms:uniforms,fragmentShader:shaderCode});
		geometry = new THREE.PlaneGeometry( 10, 10 );
		sprite = new THREE.Mesh(geometry,material);
		scene.add( sprite );
		sprite.position.z = -1;//Move it back so we can see it
		if (!rendering){
			rendering = true;
			render();

		}
		
	})
	document.getElementById("addEl").addEventListener('click',appendEl)
	document.getElementById("removeEl").addEventListener('click',rmEl)
}



//Render everything!
function render() {
	cube.rotation.y += 0.05;
	//uniforms.resolution.value.x = window.innerWidth;
	//uniforms.resolution.value.y = window.innerHeight;
	var cdateObj = new Date();
	haveTime = (cdateObj.getTime() - dateObj.getTime())/1000 - (s * 1000);
	//console.log(haveTime)
	uniforms.time.value = haveTime;
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}

function appendEl() {
	var ul =  document.getElementById('uniformsList');
	ul.appendChild(document.createElement("li"));
	var il = ul.childNodes[ul.childElementCount - 1];
	il.appendChild(document.createElement("input"))
	il.childNodes[0].size = 20
	il.childNodes[0].placeholder = "Имя"
	il.childNodes[0].type = "text"
	il.appendChild(document.createElement("input"))
	il.childNodes[1].size = 20
	il.childNodes[1].placeholder = "Значение"
	il.childNodes[1].type = "text"
	il.appendChild(document.createElement("select"))
	il.childNodes[2].innerHTML = "<option>f</option><option>t</option><option>i</option>"
}
function rmEl(){
	var ul =  document.getElementById('uniformsList');
	if (ul.childElementCount > 0){
		ul.removeChild(ul.childNodes[ul.childElementCount - 1])
	}
	
}

function getValue(type, value){
	return type == "t" ? THREE.ImageUtils.loadTexture(value) : Number(value)
}