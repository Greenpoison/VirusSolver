const grid = document.getElementById('grid');
const sequenceContainer = document.getElementById('sequence');
const solveButton = document.getElementById('solve');
const resetButton = document.getElementById('reset');

// Initialize 5x5 grid with inputs
for (let i = 0; i < 25; i++) {
  const input = document.createElement('input');
  input.setAttribute('maxlength', 1);
  input.addEventListener('input', (event) => {
    input.value = input.value.toUpperCase();
    const nextSibling = input.nextElementSibling;
    if (nextSibling) {
      nextSibling.focus();
    }
  });
  grid.appendChild(input);
}

// Initialize sequence inputs (5 to 15 characters)
for (let i = 0; i < 15; i++) {
  const input = document.createElement('input');
  input.setAttribute('maxlength', 1);
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
    const nextSibling = input.nextElementSibling;
    if (nextSibling) {
      nextSibling.focus();
    }
  });
  sequenceContainer.appendChild(input);
}

// Ensure the sequence container can display up to 15 input boxes
sequenceContainer.style.display = 'grid';
sequenceContainer.style.gridTemplateColumns = 'repeat(15, 1fr)';
sequenceContainer.style.gap = '5px';

// Solve the puzzle
solveButton.addEventListener('click', () => {
  const gridValues = Array.from(grid.children).map(input => input.value.trim().toUpperCase());
  const sequence = Array.from(sequenceContainer.children).map(input => input.value.trim().toUpperCase()).filter(char => char !== '');

  console.log('Grid Values:', gridValues);
  console.log('Sequence:', sequence);

  if (sequence.length < 5 || sequence.length > 15 || gridValues.some(char => char === '')) {
    alert('Please fill in the grid completely and ensure the sequence is between 5 and 15 characters.');
    return;
  }

  const gridMatrix = [];
  for (let i = 0; i < 5; i++) {
    gridMatrix.push(gridValues.slice(i * 5, i * 5 + 5));
  }

  console.log('Grid Matrix:', gridMatrix);

  const visited = Array.from({ length: 5 }, () => Array(5).fill(false));
  let path = [];

  // Directions for vertical and horizontal moves
  const verticalMoves = (x, y) => Array.from({ length: 5 }, (_, i) => [i, y]); // vertical directions (same column)
  const horizontalMoves = (x, y) => Array.from({ length: 5 }, (_, j) => [x, j]); // horizontal directions (same row)

  // DFS backtracking function
  function dfs(x, y, index, isVertical) {
    console.log(`DFS called with x=${x}, y=${y}, index=${index}, isVertical=${isVertical}`);
    if (index === sequence.length) return true; // All sequence letters found

    const nextChar = sequence[index];

    // Get possible next moves based on current direction
    const nextMoves = isVertical ? verticalMoves(x, y) : horizontalMoves(x, y);

    for (const [newX, newY] of nextMoves) {
      if (newX >= 0 && newX < 5 && newY >= 0 && newY < 5 && !visited[newX][newY] && gridMatrix[newX][newY] === nextChar) {
        visited[newX][newY] = true;
        path.push([newX, newY]);
        console.log(`Moving to x=${newX}, y=${newY}, nextChar=${nextChar}`);

        // Alternate direction: vertical -> horizontal or horizontal -> vertical
        if (dfs(newX, newY, index + 1, !isVertical)) return true;

        visited[newX][newY] = false;
        path.pop();
      }
    }

    return false;
  }

  let solutionFound = false;

  // Try starting DFS from each position where the first character of the sequence is found
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (gridMatrix[i][j] === sequence[0]) {
        visited[i][j] = true;
        path.push([i, j]);
        console.log(`Starting DFS from i=${i}, j=${j}`);
        if (dfs(i, j, 1, true)) { // Start with vertical direction
          path.forEach(([x, y], step) => {
            const gridIndex = x * 5 + y;
            grid.children[gridIndex].value += ` (${step + 1})`;
            grid.children[gridIndex].classList.add('highlight');
          });
          console.log('Solution found:', path);
          solutionFound = true;
          break;
        }
        visited[i][j] = false;
        path.pop();
      }
    }
    if (solutionFound) break;
  }

  if (!solutionFound) {
    console.log('No solution found for the given sequence.');
    alert('No solution found for the given sequence.');
  }
});

// Reset the grid and sequence
resetButton.addEventListener('click', () => {
  grid.childNodes.forEach(input => {
    input.value = '';
    input.classList.remove('highlight');
  });
  sequenceContainer.childNodes.forEach(input => (input.value = ''));
});
