import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters={}
let PointsGeometry=null
let PointsMaterial=null
let Points=null
parameters.count=100000
parameters.size=0.01
parameters.radius=5
parameters.angle=3
parameters.spin=1
parameters.randomness=0.2
parameters.randomnessPower=1
parameters.insideColor="#ff6745"
parameters.outsideColor="#006243"
const generateGalaxy=()=>{
    if(Points!==null){
        PointsGeometry.dispose()
        PointsMaterial.dispose()
        scene.remove(Points)
    }
    const colors=new Float32Array(parameters.count*3)
    const insideC=new THREE.Color(parameters.insideColor)
    const outsideC=new THREE.Color(parameters.outsideColor)
    const positions=new Float32Array(parameters.count*3)
    PointsGeometry=new THREE.BufferGeometry()
    for (let i=0;i<parameters.count*3;i++){
        const i3=i*3
        const radius=Math.random()*parameters.radius
        const Angle=(i % parameters.angle)/parameters.angle *Math.PI *2
        const SpinAngle=radius*parameters.spin
        const randomX=Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()-0.5)*radius*parameters.randomness
        const randomY=Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()-0.5)*radius*parameters.randomness
        const randomZ=Math.pow(Math.random(),parameters.randomnessPower)*(Math.random()-0.5)*radius*parameters.randomness
        positions[i3]=Math.cos((Math.random()*SpinAngle))*radius**Math.sin(parameters.randomness)+randomX
        positions[i3+1]=Math.sin((Math.random()*(Math.random()/Angle+SpinAngle)))*radius+randomY
        positions[i3+2]=Math.sin((Math.random()*SpinAngle))*radius*Math.cos(parameters.randomness)+randomZ
        const mixedC=insideC.clone()
        mixedC.lerp(outsideC,radius/parameters.radius)
        colors[i3]=mixedC.r
        colors[i3+1]=mixedC.g
        colors[i3+2]=mixedC.b
    }

    PointsMaterial=new THREE.PointsMaterial({size:parameters.size,sizeAttenuation:true,vertexColors:true,depthWrite:false})
    Points=new THREE.Points(PointsGeometry,PointsMaterial)
    Points.geometry.setAttribute("position",new THREE.BufferAttribute(positions,3))
    Points.geometry.setAttribute("color",new THREE.BufferAttribute(colors,3))
    scene.add(Points)

}
generateGalaxy()
gui.add(parameters,"count").min(1).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters,"size").min(0.01).max(1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,"radius").min(3).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,"spin").min(1).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,"angle").min(1).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,"randomness").min(0.1).max(1).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters,"randomnessPower").min(1).max(10).step(0.05).onFinishChange(generateGalaxy)
gui.addColor(parameters,"insideColor").onFinishChange(generateGalaxy)
gui.addColor(parameters,"outsideColor").onFinishChange(generateGalaxy)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()