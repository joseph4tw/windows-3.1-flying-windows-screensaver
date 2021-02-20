const scene = new THREE.Scene();
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer();
const loader = new THREE.TextureLoader();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cubes = createCubes(40);
cubes.forEach(cube => scene.add(cube));

const light = createLight();
scene.add(light);

camera.position.z = 2;

function animate() {
  requestAnimationFrame(animate);
  camera.position.z -= 0.7;

  cubes.forEach(cube => {
    if (camera.position.z < cube.position.z) {
      resetCube(cube, camera);
    }
  });

  renderer.render(scene, camera);
}

animate();

function createCubes(qty) {
  const width = 1;
  const height = 1;
  const depth = 0.1;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const cubes = [];

  for (let i = 0; i < qty; i++) {
    const color = getRandomColor();
    const material = new THREE.MeshPhongMaterial({
      color,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = -1 //* (Math.floor(Math.random() * 50) - 100);
    cube.position.x = Math.floor(Math.random() * 2 * Math.abs(cube.position.z)) + 0.7;
    cube.position.y = Math.floor(Math.random() * 2 * Math.abs(cube.position.z)) + 0.7;

    if (Math.random() > 0.5) {
      cube.position.x *= -1;
    }

    if (Math.random() > 0.5) {
      cube.position.y *= -1;
    }

    cubes.push(cube);
  }

  return cubes;
}

function resetCube(cube, camera) {
  cube.position.z = camera.position.z - Math.floor(Math.random() * 30) - 50;
  const distance = Math.abs(camera.position.z - cube.position.z);
  cube.position.x = Math.floor(Math.random() * (2 + distance / 2)) + 0.5;
  cube.position.y = Math.floor(Math.random() * (2 + distance / 2)) + 0.5;

  if (Math.random() > 0.5) {
    cube.position.x *= -1;
  }

  if (Math.random() > 0.5) {
    cube.position.y *= -1;
  }

  const color = getRandomColor();
  cube.material.color.setHex = color;
}

function createLight() {
  const color = 0xFFFFFF;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  return light;
}
