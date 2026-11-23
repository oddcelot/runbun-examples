import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

const canvas = document.getElementById("scene") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(devicePixelRatio);

const scene = new Scene();
const camera = new PerspectiveCamera(60, 1, 0.1, 100);
camera.position.z = 3;

const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshStandardMaterial({ color: 0xf472b6 }),
);
scene.add(cube, new AmbientLight(0xffffff, 0.6));
const sun = new DirectionalLight(0xffffff, 2);
sun.position.set(2, 3, 4);
scene.add(sun);

function resize() {
  const { clientWidth: w, clientHeight: h } = canvas;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

renderer.setAnimationLoop((time) => {
  cube.rotation.x = time / 1500;
  cube.rotation.y = time / 1000;
  renderer.render(scene, camera);
});
