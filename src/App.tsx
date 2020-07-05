import React, { useState, useEffect, useCallback } from "react";
import {
  cloneDeep,
  range,
  flatMap,
  chunk,
  zipWith,
  flatMapDeep,
  sample,
} from "lodash";
import "./App.css";

// TODO: Check results. Show error
// Extra variant: Telkens veranderende tekenset
// Extra variant: emoji's met verschillende skin tones

const puzzle1 = [
  [0, 0, 4, 6, 0, 0, 0, 5, 0],
  [0, 0, 0, 0, 0, 3, 0, 6, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 4, 0, 0, 0],
  [0, 3, 0, 9, 6, 1, 2, 0, 0],
  [0, 0, 5, 3, 0, 0, 0, 0, 6],
  [2, 7, 0, 1, 0, 5, 0, 9, 0],
  [0, 9, 8, 0, 0, 0, 0, 3, 7],
  [1, 0, 0, 0, 0, 0, 0, 0, 2],
];

const puzzle2 = [
  [0, 0, 0, 0, 0, 0, 0, 3, 6],
  [4, 0, 2, 0, 0, 0, 0, 0, 5],
  [5, 0, 0, 6, 0, 0, 8, 2, 1],
  [0, 2, 0, 0, 0, 0, 0, 0, 8],
  [0, 0, 0, 0, 0, 4, 3, 0, 0],
  [8, 4, 7, 9, 0, 3, 0, 0, 0],
  [0, 7, 8, 0, 6, 0, 0, 0, 0],
  [0, 0, 4, 0, 1, 0, 0, 0, 0],
  [0, 3, 0, 0, 0, 0, 5, 7, 0],
];

const puzzle3 = [
  [0, 0, 0, 5, 1, 0, 0, 0, 0],
  [2, 0, 8, 9, 0, 6, 0, 4, 0],
  [5, 0, 0, 8, 0, 3, 0, 9, 0],
  [0, 6, 1, 0, 0, 0, 0, 2, 0],
  [0, 0, 2, 1, 0, 0, 9, 0, 0],
  [0, 0, 0, 0, 0, 5, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 7, 0, 0],
  [0, 0, 9, 0, 0, 7, 0, 0, 0],
  [7, 0, 0, 3, 0, 4, 8, 5, 0],
];

const puzzle4 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 6, 0, 0, 5, 0, 2, 0, 0],
  [4, 0, 9, 0, 2, 8, 0, 3, 0],
  [0, 2, 0, 0, 0, 1, 0, 0, 8],
  [9, 0, 0, 0, 8, 3, 1, 0, 5],
  [0, 0, 0, 9, 6, 0, 0, 4, 0],
  [0, 0, 0, 0, 0, 2, 7, 0, 4],
  [0, 3, 0, 0, 0, 0, 0, 0, 9],
  [8, 5, 0, 0, 4, 0, 0, 0, 0],
];

const puzzle5 = [
  [6, 8, 0, 0, 3, 0, 0, 4, 9],
  [0, 0, 4, 0, 0, 1, 0, 0, 0],
  [0, 5, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0],
  [0, 9, 0, 0, 0, 7, 3, 0, 6],
  [0, 1, 0, 6, 8, 0, 0, 0, 0],
  [2, 0, 1, 0, 0, 6, 0, 0, 0],
  [0, 0, 8, 9, 4, 0, 0, 1, 0],
  [0, 4, 9, 0, 0, 0, 0, 3, 0],
];

const puzzle6 = [
  [3, 0, 6, 0, 0, 0, 0, 0, 4],
  [5, 0, 0, 0, 0, 7, 0, 0, 0],
  [0, 1, 0, 0, 4, 3, 0, 0, 9],
  [1, 0, 8, 5, 0, 0, 3, 6, 0],
  [0, 0, 0, 0, 0, 4, 0, 0, 0],
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 2, 6, 0, 3],
  [6, 0, 0, 8, 0, 0, 0, 4, 0],
  [9, 2, 0, 0, 0, 0, 8, 1, 0],
];

const puzzle7 = [
  [0, 0, 0, 5, 1, 0, 0, 0, 0],
  [2, 0, 8, 9, 0, 6, 0, 4, 0],
  [5, 0, 0, 8, 0, 3, 0, 9, 0],
  [0, 6, 1, 0, 0, 0, 0, 2, 0],
  [0, 0, 2, 1, 0, 0, 9, 0, 0],
  [0, 0, 0, 0, 0, 5, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 7, 0, 0],
  [0, 0, 9, 0, 0, 7, 0, 0, 0],
  [7, 0, 0, 3, 0, 4, 8, 5, 0],
];

// const empty = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

