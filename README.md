# 3D To-Do List with Three.js

This project is a 3D to-do list application built with Three.js. It allows users to add tasks, display them in a 3D space, and interact with them using OrbitControls. Tasks can be deleted, and upon deletion, they animate to a person's head, drop to the floor, and explode into particles.

## Features

- **3D Task Input:** Users can add tasks using a text input.
- **3D Task Display:** Tasks are displayed as floating text above a floor.
- **Task Deletion Animation:** Deleted tasks move to a person's head, drop to the floor, and explode.
- **Task History:** A list of current tasks with options to delete them.
- **Orbit Controls:** Users can navigate the 3D space using OrbitControls.
- **Simple Person Model:** A basic 3D person model is included in the scene.

## Getting Started

### Prerequisites

To run this project, you need a modern web browser with JavaScript enabled.

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/3d-todo-list.git
    ```

2. Open the `index.html` file in your web browser:
    ```sh
    open index.html
    ```
   

### Usage

1. Enter a task in the input box and click "Add" to add a task.
2. The task will appear as 3D text floating above the floor.
3. To delete a task, click the "Delete" button next to the task in the history list.
4. The deleted task will animate to the person's head, drop to the floor, and explode into particles.

## Code Structure

- `index.html`: The main HTML file that includes the Three.js and other necessary scripts. (I included all code in one file, to keep it simple.)
  
- `app.js`: The main JavaScript file containing the Three.js scene setup and logic for adding, deleting, and animating tasks.
- `style.css`: (If needed) Contains styles for the input container and task history list.

### Key JavaScript Functions

- `addItem()`: Adds a new task to the scene.
- `deleteItem(id)`: Deletes a task and triggers the animation sequence.
- `createExplosion(position)`: Creates an explosion effect at the specified position.
- `updateHistory()`: Updates the task history list in the UI.
- `animate()`: The main animation loop for the Three.js scene.

## Dependencies

- [Three.js](https://threejs.org/): A JavaScript 3D library.
- [Tween.js](https://github.com/tweenjs/tween.js/): A JavaScript tweening library for smooth animations.
- [OrbitControls](https://threejs.org/examples/jsm/controls/OrbitControls.js): For navigating the 3D scene.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the GNU public License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Three.js and Tween.js communities for their awesome libraries.

---

Feel free to reach out if you have any questions or suggestions!
