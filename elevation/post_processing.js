

var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group, target, start = 0;
var mat, depth,tex_map,tex_ele;


var proxy = "../proxy.php?url=";
var domains = "01,02,03,04".split( ',' );

var provider = "http://ttiles{s}.mqcdn.com/tiles/1.0.0/vy/sat/{z}/{x}/{y}.png";
var ele_provider = proxy + "http://elasticterrain.xyz/data/tiles/{z}/{x}/{y}.png";

var size = 1024;
var map = new Map( provider, domains, size * 2, size * 2, 4, 11 );
var ele = new Map( ele_provider, [], size, size,4,10 );

////Nevada,Chile-N,
var lat = -26.48;
var lng = -68.58;
var zl  = 12;
var sl = new ShaderLoader();
sl.loadShaders( {
    depth_fs:"",
    depth_vs:"",
    map_fs:"",
    map_vs:"",
    fx_fs:""
}, "glsl/", onShadersLoaded );

function onShadersLoaded() {


    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, w / h, 10, 1500 );
    camera.position.y = 350;
    camera.position.z = 1100;

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

    var geom = new THREE.PlaneBufferGeometry( 1024,1024, 512,512);
    mesh = new THREE.Mesh( geom, mat );
    mesh.rotateX( -Math.PI/2 );
    group.add(mesh);
    scene.add( group );

    ele.setView( lat, lng, 10 );
    map.setView( lat, lng, 10 );

    target = new THREE.Vector3(0,-350,0);
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

function update(){

    requestAnimationFrame(update);
    map.setView( ele.latitude, ele.longitude, ele.zoom + 1 );

    mat.uniforms.time.value  = ( Date.now() - start ) * .001;

    mat.uniforms.heroic.value = depth.uniforms.heroic.value = 1;

    mat.uniforms.scale.value =
    depth.uniforms.scale.value = 1 / map.resolution( Math.min( map.maxZoom-1, map.zoom ) ) * 3;
    camera.lookAt( target );

    PostPrcessing.render();

}