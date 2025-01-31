import Card from "./Card.js";
import gsap from "gsap";
import loadImage from "./utils/loaders.js";
import { img_1, img_2, img_3 } from "./assets/images.js";
import { audio } from "./assets/audio.js";

// Simulate MRAID open function
let mraid = {
    open: function() {
        alert("Redirecting to the app store...");
        window.location.href = "https://apps.apple.com/us/app/clean-manager-storage-cleaner/id1579881271";
    }
};


/**
 * Check Webgl availability
 */
let gl = null; // Variable to store WebGL context
let webGLAvailable = false; // Flag to check if WebGL is available
const retryInterval = 5000; // Time in milliseconds to retry WebGL availability check

function checkWebGL() {
    try {
        const canvas = document.createElement('canvas');
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (gl && gl instanceof WebGLRenderingContext) {
            webGLAvailable = true;
            console.log("WebGL is available.");
            clearInterval(webGLCheckInterval); // Stop checking once WebGL is available
        } else {
            throw new Error("WebGL not available");
        }
    } catch (e) {
        console.warn("WebGL is not available. Retrying...");
    }
}

// Periodically check if WebGL becomes available
let webGLCheckInterval = setInterval(checkWebGL, retryInterval);

// Initial check
checkWebGL();

// Scene
let scene = new THREE.Scene();
scene.background = new THREE.Color('#4078FE')

// Camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

// Render
const canvas = document.querySelector('canvas.webgl');
let renderer = new THREE.WebGLRenderer({
    canvas:  canvas,
    antialias: true,
    powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Cards
let card1 = new Card(null).cardMesh;
loadImage(img_1.src, card1)

let card2 = new Card(null).cardMesh;
loadImage(img_2.src, card2)

let card3 = new Card(null).cardMesh;
loadImage(img_3.src, card3)

let card4 = new Card(null).cardMesh;
loadImage(img_2.src, card4)

let card5 = new Card(null).cardMesh;
loadImage(img_1.src, card5)

let card6 = new Card(null).cardMesh;
loadImage(img_1.src, card6)

let card7 = new Card(null).cardMesh;
loadImage(img_2.src, card7)

// Position cards side by side
card1.position.x = -5; // Left card
card2.position.x = 0;  // Center card
card3.position.x = 5;  // Right card
card4.position.x = -10; // Left card
card5.position.x = 10;  // Center card
card6.position.x = -15
card7.position.x = 15;  // Right card

const cardsGroup = new THREE.Group();
cardsGroup.add(card1, card2, card3, card4, card5, card6, card7);

// Add them to the array for raycasting
let cards = []
cardsGroup.children.forEach(child => {
    cards.push(child)
});

// Add cards to the scene
scene.add(cardsGroup)

/**
 * Sound Management
 */
console.info('audio', audio)
let sound = new Audio(audio.currentSrc);
let userInteracted = false;

// Enable sound once the user interacts with the document (for mobile and desktop)
function enableSound() {
    userInteracted = true;
    console.log('User interaction detected!');
}

// Wait for the first user interaction (works for mobile and desktop)
function waitForUserInteraction() {
    // Detect the first touch or click on the document
    canvas.addEventListener('touchstart', enableSound, { once: true });
    canvas.addEventListener('click', enableSound, { once: true });
    canvas.addEventListener('pointermove', enableSound, { once: true });
}

// Play sound if the user has interacted
function playSound() {
    if (!userInteracted) return; // Only proceed if user has interacted

    sound.currentTime = 0; // Rewind sound to the beginning
    sound.volume = 0.25 + Math.random() * 0.25
    sound.play(); // Await the sound to play (returns a promise)
}

/**
 * Swipe mechanics
 */
let swipeCount = 0;
let maxSwipes = 3;
let touchStartX = 0;
let touchEndX = 0;
let currentCardIndex = 1;  // Start at the center card
let previousPosition = 0;
let currentPosition = 0;
// Example swipe handling logic with sound playback
async function handleSwipe() {
    let swipeDistance = touchEndX - touchStartX;

    if (swipeCount < maxSwipes) {
        if (swipeDistance > 50 && currentCardIndex > -2) {
            currentCardIndex--;
        } else if (swipeDistance < -50 && currentCardIndex < 4) {
            currentCardIndex++;
        }

        previousPosition = camera.position.x
        gsap.to(camera.position, {
            x: (currentCardIndex - 1) * 5
        })
        currentPosition = (currentCardIndex - 1) * 5

        if(currentPosition !== previousPosition) {
            swipeCount++
            playSound()
        };
    }

    if (swipeCount >= maxSwipes) {
        showEndCard();
    }
}

// Start listening for user interaction
waitForUserInteraction();

document.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
}, false);

document.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
}, false);

// Show End Card with CTA
function showEndCard() {
    document.getElementById('endCard').style.display = 'flex';
    userInteracted = false
    gsap.to(".download", {
        scale: 1.25,
        duration: 1.,
        ease: "bounce.in",
        yoyo: true,
        repeat: -1
    })
}

// CTA Button action
document.getElementById('ctaBtn').addEventListener('click', function () {
    mraid.open();
});

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
// Adjust Three.js canvas on window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Raycast
 */
// Create Raycaster for intersection detection
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();  // Pointer for Raycaster

// Create a line from the camera to the object
let lineMaterial = new THREE.LineBasicMaterial({ color: 'red' });
let points = [
    new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z),  // From camera
    new THREE.Vector3(cardsGroup.position.x, cardsGroup.position.y, cardsGroup.position.z)       // To the object
];
let lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
let line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);
line.material.visible = false

// Make pointer at the center of the screen
pointer.x = 0;
pointer.y = 0;

/**
 * Animation
 */
const clock = new THREE.Clock()
let animate = function () {

    const elapsedTime = clock.getElapsedTime()
    raycaster.setFromCamera(pointer, camera);  // Ray originates from the camera

    let intersects = raycaster.intersectObjects(cards);  // Check if it intersects the plane
    cards.forEach(card => {
        if (intersects.find(intersect => intersect.object === card)) {
            // card.material.uniforms.uStep.value = 1;  // Change to red if intersected
            gsap.to(card.material.uniforms.uStep, {value:  1, duration: 0.5, ease: 'power1'});
            gsap.to(card.position, {
                z:  1.5,
                duration: 0.25,
                ease: 'power1.in'
            });

            card.material.uniforms.uFrequency.value = new THREE.Vector2(5, 1)
            card.material.uniforms.uTime.value = elapsedTime

        } else {
            gsap.to(card.material.uniforms.uStep, {value:  0.25, duration: 1.25, ease: 'power1'});
            card.position.z = 0

            card.material.uniforms.uFrequency.value = new THREE.Vector2(0, 0)
           
            gsap.to(card.material.uniforms.uTime, {value:  0, duration: 0.25, ease: 'power1'});
        }
    });

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();