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

// Second floor (between 1st and 2nd floor)
const secondFloorGeometry = new THREE.PlaneGeometry(houseWidth - 0.2, houseDepth - 0.2);
const secondFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8B5A2B,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
});
const secondFloorMesh = new THREE.Mesh(secondFloorGeometry, secondFloorMaterial);
secondFloorMesh.rotation.x = -Math.PI / 2;
secondFloorMesh.position.y = floorHeight;
house.add(secondFloorMesh);

// Floor edge outline
const floorEdgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(houseWidth - 0.2, 0.05, houseDepth - 0.2));
const floorEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x5D3A1A });
const floorEdges = new THREE.LineSegments(floorEdgeGeometry, floorEdgeMaterial);
floorEdges.position.y = floorHeight;
house.add(floorEdges);

// Add a subtle grid pattern on the floor
const gridHelper = new THREE.GridHelper(Math.min(houseWidth, houseDepth) - 0.5, 6, 0x6B4423, 0x6B4423);
gridHelper.position.y = floorHeight + 0.01;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.3;
house.add(gridHelper);

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

// Floor levels
const GROUND_FLOOR = 0;
const SECOND_FLOOR = floorHeight;

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

    // Track floor level and draggable state
    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;

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
    person.position.set(pos.x, GROUND_FLOOR, pos.z);
    person.rotation.y = Math.random() * Math.PI * 2;
    scene.add(person);
    people.push(person);
});

// Function to move object to a floor
function moveObjectToFloor(obj, floorLevel) {
    obj.userData.floorLevel = floorLevel;
    obj.position.y = floorLevel;
}

// === FURNITURE ===
const furniture = [];

// Furniture materials
const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const darkWoodMaterial = new THREE.MeshStandardMaterial({ color: 0x5D3A1A });
const couchMaterial = new THREE.MeshStandardMaterial({ color: 0x4A6741 });
const bedMaterial = new THREE.MeshStandardMaterial({ color: 0x6B8E9F });
const tableclothMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFAF0 });

// Create a sofa
function createSofa() {
    const group = new THREE.Group();

    // Base
    const baseGeom = new THREE.BoxGeometry(2, 0.4, 0.8);
    const base = new THREE.Mesh(baseGeom, couchMaterial);
    base.position.y = 0.2;
    group.add(base);

    // Back
    const backGeom = new THREE.BoxGeometry(2, 0.6, 0.15);
    const back = new THREE.Mesh(backGeom, couchMaterial);
    back.position.set(0, 0.5, -0.33);
    group.add(back);

    // Arms
    const armGeom = new THREE.BoxGeometry(0.15, 0.5, 0.8);
    const leftArm = new THREE.Mesh(armGeom, couchMaterial);
    leftArm.position.set(-0.93, 0.35, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, couchMaterial);
    rightArm.position.set(0.93, 0.35, 0);
    group.add(rightArm);

    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';
    return group;
}

// Create a table
function createTable() {
    const group = new THREE.Group();

    // Tabletop
    const topGeom = new THREE.BoxGeometry(1.2, 0.08, 0.8);
    const top = new THREE.Mesh(topGeom, woodMaterial);
    top.position.y = 0.75;
    group.add(top);

    // Legs
    const legGeom = new THREE.BoxGeometry(0.08, 0.7, 0.08);
    const positions = [
        [-0.5, 0.35, -0.3],
        [0.5, 0.35, -0.3],
        [-0.5, 0.35, 0.3],
        [0.5, 0.35, 0.3]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeom, darkWoodMaterial);
        leg.position.set(...pos);
        group.add(leg);
    });

    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';
    return group;
}

