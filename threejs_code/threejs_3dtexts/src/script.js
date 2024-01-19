import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader"
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry"
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const texture= textureLoader.load("/textures/matcaps/8.png")
//fonts
const fontLoader= new FontLoader()
fontLoader.load(
    "/fonts/optimer_regular.typeface.json",
    (font)=>{
        const textGeometry= new TextGeometry(
            'Hello World',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()
        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.flatShading=true;
        textMaterial.matcap=texture
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        let i=0;
        const donuts=new THREE.TorusGeometry(0.5,0.2,20,45)
        const donutMaterial=new THREE.MeshMatcapMaterial()
        donutMaterial.matcap=texture
        for (i=0;i<1000;i++){
           
            const meshDonuts=new THREE.Mesh(donuts, donutMaterial)
            meshDonuts.position.x=(Math.random()-0.5)*40
            meshDonuts.position.y=(Math.random()-0.5)*40
            meshDonuts.position.z=(Math.random()-0.5)*40

            meshDonuts.rotation.x=(Math.random()-0.5)*Math.PI+0.02
            meshDonuts.rotation.y=(Math.random()-0.5)*Math.PI+0.02
            meshDonuts.rotation.z=(Math.random()-0.5)*Math.PI+0.02
            
            meshDonuts.scale.x=(Math.random()-0.5)*3
            meshDonuts.scale.y=(Math.random()-0.5)*3
            meshDonuts.scale.z=(Math.random()-0.5)*3
            scene.add(meshDonuts)
        }
    }
)
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