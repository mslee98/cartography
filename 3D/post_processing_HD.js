

var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

var size = 1024;

var proxy = "../proxy.php?url=";
var provider = "http://ttiles{s}.mqcdn.com/tiles/1.0.0/vy/sat/{z}/{x}/{y}.png";
var domains = "01,02,03,04".split( ',' );

//stamen watercolor
//provider = proxy + "http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png";
//domains = "a,b,c".split( ',' );

//stamen black white
//provider = proxy + 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png';
//domains = 'abcd'.split('');

//esri photo
//provider = proxy + 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
//domains = [];

//hikebike hillshading
//provider = proxy + 'http://{s}.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png';
//domains = 'abc'.split('');


//night cities
//provider = proxy + 'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/'+
//    '{z}/{y}/{x}.jpg';

//weather
//provider = proxy +'http://{s}.tile.openweathermap.org/map/pressure/{z}/{x}/{y}.png';
//domains = 'abc'.split('');

var map = new Map( provider, domains, size *2, size *2, 4, 11 );
//var ele_provider =  proxy + "http://elasticterrain.xyz/data/tiles/{z}/{x}/{y}.png";
ele_provider = proxy + "http://dem-grabber/elasticterrain/{z}/{x}/{y}.png";
var ele = new Map( ele_provider, [], size, size,4,10 );

var mat, depth;
var tex_map;
var tex_ele;
/*
 Arhab,Arabia-S,15.63,44.08
 Atuel,Argentina,-34.65,-70.05
 Auquihuato,Perú,-15.07,-73.18
 Azufre,Chile-N,-21.79,-68.24
 Azul,Galápagos,-0.92,-91.41
 Azul,Chile-C,-35.65,-70.76
 Barrier,Africa-E,2.32,36.57
 Bayo,Chile-N,-25.42,-68.58
 Blancas,Chile-C,-36.29,-71.01
 Casiri,Perú,-17.47,-69.81
 Chachani,Perú,-16.19,-71.53
 Chichón,México,17.36,-93.23
 Chillán,Chile-C,-36.86,-71.38
 Cochons,Indian O.-S,-46.1,50.23
 Cóndor,Argentina,-26.62,-68.35
 Cumbres,México,19.15,-97.27
 Dhamar,Arabia-S,14.57,44.67
 Druze,Syria,32.66,36.43
 Escorial,Chile-N,-25.08,-68.37
 Est,Indian O.-S,-46.43,52.2
 Fournaise,Indian O.-W,-21.23,55.71
 Gloria,México,19.33,-97.25
 Harrah,Arabia-W,31.08,38.42
 Haylan,Arabia-S,15.43,44.78
 Humeros,México,19.68,-97.45
 Incahuasi,Chile-N,-27.04,-68.28
 Ithnayn,Arabia-W,26.58,40.2
 Jayu Khota,Bolivia,-19.45,-67.42
 Khaybar,Arabia-W,25,39.92
 Koussi,Africa-N,19.8,18.53
 Lengai,Africa-E,-2.76,35.91
 Longaví,Chile-C,-36.19,-71.16
 Lunayyir,Arabia-W,25.17,37.75
 Malinche,México,19.23,-98.03
 Marra,Africa-N,12.95,24.27
 Maule,Chile-C,-36.02,-70.58
 Misti,Perú,-16.29,-71.41
 Negrillar,Chile-N,-24.28,-68.6
 Nevada,Chile-N,-26.48,-68.58
 Nicholson,Perú,-16.26,-71.73
 Ojos del Salado,Chile-N,-27.12,-68.55
 Orizaba,México,19.03,-97.27
 Pantoja,Chile-C,-40.77,-71.95
 Possession,Indian O.-S,-46.42,51.75
 Quill,W Indies,17.48,-62.96
 Rahah,Arabia-W,27.8,36.17
 Rahat,Arabia-W,23.08,39.78
 Sawâd,Arabia-S,13.58,46.12
 Solo,Chile-N,-27.11,-68.72
 Telong,Sumatra,4.77,96.82
 Tigre,Honduras,13.27,-87.64
 Tôh,Africa-N,21.33,16.33
 Toluca,México,19.11,-99.76
 Toussidé,Africa-N,21.03,16.45
 Tujle,Chile-N,-23.83,-67.95
 Tuzgle,Argentina,-24.05,-66.48
 'Uwayrid,Arabia-W,27.08,37.25
 Voon,Africa-N,20.92,17.28
 Zacate Grande,Honduras,13.33,-87.63
 */
var lat  = 47;
var lng  = 10;
//azufre
lat = -21.79;
lng =-68.24;

//rahah
//lat = 27.8;
//lng = 36.17;

//lat = -13.08;
//lng = -72.3;
//ne
//lat = -19.45;
//lng = -67.42;

//solo
//lat = -27.11;
//lng = -68.72;


////Nevada,Chile-N,
lat = -26.48;
lng = -68.58;

//Azul,Galápagos,
// lat = -0.92;
// lng = -91.41

//Azul,Chile-C,
//lat = -35.65;
//lng = -70.76

//Tigre,Honduras,
//    lat=13.27;lng=-87.64
//Gloria,México,
//    lat=19.33,lng=-97.25

