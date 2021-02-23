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
      resetFlyingWindow(flyingWindow, camera);
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
    side: THREE.FrontSide
  });

  for (let i = 0; i < qty; i++) {
    const color = getRandomColor();

    // put color on both sides so transparent front can show color from inside box
    const colorMaterial = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide,
    });

    const materials = [
      colorMaterial,
      colorMaterial,
      colorMaterial,
      colorMaterial,
      windowImageMaterial, // side facing camera
      colorMaterial,
    ];

    const flyingWindow = new THREE.Mesh(geometry, materials);

    // randomly position z away from camera
    flyingWindow.position.z = -1 * (Math.floor(Math.random() * 50) - 100);

    // based on how far away the flyingWindow is, push its X and Y position
    // add 0.7 at the end to keep it away from the Z axis slightly
    flyingWindow.position.x = Math.floor(Math.random() * 2 * Math.abs(flyingWindow.position.z)) + 0.7;
    flyingWindow.position.y = Math.floor(Math.random() * 2 * Math.abs(flyingWindow.position.z)) + 0.7;

    // randomly place it in one of the 4 quadrants
    if (Math.random() > 0.5) {
      flyingWindow.position.x *= -1;
    }

    if (Math.random() > 0.5) {
      flyingWindow.position.y *= -1;
    }

    flyingWindows.push(flyingWindow);
  }

  return flyingWindows;
}

function resetFlyingWindow(flyingWindow, camera) {
  // perform the same thing we did when we first set the flying windows, except this
  // time use the camera's z position to determine where to place them on the z axis
  flyingWindow.position.z = camera.position.z - Math.floor(Math.random() * 50) - 100;
  const distance = Math.abs(camera.position.z - flyingWindow.position.z);
  flyingWindow.position.x = Math.floor(Math.random() * (2 + distance / 2)) + 0.7;
  flyingWindow.position.y = Math.floor(Math.random() * (2 + distance / 2)) + 0.7;

  if (Math.random() > 0.5) {
    flyingWindow.position.x *= -1;
  }

  if (Math.random() > 0.5) {
    flyingWindow.position.y *= -1;
  }

  // reset the color with each reset
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
