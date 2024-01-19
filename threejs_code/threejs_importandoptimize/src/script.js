import GUI from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertexShader from "./shaders/firefly/vertex.glsl"
import fragmentShader from "./shaders/firefly/fragments.glsl"
import vertexShaderP from "./shaders/portal/vertex.glsl"
import fragmentShaderP from "./shaders/portal/fragments.glsl"
/**
 * Base
 */
// Debug
const debug = {}
const gui = new GUI({
    width: 400
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const texture = textureLoader.load("baked.jpg")
texture.flipY = false
texture.colorSpace = THREE.SRGBColorSpace
const material = new THREE.MeshBasicMaterial({ map: texture })
const material1 = new THREE.MeshBasicMaterial({ color: 'hsva(0.050,0.986,1,1)' })
const material2 = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: new THREE.Color(0xff0000) },
        uColorEnd: { value: new THREE.Color(0xffff00) },
    },
    vertexShader: vertexShaderP,
    fragmentShader: fragmentShaderP,
})
gui.addColor(material2.uniforms.uColorStart, "value").name("Start-Color")
gui.addColor(material2.uniforms.uColorEnd, "value").name("End-Color")
gltfLoader.load('threejs1.glb', (portal) => {
    portal.scene.traverse((child) => {
        child.material = material
    })
    const poleLightA = portal.scene.children.find((child) => child.name === 'poleLightA')
    const poleLightB = portal.scene.children.find((child) => child.name === 'poleLightB')
    const portalLight = portal.scene.children.find((child) => child.name === 'portalLight')
    poleLightA.material = material1

    poleLightB.material = material1
    portalLight.material = material2
    scene.add(portal.scene)
})
const fireflygeo = new THREE.BufferGeometry()
const fireflycount = 30
const positionfirefly = new Float32Array(fireflycount * 3)
const sizefirefly = new Float32Array(fireflycount)

for (let i = 0; i < fireflycount; i++) {
    positionfirefly[i * 3 + 0] = (Math.random() - 0.5) * 4
    positionfirefly[i * 3 + 1] = (Math.random() + 1.1)
    positionfirefly[i * 3 + 2] = (Math.random() - 0.5) * 4
    sizefirefly[i] = Math.random()
}
fireflygeo.setAttribute('position', new THREE.BufferAttribute(positionfirefly, 3))
fireflygeo.setAttribute('aSize', new THREE.BufferAttribute(sizefirefly, 1))
const fireflyMat = new THREE.ShaderMaterial({
    uniforms: {
        uPixelRatio: Math.min(window.devicePixelRatio, 2),
        uSize: { value: 100 },
        uTime: { value: 0 }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
})

const firefly = new THREE.Points(fireflygeo, fireflyMat)
scene.add(firefly)

gui.add(fireflyMat.uniforms.uSize, 'value').min(1).max(500).step(1).name("fireflysize")
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    fireflyMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 4
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debug.clearcolor = "272626"
renderer.setClearColor(debug.clearcolor)
gui
    .addColor(debug, "clearcolor")
    .onChange((value) => {
        renderer.setClearColor(value)
    })
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    fireflyMat.uniforms.uTime.value = elapsedTime
    material2.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()