//Create a Scene
const Scene=new THREE.Scene()

//Creating Object
const Geometry=new THREE.BoxGeometry(1,1.4,1)
const Material= new THREE.MeshBasicMaterial({color:"red"})
const Mesh=new THREE.Mesh(Geometry,Material)
Scene.add(Mesh)

//Creating the Camera
const Camera=new THREE.PerspectiveCamera(75,800/600)
Camera.position.z=3
Camera.position.x=-1
Camera.position.y=-1
Scene.add(Camera)

//Rendering the object
const canvas=document.querySelector("canvas.webgl")
const Renderer= new THREE.WebGLRenderer({
    canvas:canvas
})
Renderer.setSize(800,600)
Renderer.render(Scene,Camera)