// const puzzle7almostcomplete = [
//   [6, 9, 4, 5, 1, 2, 3, 8, 7],
//   [2, 3, 8, 9, 7, 6, 1, 4, 5],
//   [5, 1, 7, 8, 4, 3, 2, 9, 6],
//   [8, 6, 1, 7, 3, 9, 5, 2, 4],
//   [4, 5, 2, 1, 6, 8, 9, 7, 3],
//   [9, 7, 3, 4, 2, 5, 6, 1, 8],
//   [3, 4, 5, 2, 8, 1, 7, 6, 9],
//   [1, 8, 9, 6, 5, 7, 4, 3, 2],
//   [7, 2, 6, 3, 9, 4, 8, 5, 0],
// ];

const replacement: { [key: number]: string } = {
  1: "🤘🏻",
  2: "🤘🏼",
  3: "🤘🏽",
  4: "☝🏻",
  5: "☝🏼",
  6: "☝🏽",
  7: "👆🏻",
  8: "👆🏼",
  9: "👆🏽",
};

// const puzzle = puzzle7almostcomplete;

const puzzle = sample([
  puzzle1,
  puzzle1,
  puzzle2,
  puzzle3,
  puzzle4,
  puzzle5,
  puzzle6,
  puzzle7,
]) as number[][];

const urlParams = new URLSearchParams(window.location.search);
const fu = urlParams.get("fu") ?? "1";

const check = (rows: number[][]): boolean => {
  const columns = range(0, 9).map((r) => range(0, 9).map((c) => rows[c][r]));

  const chunks = flatMap(
    chunk(
      rows.map((row) => chunk(row, 3)),
      3
    ),
    (chunks) => {
      const [first, second, third] = chunks;

      return zipWith(first, second, third, (a, b, c) => [...a, ...b, ...c]);
    }
  );

  return [...rows, ...columns, ...chunks].every((sg) => {
    const nonZeros = sg.filter((x) => x > 0);
    return nonZeros.length === new Set(nonZeros).size;
  });
};

const shiftValues = (grid: number[][]) => {
  const shiftBy = sample(range(0, 9)) as number;
  return grid.map((row) =>
    row.map((cell) => (cell > 0 ? (cell + shiftBy) % 8 : 0))
  );
};

function App() {
  const [grid, setGrid] = useState(puzzle);
  const isValid = check(grid);
  const isComplete = isValid && flatMapDeep(grid).every((x) => x > 0);

  const [rotation, setRotation] = useState(0);

  const rotate = useCallback(() => {
    setRotation(rotation + 90);
  }, [rotation]);

  const [[selectionX, selectionY], setSelection] = useState<[number, number]>([
    4,
    4,
  ]);

  const isProtected = (x: number, y: number) => {
    return puzzle[y][x] > 0;
  };

  useEffect(() => {
    const setCell = (value: number) => {
      if (isProtected(selectionX, selectionY)) {
        return;
      }

      const gridCopy = cloneDeep(grid);
      gridCopy[selectionY][selectionX] = value;

      if (fu === "3") {
        setGrid(shiftValues(gridCopy));
      } else {
        setGrid(gridCopy);
      }

      if (fu === "1") {
        rotate();
      }
    };

    const moveSelection = (x: number, y: number) => {
      const calc = (value: number): number => {
        if (value < 0) {
          return 7 - value;
        }
        if (value > 8) {
          return value % 9;
        }

        return value;
      };

      setSelection([calc(selectionX + x), calc(selectionY + y)]);
    };

    const onPress = (e: KeyboardEvent) => {
      if (e.keyCode >= 37 && e.keyCode <= 40) {
        switch (e.keyCode) {
          case 37:
            moveSelection(-1, 0);
            break;
          case 39:
            moveSelection(1, 0);
            break;
          case 38:
            moveSelection(0, -1);
            break;
          case 40:
            moveSelection(0, 1);
            break;
        }
      }

      if (e.keyCode >= 48 && e.keyCode <= 57) {
        setCell(e.keyCode - 48);
      }
    };

    document.addEventListener("keydown", onPress, false);

    return () => {
      document.removeEventListener("keydown", onPress, false);
    };
  }, [grid, rotate, selectionX, selectionY]);

  const getCellValue = (value: number) => {
    if (fu === "2") {
      return replacement[value];
    }

    return value;
  };

  return (
    <div id="container">
      <div id="innerContainer" className={`${isValid ? "" : "invalid"}`}>
        <div
          id="grid"
          style={{ transform: `rotate(${rotation}deg)` }}
          className={`${isComplete ? "complete" : ""}`}
        >
          {grid.map((row, y) => (
            <div key={y} className={`row row-${y}`}>
              {row.map((cell, x) => (
                <div
                  key={x}
                  className={`cell col-${x} ${
                    selectionX === x && selectionY === y ? "selected" : ""
                  } ${isProtected(x, y) ? "protected" : ""}`}
                  onClick={() => setSelection([x, y])}
                >
                  <span>{cell === 0 ? "" : getCellValue(cell)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
