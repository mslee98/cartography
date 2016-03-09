
uniform sampler2D texture;
uniform sampler2D depth;
uniform vec2 resolution;
uniform float time;

uniform float weight[5];
uniform float offset[5];


const float blurSteps = 6.;

void main(){

    vec2 uv = gl_FragCoord.xy/resolution;

    vec4 t_color = texture2D( texture, uv );
    vec4 t_depth = texture2D( depth, uv );

    float bin = .5;
    float bout = bin + .5;
    float f_d = smoothstep( bin, bout, abs( sin( ( t_depth.r - .25 ) * 3.14159 ) ) );

    /*
    vec4 blur = texture2D( texture, uv ) * weight[0];
    for ( int i = 1; i < 3; i++) {

        //for( float j = 1.; j <= 4.; j += 1. ){
            //float s = 1024. / j;
            //float d = 1. / ( 8.  );
            blur += .5 * texture2D( texture, uv + ( vec2( 0.0, offset[i] ) / 1024. ) ) * weight[i] ;
            blur += .5 * texture2D( texture, uv - ( vec2( 0.0, offset[i] ) / 1024. ) ) * weight[i] ;

            blur += .5 * texture2D( texture, uv + ( vec2( offset[i], 0.0 ) / 1024. ) ) * weight[i] ;
            blur += .5 * texture2D( texture, uv - ( vec2( offset[i], 0.0 ) / 1024. ) ) * weight[i] ;

        //}
    }
    //*/

    /*
    vec4 blur = vec4(1.);
    for ( float i = 0.; i < 5.; i+=1.) {
        for ( float j = 0.; j < 5.; j+=1.) {
            blur += texture2D( texture, uv + ( vec2( i, j ) / 1024. ) );
        }
    }
    blur /= 25.;
    //*/

    vec4 blur = vec4(1.);
    for ( float i = 0.; i < blurSteps; i+=1.) {
        for ( float j = 0.; j < blurSteps; j+=1.) {
            blur += ( 1. / blurSteps )*texture2D( texture, uv + ( vec2( i-blurSteps*.5, j-blurSteps*.5 ) / 1024. ) );
        }
    }
    blur /= blurSteps;



    //DOF
    gl_FragColor = mix( t_color, blur, f_d );

    vec4 bg = vec4( vec3(length(uv-vec2(0.5,0.) ) ), 1. );
    vec4 color0 = vec4( 1., 1., 0.9, 1. );
    vec4 color1 = vec4( 0.65, 0.85, 0.8, 1. );

    bg = mix( color0, color1, sin(bg.r) );

    gl_FragColor += ( 1. - gl_FragColor.a ) * bg;


}
