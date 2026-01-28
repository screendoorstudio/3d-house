// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xF0F4F8); // Light blueprint background

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(15, 12, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 50;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Materials
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x4A90D9,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide
});
const wallWireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x2563EB,
    wireframe: true
});
const roofMaterial = new THREE.MeshStandardMaterial({
    color: 0x1E40AF,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
});
const roofWireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x1E3A8A,
    wireframe: true
});
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown doors
const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x60A5FA,
    transparent: true,
    opacity: 0.5
});
const windowFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x1E3A8A });
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xE2E8F0 }); // Light gray ground

// House dimensions
const houseWidth = 8;
const houseDepth = 6;
const floorHeight = 3;
const totalHeight = floorHeight * 2;

// Create house group
const house = new THREE.Group();

// Main walls (as a box)
const wallsGeometry = new THREE.BoxGeometry(houseWidth, totalHeight, houseDepth);
const walls = new THREE.Mesh(wallsGeometry, wallMaterial);
walls.position.y = totalHeight / 2;
house.add(walls);

// Wireframe overlay for walls
const wallsWireframe = new THREE.Mesh(wallsGeometry, wallWireframeMaterial);
wallsWireframe.position.y = totalHeight / 2;
house.add(wallsWireframe);

// Add edges for cleaner blueprint look
const wallEdgesGeometry = new THREE.EdgesGeometry(wallsGeometry);
const wallEdgesMaterial = new THREE.LineBasicMaterial({ color: 0x1E40AF, linewidth: 2 });
const wallEdges = new THREE.LineSegments(wallEdgesGeometry, wallEdgesMaterial);
wallEdges.position.y = totalHeight / 2;
house.add(wallEdges);

// Floor divider (between 1st and 2nd floor)
const floorGeometry = new THREE.PlaneGeometry(houseWidth - 0.1, houseDepth - 0.1);
const floorMaterial = new THREE.MeshBasicMaterial({
    color: 0x3B82F6,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
});
const floor2 = new THREE.Mesh(floorGeometry, floorMaterial);
floor2.rotation.x = Math.PI / 2;
floor2.position.y = floorHeight;
house.add(floor2);

// Roof
const roofHeight = 2.5;
const roofGeometry = new THREE.ConeGeometry(
    Math.sqrt((houseWidth / 2 + 0.5) ** 2 + (houseDepth / 2 + 0.5) ** 2),
    roofHeight,
    4
);
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = totalHeight + roofHeight / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Wireframe overlay for roof
const roofWireframe = new THREE.Mesh(roofGeometry, roofWireframeMaterial);
roofWireframe.position.y = totalHeight + roofHeight / 2;
roofWireframe.rotation.y = Math.PI / 4;
house.add(roofWireframe);

// Roof edges
const roofEdgesGeometry = new THREE.EdgesGeometry(roofGeometry);
const roofEdges = new THREE.LineSegments(roofEdgesGeometry, wallEdgesMaterial);
roofEdges.position.y = totalHeight + roofHeight / 2;
roofEdges.rotation.y = Math.PI / 4;
house.add(roofEdges);

// Helper function to create a window
function createWindow(width, height) {
    const group = new THREE.Group();

    // Window glass
    const glassGeometry = new THREE.PlaneGeometry(width - 0.1, height - 0.1);
    const glass = new THREE.Mesh(glassGeometry, windowMaterial);
    group.add(glass);

    // Window frame
    const frameThickness = 0.05;
    const frameDepth = 0.1;

    // Top frame
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width, frameThickness, frameDepth),
        windowFrameMaterial
    );
    topFrame.position.y = height / 2;
    group.add(topFrame);

    // Bottom frame
    const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width, frameThickness, frameDepth),
        windowFrameMaterial
    );
    bottomFrame.position.y = -height / 2;
    group.add(bottomFrame);

    // Left frame
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, height, frameDepth),
        windowFrameMaterial
    );
    leftFrame.position.x = -width / 2;
    group.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, height, frameDepth),
        windowFrameMaterial
    );
    rightFrame.position.x = width / 2;
    group.add(rightFrame);

    // Center cross
    const horizontalBar = new THREE.Mesh(
        new THREE.BoxGeometry(width, frameThickness * 0.8, frameDepth),
        windowFrameMaterial
    );
    group.add(horizontalBar);

    const verticalBar = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness * 0.8, height, frameDepth),
        windowFrameMaterial
    );
    group.add(verticalBar);

    return group;
}

