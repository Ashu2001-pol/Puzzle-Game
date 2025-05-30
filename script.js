const puzzleContainer = document.getElementById("puzzleContainer");
const moveCounter = document.getElementById("moveCounter");
const imageInput = document.getElementById("imageInput");
const difficultySelect = document.getElementById("difficultySelect");

let moveCount = 0;
let imageURL = "";
let gridSize = 3;

// Enable image input only after difficulty is selected
difficultySelect.addEventListener("change", () => {
  const value = difficultySelect.value;
  if (value) {
    imageInput.disabled = false;
    gridSize = parseInt(value);
  } else {
    imageInput.disabled = true;
  }
});

imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file || !gridSize) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    imageURL = e.target.result;
    startGame(imageURL, gridSize);
  };
  reader.readAsDataURL(file);
});

function startGame(imgUrl, size) {
  moveCount = 0;
  moveCounter.textContent = moveCount;
  puzzleContainer.innerHTML = "";
  puzzleContainer.style.gridTemplateColumns = `repeat(${size}, 100px)`;
  puzzleContainer.style.gridTemplateRows = `repeat(${size}, 100px)`;

  const totalTiles = size * size;
  const order = [...Array(totalTiles).keys()];
  order.sort(() => Math.random() - 0.5); // shuffle

  for (let i = 0; i < totalTiles; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.draggable = true;
    tile.style.width = "100px";
    tile.style.height = "100px";

    const row = Math.floor(order[i] / size);
    const col = order[i] % size;

    tile.style.backgroundImage = `url('${imgUrl}')`;
    tile.style.backgroundPosition = `${-(col * 100)}px ${-(row * 100)}px`;
    tile.style.backgroundSize = `${100 * size}px ${100 * size}px`;

    tile.dataset.index = order[i];

    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("drop", drop);

    puzzleContainer.appendChild(tile);
  }
}

let draggedTile = null;

function dragStart(e) {
  draggedTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  const targetTile = this;

  if (draggedTile !== targetTile) {
    const draggedIndex = [...puzzleContainer.children].indexOf(draggedTile);
    const targetIndex = [...puzzleContainer.children].indexOf(targetTile);

    puzzleContainer.insertBefore(draggedTile, puzzleContainer.children[targetIndex]);
    puzzleContainer.insertBefore(targetTile, puzzleContainer.children[draggedIndex]);

    moveCount++;
    moveCounter.textContent = moveCount;

    checkSolved();
  }
}

function checkSolved() {
  const currentOrder = [...puzzleContainer.children].map(tile => parseInt(tile.dataset.index));
  const isSolved = currentOrder.every((val, idx) => val === idx);

  if (isSolved) {
    setTimeout(() => {
      alert(`🎉 Puzzle Solved in ${moveCount} moves!`);
      puzzleContainer.innerHTML = "";
      puzzleContainer.style.gridTemplateColumns = "none";
      puzzleContainer.style.gridTemplateRows = "none";

      const fullImage = document.createElement("img");
      fullImage.src = imageURL;
      fullImage.alt = "Completed Puzzle";
      fullImage.style.width = `${gridSize * 100}px`;
      fullImage.style.height = `${gridSize * 100}px`;
      fullImage.style.borderRadius = "10px";

      puzzleContainer.appendChild(fullImage);
    }, 150);
  }
}
