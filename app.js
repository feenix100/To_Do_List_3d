// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Set background color
renderer.setClearColor(0xf0f0f0); // Light gray color

document.body.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
floor.position.y = -10; // Position floor lower to be visible
scene.add(floor);

// Display area for tasks
const taskList = new THREE.Group();
scene.add(taskList);

// Task data array
let tasks = [];

// Load font for text
const loader = new THREE.FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.132.2/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    // Add item function
    window.addItem = function () {
        const input = document.getElementById('todo-input');
        const taskText = input.value;
        if (taskText) {
            const yOffset = tasks.length * 10; // Spacing between tasks
            const geometry = new THREE.TextGeometry(taskText, {
                font: font,
                size: 4, // Adjust size for better visibility
                height: 1,
                curveSegments: 12,
                bevelEnabled: true, // Add bevel for better appearance
                bevelThickness: 0.5,
                bevelSize: 0.25,
                bevelOffset: 0,
                bevelSegments: 5
            });
            const material = new THREE.MeshStandardMaterial({
                color: 0x3d85c6, // Text color 3d85c6    white 000000
                emissive: 0xb42929, // Light glow effect  b42929
                roughness: 0.4, // Slightly shiny
                metalness: 0.2 // Slightly metallic
            });
            const textMesh = new THREE.Mesh(geometry, material);
            textMesh.position.set(0, yOffset, 0);

            // Store task data
            const taskId = tasks.length;
            tasks.push({ id: taskId, text: taskText, mesh: textMesh });

            // Add to scene
            taskList.add(textMesh);

            // Update history list
            updateHistory();

            input.value = ''; // Clear input
        }
    };

    // Delete item function
    window.deleteItem = function (id) {
        // Remove task from task list
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            const task = tasks[taskIndex];
            
            // Move to human's head
            new TWEEN.Tween(task.mesh.position)
                .to({ x: -10, y: 5, z: 0 }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    // Drop down
                    new TWEEN.Tween(task.mesh.position)
                        .to({ y: 0 }, 1000)  // final position of text before explosion
                        .easing(TWEEN.Easing.Bounce.Out)
                        .onComplete(() => {
                            // Create explosion
                            createExplosion(task.mesh.position);
                            // Remove from scene
                            taskList.remove(task.mesh);
                            tasks.splice(taskIndex, 1);
                            // Update positions of remaining tasks
                            tasks.forEach((task, index) => {
                                task.mesh.position.setY(index * 10);
                            });
                            // Update history list
                            updateHistory();
                        })
                        .start();
                })
                .start();
        }
    };

    // Create explosion effect
    function createExplosion(position) {
        const explosionGroup = new THREE.Group();
        for (let i = 0; i < 100; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.2, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(position.x, position.y, position.z);
            explosionGroup.add(particle);

            const randomDirection = {
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 20
            };

            new TWEEN.Tween(particle.position)
                .to({ x: position.x + randomDirection.x, y: position.y + randomDirection.y, z: position.z + randomDirection.z }, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(() => {
                    explosionGroup.remove(particle);
                })
                .start();
        }
        scene.add(explosionGroup);

        // Remove explosion group after animation
        setTimeout(() => {
            scene.remove(explosionGroup);
        }, 1000);
    }

    // Update history list
    function updateHistory() {
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <span>${task.text}</span>
                <span class="delete-button" onclick="deleteItem(${task.id})">Delete</span>
            `;
            historyList.appendChild(taskItem);
        });
    }
});

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Add a simple person model
function addPerson() {
    const person = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(2, 4, 1);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 5, 0); // Adjusted position
    person.add(body);

    // Head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xFFC0CB });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 7.5, 0); // Adjusted position
    person.add(head);

    // Face (simple eyes and mouth)
    const eyeGeometry = new THREE.CircleGeometry(0.1, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.2, 0.95);
    head.add(leftEye);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.2, 0.95);
    head.add(rightEye);

    // Mouth
    const mouthGeometry = new THREE.PlaneGeometry(0.5, 0.1);
    const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.2, 0.95);
    head.add(mouth);

    // Left Arm
    const leftArmGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
    const leftArmMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftArm = new THREE.Mesh(leftArmGeometry, leftArmMaterial);
    leftArm.position.set(-1.5, 5.5, 0);
    person.add(leftArm);

    // Right Arm
    const rightArmGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
    const rightArmMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const rightArm = new THREE.Mesh(rightArmGeometry, rightArmMaterial);
    rightArm.position.set(1.5, 5.5, 0);
    person.add(rightArm);

    // Left Leg
    const leftLegGeometry = new THREE.BoxGeometry(0.5, 3.5, 0.5);
    const leftLegMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const leftLeg = new THREE.Mesh(leftLegGeometry, leftLegMaterial);
    leftLeg.position.set(-0.5, 2, 0);
    person.add(leftLeg);

    // Right Leg
    const rightLegGeometry = new THREE.BoxGeometry(0.5, 3.5, 0.5);
    const rightLegMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const rightLeg = new THREE.Mesh(rightLegGeometry, rightLegMaterial);
    rightLeg.position.set(0.5, 2, 0);
    person.add(rightLeg);

    // Add person to the scene
    scene.add(person);
    person.position.set(-10, -10, 0); // Adjust position as needed
}



addPerson();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    TWEEN.update(); // Update TWEEN animations
    renderer.render(scene, camera);
}

camera.position.set(0, 10, 50); // Adjusted to better view the scene
camera.lookAt(0, 0, 0); // Ensure camera is pointing at the center of the scene

animate();
