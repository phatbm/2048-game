import React, { useState, useEffect } from 'react';
import './App.css';

const SIZE = 4;

const generateEmptyGrid = () => Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));

const getRandomEmptyCell = (grid) => {
  const emptyCells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) emptyCells.push([r, c]);
    }
  }
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const addRandomTile = (grid) => {
  const cell = getRandomEmptyCell(grid);
  if (!cell) return grid;
  const [r, c] = cell;
  const newGrid = [...grid.map(row => [...row])];
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
};

const slide = (row) => {
  const arr = row.filter(n => n !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
    }
  }
  return arr.filter(n => n !== 0).concat(Array(SIZE).fill(0)).slice(0, SIZE);
};

const moveLeft = (grid) => grid.map(row => slide(row));

const moveRight = (grid) => grid.map(row => slide(row.reverse()).reverse());

const moveUp = (grid) => {
  const newGrid = generateEmptyGrid();
  for (let c = 0; c < SIZE; c++) {
    const col = [];
    for (let r = 0; r < SIZE; r++) col.push(grid[r][c]);
    const newCol = slide(col);
    for (let r = 0; r < SIZE; r++) newGrid[r][c] = newCol[r];
  }
  return newGrid;
};

const moveDown = (grid) => {
  const newGrid = generateEmptyGrid();
  for (let c = 0; c < SIZE; c++) {
    const col = [];
    for (let r = 0; r < SIZE; r++) col.push(grid[r][c]);
    const newCol = slide(col.reverse()).reverse();
    for (let r = 0; r < SIZE; r++) newGrid[r][c] = newCol[r];
  }
  return newGrid;
};

const App = () => {
  const [grid, setGrid] = useState(addRandomTile(addRandomTile(generateEmptyGrid())));

  const handleKey = (e) => {
    let newGrid;
    if (e.key === 'ArrowLeft') newGrid = moveLeft(grid);
    else if (e.key === 'ArrowRight') newGrid = moveRight(grid);
    else if (e.key === 'ArrowUp') newGrid = moveUp(grid);
    else if (e.key === 'ArrowDown') newGrid = moveDown(grid);
    else return;

    if (JSON.stringify(newGrid) !== JSON.stringify(grid)) {
      setGrid(addRandomTile(newGrid));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const resetGame = () => {
    setGrid(addRandomTile(addRandomTile(generateEmptyGrid())));
  };

  return (
    <div className="game">
      <h1>2048</h1>
      <div className="grid">
        {grid.map((row, r) => (
          <div key={r} className="row">
            {row.map((val, c) => (
              <div key={c} className={`cell value-${val}`}>{val !== 0 ? val : ''}</div>
            ))}
          </div>
        ))}
      </div>
      <button className="reset" onClick={resetGame}>🔄 Reset</button>
    </div>
  );
};

export default App;