// Helper function to create a door
function createDoor(width, height) {
    const group = new THREE.Group();

    // Door panel
    const doorGeometry = new THREE.PlaneGeometry(width, height);
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    group.add(door);

    // Door frame
    const frameThickness = 0.1;
    const frameDepth = 0.15;

    // Top frame
    const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, frameDepth),
        windowFrameMaterial
    );
    topFrame.position.y = height / 2;
    group.add(topFrame);

    // Left frame
    const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, height, frameDepth),
        windowFrameMaterial
    );
    leftFrame.position.x = -width / 2 - frameThickness / 2;
    group.add(leftFrame);

    // Right frame
    const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(frameThickness, height, frameDepth),
        windowFrameMaterial
    );
    rightFrame.position.x = width / 2 + frameThickness / 2;
    group.add(rightFrame);

    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.1);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(width / 2 - 0.3, 0, 0.1);
    group.add(handle);

    return group;
}

// Front door
const frontDoor = createDoor(1.2, 2.2);
frontDoor.position.set(0, 1.1, houseDepth / 2 + 0.01);
house.add(frontDoor);

// Back door
const backDoor = createDoor(1, 2);
backDoor.position.set(0, 1, -houseDepth / 2 - 0.01);
backDoor.rotation.y = Math.PI;
house.add(backDoor);

// Front windows - First floor
const frontWindow1 = createWindow(1.2, 1.2);
frontWindow1.position.set(-2.5, 1.8, houseDepth / 2 + 0.01);
house.add(frontWindow1);

const frontWindow2 = createWindow(1.2, 1.2);
frontWindow2.position.set(2.5, 1.8, houseDepth / 2 + 0.01);
house.add(frontWindow2);

// Front windows - Second floor
const frontWindow3 = createWindow(1.2, 1.2);
frontWindow3.position.set(-2.5, 4.8, houseDepth / 2 + 0.01);
house.add(frontWindow3);

const frontWindow4 = createWindow(1.2, 1.2);
frontWindow4.position.set(0, 4.8, houseDepth / 2 + 0.01);
house.add(frontWindow4);

const frontWindow5 = createWindow(1.2, 1.2);
frontWindow5.position.set(2.5, 4.8, houseDepth / 2 + 0.01);
house.add(frontWindow5);

// Left side windows
const leftWindow1 = createWindow(1.2, 1.2);
leftWindow1.position.set(-houseWidth / 2 - 0.01, 1.8, 0);
leftWindow1.rotation.y = -Math.PI / 2;
house.add(leftWindow1);

const leftWindow2 = createWindow(1.2, 1.2);
leftWindow2.position.set(-houseWidth / 2 - 0.01, 4.8, 0);
leftWindow2.rotation.y = -Math.PI / 2;
house.add(leftWindow2);

// Right side windows
const rightWindow1 = createWindow(1.2, 1.2);
rightWindow1.position.set(houseWidth / 2 + 0.01, 1.8, 0);
rightWindow1.rotation.y = Math.PI / 2;
house.add(rightWindow1);

const rightWindow2 = createWindow(1.2, 1.2);
rightWindow2.position.set(houseWidth / 2 + 0.01, 4.8, 0);
rightWindow2.rotation.y = Math.PI / 2;
house.add(rightWindow2);

