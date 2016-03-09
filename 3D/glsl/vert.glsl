
const highp float size = 0.00390625;// ( 1./256. )

uniform sampler2D ele;
varying vec2 vUv;
varying vec3 pos;
varying vec3 nor;

float decodeElevation( vec2 uv ){

    vec2 colorChannels = texture2D( ele, ( uv / 256. * 254.) + size ).xy;
    //colorChannels = texture2D( ele, uv ).xy;

    float elevation = ( colorChannels.x * 256.0 + ( colorChannels.y * 256.0 * 256.0 ) - 11000.0 );//~Mariana Trench

    //~everest
    elevation = min( elevation, 8800.0 );

    return elevation;
}

void main(void){

    vUv = uv;
    pos = position;

    nor = normal;
    //left pixel
    vec2 luv = uv;
    luv.x = max( uv.x - size, uv.x );

    //right pixel
    vec2 ruv = uv;
    ruv.x = max( uv.x + size, uv.x );

    //top pixel
    vec2 tuv = uv;
    tuv.y = max( uv.y, uv.y - size );

    //bottom pixel
    vec2 buv = uv;
    buv.y = max( uv.y, uv.y + size );

    //difference XY
    nor.x += ( decodeElevation( luv ) - decodeElevation( ruv ) );
    nor.y += ( decodeElevation( tuv ) - decodeElevation( buv ) );

    nor = normalize( nor );

    float elevation = decodeElevation( uv );
    pos.z += elevation * .001;

    gl_Position = projectionMatrix * modelMatrix * vec4(pos, 1.0);

}