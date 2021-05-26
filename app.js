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

const flyingWindows = createFlyingWindows(40);
flyingWindows.forEach(flyingWindow => scene.add(flyingWindow));

camera.position.z = 2;

animate();
window.addEventListener('resize', onWindowResize, false);

function animate() {
  requestAnimationFrame(animate);
  camera.position.z -= 0.7;

  flyingWindows.forEach(flyingWindow => {
    if (camera.position.z < flyingWindow.position.z) {
      randomlyPositionFlyingWindow(flyingWindow, camera);
    }
  });

  renderer.render(scene, camera);
}

function createFlyingWindows(qty) {
  // width and height are based on the aspect of the Windows logo image
  const width = 1.235;
  const height = 1;
  // arbitrary depth to make it appear flat enough
  const depth = 0.01;

  const geometry = new THREE.BoxGeometry(width, height, depth);
  const flyingWindows = [];

  const windowImageMaterial = new THREE.MeshBasicMaterial({
    map: loader.load('window-filter.png'),
    transparent: true,
    side: THREE.FrontSide,
  });

  const blackMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: 1,
  });

  for (let i = 0; i < qty; i++) {
    const color = getRandomColor();

    // put color on both sides so transparent front can show color from inside box
    const colorMaterial = new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
    });

    const materials = [
      blackMaterial,
      blackMaterial,
      blackMaterial,
      blackMaterial,
      windowImageMaterial, // side facing camera
      colorMaterial,       // back inside facing camera
    ];

    const flyingWindow = new THREE.Mesh(geometry, materials);
    randomlyPositionFlyingWindow(flyingWindow, camera);

    flyingWindows.push(flyingWindow);
  }

  return flyingWindows;
}

function randomlyPositionFlyingWindow(flyingWindow, camera) {
  // use the camera's z position to determine where to place them on the z axis
  flyingWindow.position.z = camera.position.z - Math.floor(Math.random() * 50) - 100;
  const distance = Math.abs(camera.position.z - flyingWindow.position.z);

  // based on how far away the flyingWindow is, push its X and Y position
  // add a little bit at the end to keep it away from the center slightly
  flyingWindow.position.x = Math.floor(Math.random() * (distance / 3)) + 0.5;
  flyingWindow.position.y = Math.floor(Math.random() * (distance / 3)) + 0.5;

  if (Math.random() > 0.5) {
    flyingWindow.position.x *= -1;
  }

  if (Math.random() > 0.5) {
    flyingWindow.position.y *= -1;
  }

  // reset the color with each reset (and leave the face with the Windows logo alone)
  const color = getRandomColor();
  flyingWindow.material[0].color.setHex = color;
  flyingWindow.material[1].color.setHex = color;
  flyingWindow.material[2].color.setHex = color;
  flyingWindow.material[3].color.setHex = color;
  flyingWindow.material[5].color.setHex = color;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
