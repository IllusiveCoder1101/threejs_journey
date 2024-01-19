import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>{
        material.color.set(parameters.materialColor)
        PointsMaterial.color.set(parameters.materialColor)
    })
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const group=new THREE.Group()
scene.add(group)
//texture
const textureLoader=new THREE.TextureLoader()
const texture1=textureLoader.load("/textures/gradients/3.jpg")
texture1.magFilter=THREE.NearestFilter
//Objects
const distance=4
const material=new THREE.MeshToonMaterial({color:parameters.materialColor,gradientMap:texture1,transparent:true})
const mesh1=new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)
const mesh2=new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)

const mesh3=new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)
mesh1.position.y=-distance*0
mesh1.position.x=2
mesh2.position.y=-distance*1
mesh2.position.x=-2
mesh3.position.y=-distance*2
mesh3.position.x=2
scene.add(mesh1,mesh2,mesh3)

//particles
const count=20000
const positions=new Float32Array(count*3)

for(let i=0;i<count;i++){
    positions[i*3]=(Math.random()-0.5)*10
    positions[i*3+1]=(Math.random()-0.5)*20
    positions[i*3+2]=(Math.random()-0.5)*10
}
const PointsGeometry=new THREE.BufferGeometry()
PointsGeometry.setAttribute("position",new THREE.BufferAttribute(positions,3))
const PointsMaterial=new THREE.PointsMaterial({
    color:parameters.materialColor,
    size:0.03,
    sizeAttenuation:true
})
const Points=new THREE.Points(PointsGeometry,PointsMaterial)
scene.add(Points)
//lights
const directionalLight=new THREE.DirectionalLight("#ffffff",0.5)
scene.add(directionalLight)
gui.add(directionalLight,"intensity").min(0.1).max(1).step(0.01)
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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
group.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//scroll
let scrollY=window.scrollY
let current=0
window.addEventListener("scroll",()=>{
    scrollY=window.scrollY
    const currentPosition=Math.floor(scrollY/sizes.height)
    if(currentPosition===0)
        current=0
    else if(currentPosition===1)
        current=1
    else
        current=2
})
let cursor=new THREE.Vector2()
window.addEventListener("mousemove",(event)=>{
    cursor.x=event.clientX/window.innerWidth-0.5
    cursor.y=event.clientY/window.innerHeight-0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previous=0
const tick = () =>
{
    
    
    
    const elapsedTime = clock.getElapsedTime()
    const delta=elapsedTime-previous
    previous=elapsedTime
    camera.position.y=-scrollY/sizes.height * distance
    group.position.x+=((cursor.x-group.position.x)*5*delta)*0.5
    group.position.y+=((cursor.y-group.position.y)*5*delta)*0.5
    if(current===1)
        mesh1.rotation.x=Math.PI*2
    else if(current===2)
        mesh2.rotation.x=Math.PI*2
    else if(current===3)
        mesh3.rotation.x=Math.PI*2
    mesh1.rotation.x=(elapsedTime*0.1)
    mesh1.rotation.y=(elapsedTime*0.1)
    mesh1.rotation.z=(elapsedTime*0.1)

    mesh2.rotation.x=(elapsedTime*0.1)
    mesh2.rotation.y=(elapsedTime*0.1)
    mesh2.rotation.z=(elapsedTime*0.1)

    mesh3.rotation.x=(elapsedTime*0.1)
    mesh3.rotation.y=(elapsedTime*0.1)
    mesh3.rotation.z=(elapsedTime*0.1)
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()