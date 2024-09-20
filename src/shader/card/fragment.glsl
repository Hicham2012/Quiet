uniform sampler2D uMap;
uniform float uStep;

varying vec2 vUv;
varying float vElevation;

#include '../utils/noise.glsl';



void main() {
    vec3 texture = texture(uMap, vUv).rgb;
    float noise = snoise(vUv.xy * 100.);

    texture *= vElevation * 2.0 + 0.85;

    if(uStep == 1.) {
        noise /= 2.;
    }

    

    gl_FragColor = vec4(texture * smoothstep(noise, 1., uStep), 1.);
}