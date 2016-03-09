

attribute vec2 position;
attribute vec2 texcoord;
uniform  float h;
varying vec2 coords;

void main() {
    gl_Position=vec4(position,0.0,1.0);
    coords=vec2(position.x,position.y*h);
}

/////////////// FRAG



uniform  float t;
varying  vec2 coords;
uniform  vec2 resolution;

const float threshold = .35;
const float mult = 1.0 / 17.0;
const mat4 adjustments = (mat4(
    1, 13, 4, 16,
    9, 5, 12, 8,
    3, 15, 2, 14,
    11, 7, 10, 6
) - 8.) * mult;

float getLuminance( vec4 color ) {
    return (0.2126*color.r + 0.7152*color.g + 0.0722*color.b);
}

float adjustFrag( float val, vec2 coord ) {
    vec2 coordMod = mod(coord, 4.0);
    int xMod = int(coordMod.x);
    int yMod = int(coordMod.y);

    vec4 col;
    if (xMod == 0) col = adjustments[0];
    else if (xMod == 1) col = adjustments[1];
    else if (xMod == 2) col = adjustments[2];
    else if (xMod == 3) col = adjustments[3];

    float adjustment;
    if (yMod == 0) adjustment = col.x;
    else if (yMod == 1) adjustment = col.y;
    else if (yMod == 2) adjustment = col.z;
    else if (yMod == 3) adjustment = col.w;

    return val + (val * adjustment);
}

void main() {

    vec2 p = gl_FragCoord.xy / resolution.xy;

    vec2 cc = 1.1*vec2( 0.5*cos(0.1 * t * 0.5) - 0.25 * cos(0.2 * t * 0.5),
                        0.5*sin(0.1 * t * 0.5) - 0.25 * sin(0.2 * t * 0.5) );

    vec4 dmin = vec4(1000.0);
    vec2 z = (-1.0 + 1.0*p)*vec2(0.6,0.3);
    for( int i=0; i<164; i++ )
    {
        z = cc + vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y );
        z += 0.15*sin(float(i));
        dmin=min(dmin, vec4(abs(0.0+z.y + 0.2*sin(z.x)),
                            abs(2.0+z.x + 0.5*sin(z.y)),
                            dot(z,z),
                            length( fract(z)-0.2) ) );
    }

    vec3 color = vec3( dmin.w );
    color = mix( color, vec3(0.80,0.40,0.80),     min(1.0,pow(dmin.x*0.25,0.80)) );
    color = mix( color, vec3(0.12,0.80,0.60),     min(1.0,pow(dmin.y*0.50,0.50)) );
    color = mix( color, vec3(0.50,0.40,0.20), 1.0-min(1.0,pow(dmin.z*1.00,0.15) ));

    color = 2.25*color*color;

    color *= 0.5 + 0.5*pow(4.0*p.x*(1.0-p.y)*p.y*(1.0-p.y),0.15);

    vec4 dither = vec4(color,1.0);

    float vidLum = getLuminance(dither);
    vidLum = adjustFrag(vidLum, gl_FragCoord.xy);

    if (vidLum > threshold) {
        gl_FragColor = vec4(1, 1, 1, 1);
    } else {
        gl_FragColor = vec4(0, 0, 0, 1);
    }

}