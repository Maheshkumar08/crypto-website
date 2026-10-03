import * as THREE from 'three'

/**
 * Builds a subtle field of floating wireframe polyhedra for the hero background.
 * Returns an object with start()/destroy() lifecycle methods.
 */
export function createHeroScene(canvas) {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
  camera.position.set(0, 0, 9)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

  const group = new THREE.Group()
  scene.add(group)

  const palette = [0x2563eb, 0x3b82f6, 0x06b6d4, 0xcbd5e1]
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(0.9, 0),
    new THREE.TorusGeometry(0.7, 0.18, 8, 24),
    new THREE.TetrahedronGeometry(0.85, 0),
  ]

  const meshes = []
  const COUNT = 14

  for (let i = 0; i < COUNT; i++) {
    const geo = geometries[i % geometries.length]
    const color = palette[i % palette.length]
    const material = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.22 })
    const mesh = new THREE.Mesh(geo, material)

    const radius = 3.2 + Math.random() * 4.5
    const angle = Math.random() * Math.PI * 2
    const height = (Math.random() - 0.5) * 6

    mesh.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius - 2)
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)

    const scale = 0.5 + Math.random() * 0.9
    mesh.scale.setScalar(scale)

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.15,
      rotSpeedY: (Math.random() - 0.5) * 0.15,
      floatSpeed: 0.2 + Math.random() * 0.3,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
    }

    meshes.push(mesh)
    group.add(mesh)
  }

  const pointer = { x: 0, y: 0 }
  let frame
  let time = 0
  let destroyed = false

  function onPointerMove(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }

  function onResize() {
    const { clientWidth, clientHeight } = canvas
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(clientWidth, clientHeight, false)
  }

  function animate() {
    if (destroyed) return
    time += 0.008

    meshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotSpeedX * 0.01
      mesh.rotation.y += mesh.userData.rotSpeedY * 0.01
      mesh.position.y = mesh.userData.baseY + Math.sin(time * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 0.4
    })

    group.rotation.y += (pointer.x * 0.25 - group.rotation.y) * 0.02
    group.rotation.x += (pointer.y * 0.12 - group.rotation.x) * 0.02

    renderer.render(scene, camera)
    frame = requestAnimationFrame(animate)
  }

  function start() {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('resize', onResize)
    animate()
  }

  function destroy() {
    destroyed = true
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', onResize)
    geometries.forEach((g) => g.dispose())
    meshes.forEach((m) => m.material.dispose())
    renderer.dispose()
  }

  return { start, destroy }
}
