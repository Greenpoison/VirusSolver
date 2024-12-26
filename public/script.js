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

// Initialize sequence inputs (10 characters)
for (let i = 0; i < 10; i++) {
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

// Solve the puzzle
solveButton.addEventListener('click', () => {
  const gridValues = Array.from(grid.children).map(input => input.value.trim().toUpperCase());
  const sequence = Array.from(sequenceContainer.children).map(input => input.value.trim().toUpperCase());

  if (sequence.some(char => char === '') || gridValues.some(char => char === '')) {
    alert('Please fill in the grid and sequence completely.');
    return;
  }

  const gridMatrix = [];
  for (let i = 0; i < 5; i++) {
    gridMatrix.push(gridValues.slice(i * 5, i * 5 + 5));
  }

  const visited = Array.from({ length: 5 }, () => Array(5).fill(false));
  let path = [];

  function dfs(x, y, index, isVertical) {
    if (index === sequence.length) return true;

    const nextChar = sequence[index];

    if (isVertical) {
      for (let i = 0; i < 5; i++) {
        if (!visited[i][y] && gridMatrix[i][y] === nextChar) {
          visited[i][y] = true;
          path.push([i, y]);
          if (dfs(i, y, index + 1, false)) return true;
          visited[i][y] = false;
          path.pop();
        }
      }
    } else {
      for (let j = 0; j < 5; j++) {
        if (!visited[x][j] && gridMatrix[x][j] === nextChar) {
          visited[x][j] = true;
          path.push([x, j]);
          if (dfs(x, j, index + 1, true)) return true;
          visited[x][j] = false;
          path.pop();
        }
      }
    }

    return false;
  }

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (gridMatrix[i][j] === sequence[0]) {
        visited[i][j] = true;
        path.push([i, j]);
        if (dfs(i, j, 1, true)) {
          path.forEach(([x, y], step) => {
            const gridIndex = x * 5 + y;
            grid.children[gridIndex].value += ` (${step + 1})`;
          });
          return;
        }
        visited[i][j] = false;
        path.pop();
      }
    }
  }

  alert('No solution found for the given sequence.');
});

// Reset the grid and sequence
resetButton.addEventListener('click', () => {
  grid.childNodes.forEach(input => (input.value = ''));
  sequenceContainer.childNodes.forEach(input => (input.value = ''));
});
