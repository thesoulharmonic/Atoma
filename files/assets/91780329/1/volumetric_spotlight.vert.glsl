
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 matrix_viewProjection;
uniform mat4 matrix_model;
uniform mat3 matrix_normal;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main()
{
    vNormal	= normalize( matrix_normal * aNormal);
    
    vec4 worldPosition	= matrix_model * vec4( aPosition, 1.0 );
	vWorldPosition		= worldPosition.xyz;
    
    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);
}
