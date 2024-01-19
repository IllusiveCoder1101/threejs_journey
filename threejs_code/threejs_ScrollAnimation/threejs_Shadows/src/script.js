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

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
directionalLight.position.set(2, 2, - 1)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001)
directionalLight.castShadow=true
scene.add(directionalLight)
directionalLight.shadow.mapSize.width=2048
directionalLight.shadow.mapSize.height=2048
directionalLight.shadow.camera.near=1
directionalLight.shadow.camera.far=6
directionalLight.shadow.camera.top=2
directionalLight.shadow.camera.bottom=-2
directionalLight.shadow.camera.right=3
directionalLight.shadow.camera.left=-3
const DirectionalLightcamera=new THREE.CameraHelper(directionalLight.shadow.camera)
DirectionalLightcamera.visible=false
scene.add(DirectionalLightcamera)

const SpotLight=new THREE.SpotLight(0xffffff,0.4,10,Math.PI*0.2)

SpotLight.position.set(0,2,2)
gui.add(SpotLight, 'intensity').min(0).max(1).step(0.001).name("spotIntensity")
gui.add(SpotLight.position, 'x').min(- 5).max(5).step(0.001).name("spotx")
gui.add(SpotLight.position, 'y').min(- 5).max(5).step(0.001).name("spoty")
gui.add(SpotLight.position, 'z').min(- 5).max(5).step(0.001).name("spotz")
SpotLight.castShadow=true
SpotLight.shadow.mapSize.width=2048
SpotLight.shadow.mapSize.height=2048
SpotLight.shadow.camera.fov=45
SpotLight.shadow.camera.near=1
SpotLight.shadow.camera.far=6
SpotLight.shadow.camera.top=2
SpotLight.shadow.camera.bottom=-2
SpotLight.shadow.camera.right=3
SpotLight.shadow.camera.left=-3
scene.add(SpotLight)
scene.add(SpotLight.target)
const SpotLightHelper=new THREE.CameraHelper(SpotLight.shadow.camera)
SpotLightHelper.visible=false
scene.add(SpotLightHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow=true
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow=true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

/**
 * Sizes
 */
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled=true
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    sphere.position.x=Math.cos(elapsedTime)-0.5
    
    sphere.position.z=Math.sin(elapsedTime)-0.5
    sphere.position.y=Math.abs(Math.sin(elapsedTime))-0.1
    
    SpotLight.position.x=sphere.position.x
    SpotLight.position.z=sphere.position.z
    SpotLight.power=1-sphere.position.y
    directionalLight.position.x=sphere.position.x
    directionalLight.position.z=sphere.position.z
    directionalLight.intensity=(1-sphere.position.y)*0.3
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()