// Back windows
const backWindow1 = createWindow(1.2, 1.2);
backWindow1.position.set(-2.5, 1.8, -houseDepth / 2 - 0.01);
backWindow1.rotation.y = Math.PI;
house.add(backWindow1);

const backWindow2 = createWindow(1.2, 1.2);
backWindow2.position.set(2.5, 1.8, -houseDepth / 2 - 0.01);
backWindow2.rotation.y = Math.PI;
house.add(backWindow2);

const backWindow3 = createWindow(1.2, 1.2);
backWindow3.position.set(-2.5, 4.8, -houseDepth / 2 - 0.01);
backWindow3.rotation.y = Math.PI;
house.add(backWindow3);

const backWindow4 = createWindow(1.2, 1.2);
backWindow4.position.set(2.5, 4.8, -houseDepth / 2 - 0.01);
backWindow4.rotation.y = Math.PI;
house.add(backWindow4);

scene.add(house);

// Ground
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === PEOPLE ===
const people = [];
const personColors = [0x3498db, 0xe74c3c, 0x2ecc71, 0x9b59b6, 0xf39c12];

function createPerson(color) {
    const group = new THREE.Group();

    // Body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.35, 1.2, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: color });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);

    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xFFDBAC });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.y = 1.65;
    head.castShadow = true;
    group.add(head);

    // Legs (two cylinders)
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.3, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.3, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);

    // Arms (two cylinders)
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);

    const leftArm = new THREE.Mesh(armGeometry, skinMaterial);
    leftArm.position.set(-0.4, 1.1, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, skinMaterial);
    rightArm.position.set(0.4, 1.1, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    group.add(rightArm);

    // Mark as draggable
    group.userData.isDraggable = true;

    return group;
}

// Create 5 people around the house
const personPositions = [
    { x: 6, z: 5 },
    { x: -6, z: 4 },
    { x: 7, z: -3 },
    { x: -5, z: -5 },
    { x: 0, z: 8 }
];

personPositions.forEach((pos, i) => {
    const person = createPerson(personColors[i]);
    person.position.set(pos.x, 0, pos.z);
    person.rotation.y = Math.random() * Math.PI * 2;
    scene.add(person);
    people.push(person);
});

// === DRAG CONTROLS ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const intersection = new THREE.Vector3();

let selectedPerson = null;
let isDragging = false;

// Collect all meshes from people for raycasting
const draggableMeshes = [];
people.forEach(person => {
    person.traverse(child => {
        if (child.isMesh) {
            child.userData.personGroup = person;
            draggableMeshes.push(child);
        }
    });
});

function getMousePosition(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onPointerDown(event) {
    getMousePosition(event);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(draggableMeshes, false);

    if (intersects.length > 0) {
        const personGroup = intersects[0].object.userData.personGroup;
        if (personGroup) {
            selectedPerson = personGroup;
            isDragging = true;
            controls.enabled = false;
            renderer.domElement.style.cursor = 'grabbing';
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

function onPointerMove(event) {
    getMousePosition(event);
    raycaster.setFromCamera(mouse, camera);

    if (isDragging && selectedPerson) {
        if (raycaster.ray.intersectPlane(plane, intersection)) {
            selectedPerson.position.x = intersection.x;
            selectedPerson.position.z = intersection.z;
        }
        event.preventDefault();
    } else {
        // Hover detection
        const intersects = raycaster.intersectObjects(draggableMeshes, false);
        renderer.domElement.style.cursor = intersects.length > 0 ? 'grab' : 'auto';
    }
}

function onPointerUp(event) {
    if (isDragging) {
        isDragging = false;
        selectedPerson = null;
        controls.enabled = true;
        renderer.domElement.style.cursor = 'auto';
    }
}

renderer.domElement.addEventListener('pointerdown', onPointerDown);
renderer.domElement.addEventListener('pointermove', onPointerMove);
renderer.domElement.addEventListener('pointerup', onPointerUp);
renderer.domElement.addEventListener('pointerleave', onPointerUp);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
