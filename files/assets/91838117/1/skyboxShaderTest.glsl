varying vec3 vViewDir;

uniform samplerCube texture_cubeMap;
uniform float iTime;
uniform float iColorIntensity;

vec3 sundir;

vec3 sky( vec3 rd )
{
    vec3 col = vec3(0.);
    
    float hort = 1. - clamp(abs(rd.y), 0., 1.);
    col += 0.5*vec3(.5,.5,.0)*exp2(hort*8.-8.);
    col += 0.1*vec3(.5,.9,1.)*exp2(hort*3.-3.);
    col += 0.55*vec3(.6,.6,.9);

    float sun = clamp( dot(sundir,rd), 0.0, 1.0 );
    col += .2*vec3(1.0,0.3,0.2)*pow( sun, 2.0 );
    col += .5*vec3(1.,.9,.9)*exp2(sun*650.-650.);
    col += .1*vec3(1.,1.,0.1)*exp2(sun*100.-100.);
    col += .3*vec3(1.,.7,0.)*exp2(sun*50.-50.);
    col += .5*vec3(1.,0.3,0.05)*exp2(sun*10.-10.); 
    
    col = mix(col, vec3(sin(iTime), cos(iTime), cos(iTime - 1.6)), 0.5);
    // vec3 lookupVec = fixSeams(cubeMapProject(dReflDirW));T
    // vec3 lookupVec = vec3(.0, 1.0, .0);

    // lookupVec.x *= -1.0;
    // col += textureCube(texture_skybox, lookupVec).rgb * 1.0;
    
    //float ax = atan(rd.y,length(rd.xz))/1.;
    //float ay = atan(rd.z,rd.x)/2.;
    //float st = texture( texture_dithering, vec2(ax,ay) ).x;
    //float st2 = texture( texture_dithering, .25*vec2(ax,ay) ).x;
    //st *= st2;
    //st = smoothstep(0.65,.9,st);
    //col = mix(col,col+1.8*st,clamp(1.-1.1*length(col),0.,1.));
    
    return col;
}

void main(void) {
    sundir = normalize(vec3(-0.7,0.0,-1.));
    vec3 dir=vViewDir;
    dir.x *= -1.0;
    vec3 color = processEnvironment($textureCubeSAMPLE(texture_cubeMap, fixSeamsStatic(dir, $FIXCONST)).rgb);
    color = toneMap(color);
    color = gammaCorrectOutput(color);
    gl_FragColor = vec4(color * sky(dir) * iColorIntensity, 1.0);
}
