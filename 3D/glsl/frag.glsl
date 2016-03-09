uniform sampler2D map;
uniform sampler2D ele;
uniform float time;

varying vec2 vUv;
varying vec3 pos;
varying vec3 nor;

void main(void) {

    vec3 lightColor = vec3( 1. );
    vec3 lightPosition = vec3( 1.,1.,1. );
    vec3 lightDirection = normalize( lightPosition - pos );


    //lighting
    vec3 c = ( 0.35 + max( 0.0, dot( nor, lightDirection) ) * 0.4 ) * lightColor;

    gl_FragColor = vec4( c, 1.0 );
}