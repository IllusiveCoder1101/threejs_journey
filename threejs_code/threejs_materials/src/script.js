import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from "lil-gui"
import { DataTexture3D } from 'three'
//textures
const cubeLoader=new THREE.CubeTextureLoader()
const textureloader=new THREE.TextureLoader()
const texture=textureloader.load("/textures/door/color.jpg")
const texture2=textureloader.load("/textures/door/ambientOcclusion.jpg")
const texture3=textureloader.load("/textures/door/roughness.jpg")
const texture4=textureloader.load("/textures/door/metalness.jpg")
const enviornment= cubeLoader.load([
    "/textures/environmentMaps/3/px.jpg",
    "/textures/environmentMaps/3/nx.jpg",
    "/textures/environmentMaps/3/py.jpg",
    "/textures/environmentMaps/3/ny.jpg",
    "/textures/environmentMaps/3/pz.jpg",
    "/textures/environmentMaps/3/nz.jpg"

])
//gui
const gui=new lil.GUI()
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//Mesh&Geometry
const material=new THREE.MeshStandardMaterial()
material.roughness=0.05
material.metalness=0.94
material.envMap=enviornment
material.envMapIntensity=0.6
const box=new THREE.BoxGeometry(1,1,1)
const mesh=new THREE.Mesh(box,material)
mesh.geometry.setAttribute("uv2",new THREE.BufferAttribute(mesh.geometry.attributes.uv.array,2))
const sphere=new THREE.SphereGeometry(0.5,16,16)
const mesh2=new THREE.Mesh(sphere,material)
mesh2.geometry.setAttribute("uv2",new THREE.BufferAttribute(mesh2.geometry.attributes.uv.array,2))
mesh2.position.x=-1.5
const torus=new THREE.TorusGeometry(0.3, 0.2, 16, 32)

const mesh3=new THREE.Mesh(torus,material)

mesh3.position.x=1.5
mesh3.geometry.setAttribute("uv2",new THREE.BufferAttribute(mesh3.geometry.attributes.uv.array,2))
scene.add(mesh)
scene.add(mesh2)
scene.add(mesh3)
gui.addColor(material,"color")
gui.add(material,"aoMapIntensity").min(-3).max(3).step(0.01)
gui.add(material,"roughness").min(-3).max(3).step(0.01)
gui.add(material,"metalness").min(-3).max(3).step(0.01)
gui.add(material,"displacementScale").min(0).max(1).step(0.0001)
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
//light
const ambient=new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambient)

const point=new THREE.PointLight(0xffffff,0.5)
point.position.x=2
point.position.y=3
point.position.z=4
scene.add(point)
gui.add(ambient,"intensity").min(-3).max(3).step(0.01)
gui.addColor(ambient,"color")
gui.add(point,"intensity").min(-3).max(3).step(0.01)
gui.addColor(point,"color")
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()
    mesh.rotation.x=0.15*elapsedTime 
    mesh.rotation.y=0.15*elapsedTime 
    mesh.rotation.z=0.15*elapsedTime 

    mesh2.rotation.x=0.15*elapsedTime
    mesh2.rotation.y=0.15*elapsedTime 
    mesh2.rotation.z=0.15*elapsedTime 

    mesh3.rotation.x=0.15*elapsedTime 
    mesh3.rotation.y=0.15*elapsedTime 
    mesh3.rotation.z=0.15*elapsedTime 
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()