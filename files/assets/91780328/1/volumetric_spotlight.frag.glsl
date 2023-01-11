
uniform vec3 u_lightColor;
uniform vec3 u_spotPosition;
uniform float u_attenuation;
uniform float u_anglePower;


varying vec3 vNormal;
varying vec3 vWorldPosition;


void main(void)
{
    float intensity = 0.3;
    
    intensity = distance(vWorldPosition, u_spotPosition) / u_attenuation;
    intensity = 1.0 - clamp(intensity, 0.0, 1.0);
    
    vec3 normal	= vec3(vNormal.x, vNormal.y, abs(vNormal.z));
	float angleIntensity = pow( dot(normal, vec3(0.0, 0.0, 1.0)), u_anglePower );
	intensity = intensity * angleIntensity;
        
    gl_FragColor = vec4(u_lightColor, intensity);
}