//alps
//lat = 47;
//lng = 10;

//lisbon
//lat = 38.7166700;
//lng = -9.1333300;

lat = 31.27488396101444;
lng = -8.226957929686238;

var zl  = 12;
var start = 0;
var sl = new ShaderLoader();
sl.loadShaders( {
    depth_fs:"",
    depth_vs:"",
    map_fs:"",
    map_vs:"",
    fx_fs:""
}, "../js/glsl/", onShadersLoaded );

function onShadersLoaded() {

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 40, w / h, 10, 1500 );
    camera.position.y = 250;
    camera.position.z = 1000;
    //new THREE.OrbitControls( camera );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    document.body.appendChild(renderer.domElement);

    map.eventEmitter.on( Map.ON_TEXTURE_UPDATE, onTextureUpdate );
    ele.eventEmitter.on( Map.ON_TEXTURE_UPDATE, onTextureUpdate );

    controls.add( map );
    controls.add( ele );
    controls.addListeners(renderer.domElement);

    tex_map = new THREE.Texture( map.canvas, null, THREE.wrapS, THREE.wrapT, THREE.LinearFilter, THREE.LinearFilter  );
    tex_ele = new THREE.Texture( ele.canvas, null, THREE.wrapS, THREE.wrapT, THREE.LinearFilter, THREE.LinearFilter  );

    PostPrcessing.init( w,h, scene, camera, renderer );


    mat = new THREE.ShaderMaterial({
        uniforms: {
            map: {type: "t", value: tex_map },
            ele: {type: "t", value: tex_ele },

            weight: {type: "fv1", value: [ 0.2270270270, 0.1945945946, 0.1216216216, 0.0540540541, 0.0162162162 ] },
            offset: {type: "fv1", value: [ 0.0, 1.0, 2.0, 3.0, 4.0 ] },

            nearFar: {type: "v2", value: new THREE.Vector2(camera.near, camera.far) },
            scale: {type: "f", value: 0 },
            time: {type: "f", value: 0 },
            heroic: {type: "f", value: 0 }
        },
        vertexShader: ShaderLoader.get("map_vs"),
        fragmentShader: ShaderLoader.get("map_fs"),
        side: THREE.DoubleSide,
        transparent:true
    });

    depth = new THREE.ShaderMaterial({
        uniforms: {
            ele: {type: "t", value: tex_ele },
            nearFar: {type: "v2", value: new THREE.Vector2(camera.near, camera.far) },
            scale: {type: "f", value: 5 },
            heroic: {type: "f", value: 1 }

        },
        vertexShader: ShaderLoader.get("map_vs"),
        fragmentShader: ShaderLoader.get("depth_fs"),
        side: THREE.DoubleSide,
        transparent:true
    });

    PostPrcessing.depthMaterial = depth;

    group = new THREE.Group();

    var geom = new THREE.PlaneBufferGeometry( 1024,1024, 1024,1024 );
    mesh = new THREE.Mesh( geom, mat );
    mesh.rotateX( -Math.PI/2 );
    group.add(mesh);
    scene.add( group );

    ele.setView( lat, lng, 10 );
    map.setView( lat, lng, 10 + 1 );

    //map.setView( 0,0,2 );
    //ele.setView( 0,0,2 );
    start = Date.now();
    update();

    window.onresize = function(e)
    {
        w = window.innerWidth;
        h = window.innerHeight;
        renderer.setSize( w,h );
        camera.aspect = w/h;

        PostPrcessing.resize(w,h);

        camera.updateProjectionMatrix();
    }
}
function onTextureUpdate()
{
    tex_map.needsUpdate = true;
    tex_ele.needsUpdate = true;
}

var material_depth = new THREE.MeshDepthMaterial();

function update(){

    requestAnimationFrame(update);
    map.setView( ele.latitude, ele.longitude, ele.zoom +1 );

    mat.uniforms.time.value  = ( Date.now() - start ) * .001;

    mat.uniforms.heroic.value = depth.uniforms.heroic.value = 0;

    mat.uniforms.scale.value =
    depth.uniforms.scale.value = 1 / map.resolution( Math.min( map.maxZoom-1, map.zoom ) ) * 2;
    camera.lookAt( group.position );



    PostPrcessing.render();

}

//raf: https://github.com/cagosta/requestAnimationFrame/blob/master/app/requestAnimationFrame.js
(function(global) {(function() {if (global.requestAnimationFrame) {return;} if (global.webkitRequestAnimationFrame) {global.requestAnimationFrame = global[ 'webkitRequestAnimationFrame' ]; global.cancelAnimationFrame = global[ 'webkitCancelAnimationFrame' ] || global[ 'webkitCancelRequestAnimationFrame' ];} var lastTime = 0; global.requestAnimationFrame = function(callback) {var currTime = new Date().getTime(); var timeToCall = Math.max(0, 16 - (currTime - lastTime)); var id = global.setTimeout(function() {callback(currTime + timeToCall);}, timeToCall); lastTime = currTime + timeToCall; return id;}; global.cancelAnimationFrame = function(id) {clearTimeout(id);};})(); if (typeof define === 'function') {define(function() {return global.requestAnimationFrame;});}})(window);


