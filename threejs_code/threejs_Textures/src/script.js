import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//textures
const loadingManager=new THREE.LoadingManager()
loadingManager.onStart=()=>{
    console.log("starting")
}
loadingManager.onProgress=()=>{
    console.log("Progress")
}
loadingManager.onLoad=()=>{
    console.log("loaded")
}
loadingManager.onError=()=>{
    cosole.log("Error")
}
const textureloader=new THREE.TextureLoader(loadingManager)
const texture1=textureloader.load("/textures/minecraft.png")
const texture2=textureloader.load("/textures/door/alpha.jpg")
const texture3=textureloader.load("/textures/door/ambientOcclusion.jpg")
const texture4=textureloader.load("/textures/door/height.jpg")
const texture5=textureloader.load("/textures/door/metalness.jpg")
const texture6=textureloader.load("/textures/door/normal.jpg")
const texture7=textureloader.load("/textures/door/roughness.jpg")
texture1.center.x=0.5
texture1.center.y=0.5
texture1.magFilter=THREE.NearestFilter
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map:texture1})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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
camera.position.z = 1
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
    
    mesh.rotation.x=elapsedTime+Math.PI*9.25
    mesh.rotation.y=elapsedTime+Math.PI*9.25
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()