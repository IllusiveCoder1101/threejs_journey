void main(){
    float distancetocenter = distance(gl_PointCoord,vec2(0.5,0.5));
    float strength = 0.05/distancetocenter - 0.10;
    gl_FragColor = vec4(strength,strength,1.0,strength);
}