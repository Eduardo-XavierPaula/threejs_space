import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
	10,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

camera.position.z = 100;

const scene = new THREE.Scene();
let ship;
let mixer;
const loader = new GLTFLoader();
loader.load(
	"/assets/multi_universe_space_ship_3d_model.glb",
	function (gltf) {
		ship = gltf.scene;
		scene.add(ship);

		mixer = new THREE.AnimationMixer(ship);
		mixer.clipAction(gltf.animations[0]).play();
		modelMove();
	},
	function (xhr) {},
	function (error) {}
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
scene.add(ambientLight);

const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
	requestAnimationFrame(reRender3D);
	renderer.render(scene, camera);
	if (mixer) {
		mixer.update(0.02);
	}
};
reRender3D();

let arrPositionModel = [
	{
		id: "about",
		position: { x: 5, y: -1.5, z: 0 },
		rotation: { x: 0, y: -1.5, z: 0 },
	},
	{
		id: "nasa",
		position: { x: -5, y: -1, z: -10 },
		rotation: { x: 0.5, y: 0.5, z: 0 },
	},
	{
		id: "contact",
		position: { x: -1, y: -1, z: 15 },
		rotation: { x: 0, y: 0.5, z: 0 },
	},
	{
		id: "end",
		position: { x: 1, y: -1, z: 200 },
		rotation: { x: 0.3, y: -0.5, z: 0 },
	},
];
const modelMove = () => {
	const sections = document.querySelectorAll(".section");
	let currentSection;
	sections.forEach((section) => {
		const rect = section.getBoundingClientRect();
		if (rect.top <= window.innerHeight / 3) {
			currentSection = section.id;
		}
	});
	let position_active = arrPositionModel.findIndex(
		(val) => val.id == currentSection
	);
	if (position_active >= 0) {
		let new_coordinates = arrPositionModel[position_active];
		gsap.to(ship.position, {
			x: new_coordinates.position.x,
			y: new_coordinates.position.y,
			z: new_coordinates.position.z,
			duration: 3,
			ease: "power1.out",
		});
		gsap.to(ship.rotation, {
			x: new_coordinates.rotation.x,
			y: new_coordinates.rotation.y,
			z: new_coordinates.rotation.z,
			duration: 3,
			ease: "power1.out",
		});
	}
};
window.addEventListener("scroll", () => {
	if (ship) {
		modelMove();
	}
});

window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
});

//NASA APIs
async function getAstronomyPictureOfTheDay() {
	try {
		const response = await fetch(
			"https://api.nasa.gov/planetary/apod?api_key=mlE9qgQydaOF34WV2XFdyjpUY35zo9hqemF67svo"
		);

		const imageData = await response.json();
		return imageData;
	} catch (error) {
		console.log("Fetch error: ", error);
		return {};
	}
}
async function displayPictureOfTheDay() {
	const loadingElement = document.getElementById("loading");
	const errorElement = document.getElementById("error");
	const imgElement = document.getElementById("apodImage");
	const captionElement = document.getElementById("apodCaption");
	const explanationElement = document.getElementById("apodExplanation");

	// Exibe o esqueleto de carregamento
	loadingElement.style.display = "flex";

	const pictureOfTheDay = await getAstronomyPictureOfTheDay();

	// Oculta o carregamento
	loadingElement.style.display = "none";

	if (pictureOfTheDay.url) {
		imgElement.src = pictureOfTheDay.url;
		imgElement.alt = pictureOfTheDay.title;
		captionElement.innerText = pictureOfTheDay.title;
		explanationElement.innerText = pictureOfTheDay.explanation;
		imgElement.style.display = "block"; // Exibe a imagem
	} else {
		errorElement.style.display = "flex"; // Exibe a mensagem de erro
		captionElement.innerText =
			"Erro ao carregar a imagem. Tente novamente mais tarde.";
		explanationElement.innerText =
			"Erro ao carregar informações. Tente novamente mais tarde.";
	}
}

displayPictureOfTheDay();

document.getElementById("apod");