// Create a chair
function createChair() {
    const group = new THREE.Group();

    // Seat
    const seatGeom = new THREE.BoxGeometry(0.5, 0.06, 0.5);
    const seat = new THREE.Mesh(seatGeom, woodMaterial);
    seat.position.y = 0.45;
    group.add(seat);

    // Back
    const backGeom = new THREE.BoxGeometry(0.5, 0.5, 0.06);
    const back = new THREE.Mesh(backGeom, woodMaterial);
    back.position.set(0, 0.73, -0.22);
    group.add(back);

    // Legs
    const legGeom = new THREE.BoxGeometry(0.05, 0.42, 0.05);
    const positions = [
        [-0.2, 0.21, -0.2],
        [0.2, 0.21, -0.2],
        [-0.2, 0.21, 0.2],
        [0.2, 0.21, 0.2]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeom, darkWoodMaterial);
        leg.position.set(...pos);
        group.add(leg);
    });

    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';
    return group;
}

// Create a bed
function createBed() {
    const group = new THREE.Group();

    // Frame
    const frameGeom = new THREE.BoxGeometry(1.8, 0.3, 2.2);
    const frame = new THREE.Mesh(frameGeom, darkWoodMaterial);
    frame.position.y = 0.15;
    group.add(frame);

    // Mattress
    const mattressGeom = new THREE.BoxGeometry(1.6, 0.2, 2);
    const mattress = new THREE.Mesh(mattressGeom, bedMaterial);
    mattress.position.y = 0.4;
    group.add(mattress);

    // Headboard
    const headboardGeom = new THREE.BoxGeometry(1.8, 0.8, 0.1);
    const headboard = new THREE.Mesh(headboardGeom, darkWoodMaterial);
    headboard.position.set(0, 0.55, -1.05);
    group.add(headboard);

    // Pillow
    const pillowGeom = new THREE.BoxGeometry(0.5, 0.12, 0.35);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xFFFFF0 });
    const pillow = new THREE.Mesh(pillowGeom, pillowMat);
    pillow.position.set(0, 0.56, -0.7);
    group.add(pillow);

    group.userData.isDraggable = true;
    group.userData.floorLevel = SECOND_FLOOR;
    group.userData.type = 'furniture';
    return group;
}

// Create a bookshelf
function createBookshelf() {
    const group = new THREE.Group();

    // Main frame
    const frameGeom = new THREE.BoxGeometry(1, 1.8, 0.3);
    const frame = new THREE.Mesh(frameGeom, woodMaterial);
    frame.position.y = 0.9;
    group.add(frame);

    // Shelves
    const shelfGeom = new THREE.BoxGeometry(0.9, 0.04, 0.28);
    [0.4, 0.8, 1.2, 1.6].forEach(y => {
        const shelf = new THREE.Mesh(shelfGeom, darkWoodMaterial);
        shelf.position.y = y;
        group.add(shelf);
    });

    // Some books
    const bookColors = [0xB22222, 0x228B22, 0x4169E1, 0xDAA520];
    bookColors.forEach((color, i) => {
        const bookGeom = new THREE.BoxGeometry(0.15, 0.25, 0.2);
        const bookMat = new THREE.MeshStandardMaterial({ color });
        const book = new THREE.Mesh(bookGeom, bookMat);
        book.position.set(-0.3 + i * 0.2, 0.52, 0);
        group.add(book);
    });

    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';
    return group;
}

// Create dining table with cloth
function createDiningTable() {
    const group = new THREE.Group();

    // Tabletop
    const topGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 16);
    const top = new THREE.Mesh(topGeom, woodMaterial);
    top.position.y = 0.75;
    group.add(top);

    // Tablecloth hint
    const clothGeom = new THREE.CylinderGeometry(0.72, 0.75, 0.02, 16);
    const cloth = new THREE.Mesh(clothGeom, tableclothMaterial);
    cloth.position.y = 0.79;
    group.add(cloth);

    // Center pedestal
    const pedestalGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.65, 8);
    const pedestal = new THREE.Mesh(pedestalGeom, darkWoodMaterial);
    pedestal.position.y = 0.38;
    group.add(pedestal);

    // Base
    const baseGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.06, 16);
    const base = new THREE.Mesh(baseGeom, darkWoodMaterial);
    base.position.y = 0.03;
    group.add(base);

    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';
    return group;
}

