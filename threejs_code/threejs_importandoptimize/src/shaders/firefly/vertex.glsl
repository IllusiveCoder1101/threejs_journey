uniform float uPixelRatio;
uniform float uSize;
attribute float aSize;
uniform float uTime;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0)*aSize*1.0; 
    modelPosition.z += cos(uTime + modelPosition.x * 100.0)*aSize*0.2;
        modelPosition.x += sin(uTime + modelPosition.x * 100.0)*aSize*0.9;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize + aSize - uPixelRatio; 
    gl_PointSize *= (-1.0/viewPosition.z); 
}