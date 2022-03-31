import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

// Renders a Three.js scene with a ReadyPlayerMe avatar preview
export class AvatarPreview {
  constructor() {
    // WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping

    const targetMeshes = []

    async function init() {
      // Scene, Camera
      const scene = new THREE.Scene()
      scene.background = new THREE.Color("black")
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.set(0, 0, 3)

      // OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement)

      // Model
      const gltf = await loadGLTF("https://d1a370nemizbjq.cloudfront.net/b2572c50-a10a-42b6-ab30-694f60fed40f.glb")
      const avatar = gltf.scene
      const group = new THREE.Group()
      group.add(avatar)
      scene.add(group)
      avatar.position.set(0, -0.6, 0)
      group.scale.setScalar(5)

      targetMeshes.push(avatar.getObjectByName("Wolf3D_Head"), avatar.getObjectByName("Wolf3D_Teeth"))

      // HDRI
      const hdri = await loadHDRI(
        "https://rawcdn.githack.com/pmndrs/drei-assets/3792dd2e36bfa85c013a8f45d1082e9f34135276/hdri/lebombo_1k.hdr",
        renderer
      )
      scene.environment = hdri
      scene.background = hdri

      // Render loop
      const clock = new THREE.Clock()

      function render() {
        const dt = clock.getDelta()
        controls.update()

        renderer.render(scene, camera)
      }
      renderer.setAnimationLoop(render)

      // Window sizing
      window.addEventListener("resize", onWindowResize, false)
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()

        renderer.setSize(window.innerWidth, window.innerHeight)
      }
    }

    this.domElement = renderer.domElement

    this.applyBlendShapes = function (blendShapes) {
      for (let i = 0; i < this.targetMeshes.length; ++i) {
        const targetMesh = this.targetMeshes[i]
        for (let key in blendShapes) {
          targetMesh.morphTargetInfluences[targetMesh[morphTargetDictionary[key]]] = blendShapes[key]
        }
      }
    }

    init()
  }
}

export function loadGLTF(url, draco = false) {
  return new Promise((resolve) => {
    const loader = new GLTFLoader()
    loader.load(url, (gltf) => resolve(gltf))
  })
}

/**
 * @param {string} url - Path to equirectandular .hdr
 * @param {THREE.WebGLRenderer} renderer
 * @returns {Promise<THREE.Texture>}
 */
export function loadHDRI(url, renderer) {
  return new Promise((resolve) => {
    const loader = new RGBELoader()
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    loader.load(url, (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture
      texture.dispose()
      pmremGenerator.dispose()
      resolve(envMap)
    })
  })
}