// Place furniture in the house
// Ground floor
const sofa = createSofa();
sofa.position.set(-2, GROUND_FLOOR, 0);
sofa.rotation.y = Math.PI / 2;
scene.add(sofa);
furniture.push(sofa);

const table = createTable();
table.position.set(2, GROUND_FLOOR, 1);
scene.add(table);
furniture.push(table);

const chair1 = createChair();
chair1.position.set(2, GROUND_FLOOR, 0.2);
scene.add(chair1);
furniture.push(chair1);

const chair2 = createChair();
chair2.position.set(2, GROUND_FLOOR, 1.8);
chair2.rotation.y = Math.PI;
scene.add(chair2);
furniture.push(chair2);

const bookshelf = createBookshelf();
bookshelf.position.set(2.5, GROUND_FLOOR, -1.5);
scene.add(bookshelf);
furniture.push(bookshelf);

const diningTable = createDiningTable();
diningTable.position.set(-1.5, GROUND_FLOOR, 1.5);
scene.add(diningTable);
furniture.push(diningTable);

// Second floor
const bed = createBed();
bed.position.set(0, SECOND_FLOOR, -1);
scene.add(bed);
furniture.push(bed);

const bedsideTable = createTable();
bedsideTable.position.set(2, SECOND_FLOOR, -1);
bedsideTable.scale.set(0.6, 0.7, 0.6);
moveObjectToFloor(bedsideTable, SECOND_FLOOR);
scene.add(bedsideTable);
furniture.push(bedsideTable);

const chair3 = createChair();
chair3.position.set(-2, SECOND_FLOOR, 1);
moveObjectToFloor(chair3, SECOND_FLOOR);
scene.add(chair3);
furniture.push(chair3);

// === DRAG CONTROLS ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const secondFloorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -SECOND_FLOOR);
const intersection = new THREE.Vector3();

let selectedObject = null;
let isDragging = false;
let currentDragPlane = groundPlane;
let lastClickTime = 0;

// Collect all meshes from people and furniture for raycasting
const draggableMeshes = [];

// Add people meshes
people.forEach(obj => {
    obj.traverse(child => {
        if (child.isMesh) {
            child.userData.draggableGroup = obj;
            draggableMeshes.push(child);
        }
    });
});

// Add furniture meshes
furniture.forEach(obj => {
    obj.traverse(child => {
        if (child.isMesh) {
            child.userData.draggableGroup = obj;
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
        const draggableGroup = intersects[0].object.userData.draggableGroup;
        if (draggableGroup) {
            const now = Date.now();

            // Check for double-click (within 300ms)
            if (now - lastClickTime < 300 && selectedObject === null) {
                // Double-click: toggle floor
                const currentFloor = draggableGroup.userData.floorLevel;
                const newFloor = currentFloor === GROUND_FLOOR ? SECOND_FLOOR : GROUND_FLOOR;
                moveObjectToFloor(draggableGroup, newFloor);
                lastClickTime = 0;
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            lastClickTime = now;
            selectedObject = draggableGroup;
            isDragging = true;
            controls.enabled = false;

            // Set drag plane based on object's current floor
            currentDragPlane = draggableGroup.userData.floorLevel === GROUND_FLOOR
                ? groundPlane
                : secondFloorPlane;

            renderer.domElement.style.cursor = 'grabbing';
            event.preventDefault();
            event.stopPropagation();
        }
    }
}

function onPointerMove(event) {
    getMousePosition(event);
    raycaster.setFromCamera(mouse, camera);

    if (isDragging && selectedObject) {
        if (raycaster.ray.intersectPlane(currentDragPlane, intersection)) {
            selectedObject.position.x = intersection.x;
            selectedObject.position.z = intersection.z;
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
        selectedObject = null;
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
