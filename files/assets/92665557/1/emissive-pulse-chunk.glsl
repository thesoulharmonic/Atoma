// uniform float iTime;
// uniform vec3 iResolution;

// #ifdef MAPCOLOR
// uniform vec3 material_emissive;
// #endif

// #ifdef MAPFLOAT
// uniform float material_emissiveIntensity;
// #endif

// #ifdef MAPTEXTURE
// uniform sampler2D texture_emissiveMap;
// #endif

// #define TWO_PI 6.28318530718

// vec3 hsb2rgb( in vec3 c, float modifier ){
//     vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,modifier*4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
//     rgb = rgb*rgb*(3.0-2.0*rgb);
//     return c.z * mix( vec3(1.0), rgb, c.y);
// }

// vec3 getEmission() {
//     vec3 emission = vec3(1.0);

//     #ifdef MAPFLOAT
//     emission *= material_emissiveIntensity;
//     #endif

//     #ifdef MAPCOLOR
//     emission *= material_emissive;
//     #endif

//     #ifdef MAPTEXTURE
//     vec2 st = -1.0 + 2.0 *$UV;
//     // vec2 st = $UV;

//     st.x *= iResolution.x / iResolution.y;
//     st *= 2.0;
//     // st = fract(st);
//     vec3 color = vec3(0.0);

//     // Use polar coordinates instead of cartesian
//     vec2 toCenter = vec2(0.5) - st;
//     // vec2 toCenter = st;

//     float angle = atan(toCenter.y,toCenter.x);
//     // float angle = atan(st.y,st.x);
//     float radius = length(toCenter)*2.0;
//     // Map the angle (-PI to PI) to the Hue (from 0 to 1)
//     // and the Saturation to the radius
//     color = hsb2rgb(vec3(((angle + sin(iTime/(TWO_PI/2.2)) * TWO_PI)/TWO_PI)+0.5,radius,1.0), sin(iTime/10.0));
//     emission *= abs(color);
//     emission *= clamp(0.1, 0.3, (sin(iTime)/3.0));
//     // emission *= vec3(smoothstep(0.45, 0.5, toCenter.x), 0.0, 0.0);
//     // emission *= vec3(st.x, 0.0, 0.0);
//     emission = vec4(1.0, 1.0, 1, 1.0);

//     #endif

//     #ifdef MAPVERTEX
//     emission *= gammaCorrectInput(saturate(vVertexColor.$VC));
//     #endif

//     // return material_emissive * (2.0 + sin(iTime));
//     return emission;
// }

uniform float iTime;
uniform vec3 iResolution;

#ifdef MAPCOLOR
uniform vec3 material_emissive;
#endif

#ifdef MAPFLOAT
uniform float material_emissiveIntensity;
#endif

#define TWO_PI 6.28318530718

vec3 hsb2rgb( in vec3 c, float modifier ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,modifier*4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

void getEmission() {
    dEmission = vec3(1.0);

    #ifdef MAPFLOAT
    dEmission *= material_emissiveIntensity;
    #endif

    #ifdef MAPCOLOR
    dEmission *= material_emissive;
    #endif

    #ifdef MAPTEXTURE
    dEmission *= $DECODE(texture2DBias($SAMPLER, $UV, textureBias)).$CH;
    #endif

    #ifdef MAPVERTEX
    dEmission *= gammaCorrectInput(saturate(vVertexColor.$VC));
    #endif


    dEmission *= (1.0 + sin(iTime * 1.5))/2.0;

    // vec2 st = -1.0 + 2.0 *$UV;
    // vec2 st = $UV;
    // st.x *= iResolution.x / iResolution.y;
    // st *= 2.0;
    // // st = fract(st);
    // vec3 color = vec3(0.0);

    // // Use polar coordinates instead of cartesian
    // vec2 toCenter = vec2(0.5) - st;
    // // vec2 toCenter = st;

    // float angle = atan(toCenter.y,toCenter.x);
    // // float angle = atan(st.y,st.x);
    // float radius = length(toCenter)*2.0;
    // // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // // and the Saturation to the radius
    // color = hsb2rgb(vec3(((angle + sin(iTime/(TWO_PI/2.2)) * TWO_PI)/TWO_PI)+0.5,radius,1.0), sin(iTime/10.0));
    // dEmission *= abs(color);
    // dEmission *= clamp(0.1, 0.3, (sin(iTime)/3.0));
    // // emission *= vec3(smoothstep(0.45, 0.5, toCenter.x), 0.0, 0.0);
    // // emission *= vec3(st.x, 0.0, 0.0);

    // // dEmission *= emission;
}
