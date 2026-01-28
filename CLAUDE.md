# 3D House Viewer

Interactive 3D house model with draggable people and furniture, built with Three.js.

## Links

- **Live Site:** https://3d-house-bay.vercel.app
- **GitHub:** https://github.com/screendoorstudio/3d-house
- **Vercel Project:** https://vercel.com/screenteam/3d-house

## Technology Stack

- **Three.js r128** - 3D rendering (loaded from CDN)
- **Vanilla JavaScript** - No framework
- **Vercel** - Static hosting

## File Structure

```
3D model/
├── index.html      # Entry point, loads Three.js from CDN
├── style.css       # Full-screen canvas styling
├── main.js         # All Three.js scene logic
├── vercel.json     # Vercel deployment config
└── CLAUDE.md       # This file
```

## Architecture

### Scene Setup (main.js)

The scene uses a blueprint-style aesthetic:
- Light gray background (`0xF0F4F8`)
- Semi-transparent blue walls and roof
- Wireframe overlays for structure visibility
- Edge lines for clean blueprint look

### House Dimensions

```javascript
const houseWidth = 8;
const houseDepth = 6;
const floorHeight = 3;      // Height of each story
const totalHeight = 6;      // Two stories
const roofHeight = 2.5;
```

### Floor System

Two floor levels are defined:
```javascript
const GROUND_FLOOR = 0;
const SECOND_FLOOR = floorHeight;  // y = 3
```

Each draggable object tracks its floor:
```javascript
object.userData.floorLevel = GROUND_FLOOR;  // or SECOND_FLOOR
```

### Draggable Objects

All draggable items (people and furniture) follow this pattern:

```javascript
function createSomething() {
    const group = new THREE.Group();

    // Add meshes to group...

    // Required userData for drag system:
    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';  // or 'person'

    return group;
}
```

After creating, add to scene and register for dragging:
```javascript
const item = createSomething();
item.position.set(x, GROUND_FLOOR, z);
scene.add(item);
furniture.push(item);  // or people.push(item)
```

### Drag System

The drag system uses raycasting to detect clicks on objects:

1. **Mesh Registration:** All child meshes store a reference to their parent group:
   ```javascript
   child.userData.draggableGroup = parentGroup;
   ```

2. **Drag Planes:** Two horizontal planes for dragging:
   - `groundPlane` at y=0
   - `secondFloorPlane` at y=3

3. **Interactions:**
   - **Single click + drag:** Move object on its current floor
   - **Double-click:** Toggle object between floors

## Adding New Content

### Adding a New Person

```javascript
// In the PEOPLE section, add a new color:
const personColors = [0x3498db, 0xe74c3c, 0x2ecc71, 0x9b59b6, 0xf39c12, 0xNEWCOLOR];

// Add position:
const personPositions = [
    // ... existing positions
    { x: 5, z: 10 }  // New position
];
```

### Adding New Furniture

1. Create a function following the pattern:
```javascript
function createNewFurniture() {
    const group = new THREE.Group();

    // Build with BoxGeometry, CylinderGeometry, etc.
    const partGeom = new THREE.BoxGeometry(width, height, depth);
    const partMat = new THREE.MeshStandardMaterial({ color: 0xCOLOR });
    const part = new THREE.Mesh(partGeom, partMat);
    part.position.set(x, y, z);
    group.add(part);

    // Required:
    group.userData.isDraggable = true;
    group.userData.floorLevel = GROUND_FLOOR;
    group.userData.type = 'furniture';

    return group;
}
```

2. Instantiate and register:
```javascript
const newItem = createNewFurniture();
newItem.position.set(x, GROUND_FLOOR, z);
scene.add(newItem);
furniture.push(newItem);
```

3. **Important:** New furniture must be added BEFORE the drag controls section, so its meshes get registered in `draggableMeshes`.

### Existing Furniture Functions

- `createSofa()` - 3-cushion couch with arms
- `createTable()` - Rectangular table with 4 legs
- `createChair()` - Simple chair with back
- `createBed()` - Bed with frame, mattress, headboard, pillow
- `createBookshelf()` - Shelf unit with colored books
- `createDiningTable()` - Round pedestal table with tablecloth

## Materials Reference

```javascript
// Furniture
woodMaterial        // 0x8B4513 - Medium brown
darkWoodMaterial    // 0x5D3A1A - Dark brown
couchMaterial       // 0x4A6741 - Olive green
bedMaterial         // 0x6B8E9F - Blue-gray
tableclothMaterial  // 0xFFFAF0 - Off-white

// House
wallMaterial        // 0x4A90D9 - Blue, transparent
roofMaterial        // 0x1E40AF - Dark blue, transparent
doorMaterial        // 0x8B4513 - Brown
windowMaterial      // 0x60A5FA - Light blue, transparent
windowFrameMaterial // 0x1E3A8A - Navy
groundMaterial      // 0xE2E8F0 - Light gray
```

## Deployment

### Manual Deploy via API

The project deploys to Vercel using their API:

```bash
# From project directory
node -e "
const fs = require('fs');
const payload = {
  name: '3d-house',
  files: [
    { file: 'index.html', data: fs.readFileSync('index.html', 'utf8') },
    { file: 'style.css', data: fs.readFileSync('style.css', 'utf8') },
    { file: 'main.js', data: fs.readFileSync('main.js', 'utf8') }
  ],
  target: 'production'
};
console.log(JSON.stringify(payload));
" > /tmp/payload.json

curl -X POST \
  -H "Authorization: Bearer $VERCEL_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.vercel.com/v13/deployments" \
  -d @/tmp/payload.json
```

### Git Push

Code is also pushed to GitHub:
```bash
git add . && git commit -m "message" && git push
```

## Controls Summary

| Action | Result |
|--------|--------|
| Drag on empty space | Rotate camera |
| Scroll | Zoom in/out |
| Drag on person/furniture | Move on current floor |
| Double-click person/furniture | Move to other floor |

## Future Enhancement Ideas

- Add more room divisions (internal walls)
- Add stairs between floors
- Add more furniture types (TV, lamp, desk, etc.)
- Add outdoor elements (trees, car, fence)
- Add lighting fixtures that affect scene lighting
- Save/load room layouts
- Add rotation controls for furniture
