
//https://github.com/mapbox/earcut
var w = window.innerWidth;
var h = window.innerHeight;
var scene, camera, renderer, mesh, group;

//PAR
var lat = 48.8534100;
var lng =  2.3488000;

//LDN
//lat = 51.5085300;
//lng = -0.1257400;

//BLN
//lat = 52.5243700;
//lng = 13.4105300;

//NYC
//lat = 40.7142700;
//lng = -74.0059700;

//SAN FRANCISCO
lat = 37.773972;
lng = -122.431297;
var zl = 13;

var start = 0;
var controls, skybox, light;

window.onload = function() {

    scene = new THREE.Scene();
    //scene.fog = new THREE.FogExp2( 0xFFFFFF, 0.00005 );
    camera = new THREE.PerspectiveCamera( 60, w / h,1, 100000 );

    renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer:true});
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls( camera );


    light = new THREE.PointLight(0xFFFFFF, 1 );
    scene.add( light );

    var xy = map.mercator.latLonToMeters( -lat, lng, map.zoom);

    camera.position.x = xy[0];
    camera.position.y = 5000;
    camera.position.z = xy[1]+100;
    controls.target.x = xy[0];
    controls.target.z = xy[1];
    camera.lookAt( controls.target );

    //skybox texture from http://www.keithlantz.net/2011/10/rendering-a-skybox-using-a-cube-map-with-opengl-and-glsl/
    skybox = new Skybox( "img/skybox_texture.jpg", 512, 0, function(){

        if( skybox.mesh ){
            skybox.mesh.position.x = xy[0];
            skybox.mesh.position.z = xy[1];
            scene.add( skybox.mesh );
        }

        materials.init( skybox.cubeMap );

        builder.init( scene );

        var size = 2048;
        water.init( function(){

             land.init( scene, size, xy, function(){

                 map.init( size, true );

                 map.eventEmitter.on( Map.ON_LOAD_COMPLETE, loadTaxis );

                 map.setView( lat, lng, zl );

             });
        });

    } );
    start = Date.now();
    update();

};

//init taxi lines when the rest is loaded
function loadTaxis( status ){
    if(status==0 ){
        map.eventEmitter.removeListener( Map.ON_LOAD_COMPLETE, loadTaxis );
        taxis.init( scene, camera );
    }
}



window.onresize = function()
{
    w = window.innerWidth;
    h = window.innerHeight;
    renderer.setSize( w,h );
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
};

function update(){

    requestAnimationFrame(update);

    //reloads map as we move around
    var ll = map.mercator.metersToLatLon( controls.target.x, -controls.target.z, map.zoom);
    map.setView( ll[0], ll[1] );

    camera.position.y = Math.max( 600,camera.position.y );
    light.position.copy( camera.position );

    materials.update();
    taxis.update();

    //if( taxis.length == 0 && taxiCurves.length >= taxiCurveId && taxiCurves[taxiCurveId] != undefined ){
    //    var time = ( Date.now() - start ) * 0.00000001 ;
    //    updateTaxiCam(time%1);
    //    renderer.render( scene, taxiCamera );
    //}
    //else{
    //}
    renderer.render( scene, camera );

}
