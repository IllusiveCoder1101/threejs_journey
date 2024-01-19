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
const fog=new THREE.Fog("#262837",1,15)
scene.fog=fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const door_alpha=textureLoader.load("/textures/door/alpha.jpg")
const door_color=textureLoader.load("/textures/door/color.jpg")
const door_metalness=textureLoader.load("/textures/door/metalness.jpg")
const door_roughness=textureLoader.load("/textures/door/roughness.jpg")
const door_ambient=textureLoader.load("/textures/door/ambientOcclusion.jpg")
const door_normal=textureLoader.load("/textures/door/normal.jpg")
const door_height=textureLoader.load("/textures/door/height.jpg")
const brick_color=textureLoader.load("/textures/bricks/color.jpg")
const brick_roughness=textureLoader.load("/textures/bricks/roughness.jpg")
const brick_ambient=textureLoader.load("/textures/bricks/ambientOcclusion.jpg")
const brick_normal=textureLoader.load("/textures/bricks/normal.jpg")
const grass_color=textureLoader.load("/textures/grass/color.jpg")
const grass_roughness=textureLoader.load("/textures/grass/roughness.jpg")
const grass_ambient=textureLoader.load("/textures/grass/ambientOcclusion.jpg")
const grass_normal=textureLoader.load("/textures/grass/normal.jpg")
grass_color.repeat.set(8,8)
grass_roughness.repeat.set(8,8)
grass_ambient.repeat.set(8,8)
grass_normal.repeat.set(8,8)
grass_color.wrapS=THREE.RepeatWrapping
grass_roughness.wrapS=THREE.RepeatWrapping
grass_ambient.wrapS=THREE.RepeatWrapping
grass_normal.wrapS=THREE.RepeatWrapping

grass_color.wrapT=THREE.RepeatWrapping
grass_roughness.wrapT=THREE.RepeatWrapping
grass_ambient.wrapT=THREE.RepeatWrapping
grass_normal.wrapT=THREE.RepeatWrapping
/**
 * House
 */
const House=new THREE.Group()
scene.add(House)

const walls=new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({map:brick_color,roughnessMap:brick_roughness,aoMap:brick_ambient,transparent:true
    ,normalMap:brick_normal})
)
walls.geometry.setAttribute("uv2",
 new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array,2))
 walls.castShadow=true
walls.position.y=1.25
House.add(walls)
const roof=new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({map:brick_color,roughnessMap:brick_roughness,aoMap:brick_ambient,transparent:true
        ,normalMap:brick_normal})
)
roof.position.y=3
roof.rotation.y=Math.PI/4
House.add(roof)

const door=new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshStandardMaterial({map:door_color,alphaMap:door_alpha,transparent:true,metalnessMap:door_metalness
    ,roughnessMap:door_roughness,normalMap:door_normal,aoMap:door_ambient,displacementScale:0.1,displacementMap:door_height})
)
door.geometry.setAttribute("uv2",
 new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2))
door.position.y=1
door.position.z=2.01
House.add(door)

const windows=new THREE.Mesh(
    new THREE.PlaneGeometry(2,1),
    new THREE.MeshBasicMaterial({color:"#aa7b7b"})
)
windows.position.y=1.4
windows.position.x=2.01
windows.rotation.y=Math.PI/2
House.add(windows)
const bushes=new THREE.SphereGeometry(1,16,16)
const bushesMaterial=  new THREE.MeshBasicMaterial({color:"#89c854"})
const bush1=new THREE.Mesh(
    bushes,bushesMaterial
)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2=new THREE.Mesh(
    bushes,bushesMaterial
)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3=new THREE.Mesh(
    bushes,bushesMaterial
)
bush1.castShadow=true
bush2.castShadow=true
bush3.castShadow=true
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(- 0.8, 0.1, 2.2)
House.add(bush1,bush2,bush3)

//graves
let i=0;
const graves=new THREE.Group()
scene.add(graves)
const gravesGeometry=new THREE.BoxGeometry(0.6,0.8,0.2)
const gravesMaterial=new THREE.MeshBasicMaterial({color:"#b2b6b1"})
for(i=0;i<50;i++){
    const angle=Math.random()*Math.PI*2
    const radius=3+Math.random()*6
    const x=Math.cos(angle) * radius
    const z=Math.sin(angle) * radius
    const grave=new THREE.Mesh(gravesGeometry,gravesMaterial)
    grave.position.set(x,0.3,z)
    grave.rotation.y=(Math.random()-0.5)*0.4
    grave.rotation.z=(Math.random()-0.5)*0.4
    grave.castShadow=true
    graves.add(grave)
}
// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map:grass_color,aoMap:grass_ambient,normalMap:grass_normal,roughnessMap:grass_roughness,
    transparent:true})
)
floor.geometry.setAttribute("uv2",
 new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array,2))
 floor.receiveShadow=true
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
ambientLight.castShadow=true
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
gui.addColor(ambientLight,"color")
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
moonLight.castShadow=true
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const houseLight=new THREE.PointLight("#ff7d46",1,7)
houseLight.position.set(0,2.2,2.7)
houseLight.castShadow=true
House.add(houseLight)

//ghosts
const ghost1=new THREE.PointLight('#ff00ff',2,3)
ghost1.castShadow=true
const ghost2=new THREE.PointLight('#00ffff',2,3)
ghost2.castShadow=true
const ghost3=new THREE.PointLight('#ffff00',2,3)
ghost3.castShadow=true
scene.add(ghost1,ghost2,ghost3)

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15

// ...

houseLight.shadow.mapSize.width = 256
houseLight.shadow.mapSize.height = 256
houseLight.shadow.camera.far = 7

// ...

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

// ...

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

// ...

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

// ...


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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setClearColor('#262837')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled=true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const angle1=elapsedTime*0.5
    const angle2=elapsedTime*0.35
    const angle3=elapsedTime*0.18
    const x1=Math.cos(angle1)*4
    const y1=Math.sin(angle1*3)
    const z1=Math.sin(angle1)*4
    const x2=Math.cos(angle2)*5
    const y2=Math.sin(angle2*4)+Math.sin(elapsedTime*2.5)
    const z2=Math.sin(angle2)*5
    const x3=Math.cos(angle3)*(7 + Math.sin(elapsedTime * 0.32))
    const y3=Math.sin(angle3*4)*Math.sin(elapsedTime * 2.5)
    const z3=Math.sin(angle3)*(7 + Math.sin(elapsedTime * 0.5))
    ghost1.position.set(x1,y1,z1)
    ghost2.position.set(x2,y2,z2)
    ghost3.position.set(x3,z3,z3)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()