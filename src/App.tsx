import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import "./App.css";

const initial = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function App() {
  const [grid, setGrid] = useState(initial);

  const [[selectionX, selectionY], setSelection] = useState<
    [number | undefined, number | undefined]
  >([undefined, undefined]);

  useEffect(() => {
    const setCell = (value: number) => {
      if (selectionX === undefined || selectionY === undefined) {
        return;
      }

      const gridCopy = cloneDeep(grid);
      gridCopy[selectionY][selectionX] = value;
      setGrid(gridCopy);
    };

    const moveSelection = (x: number, y: number) => {
      if (selectionX === undefined || selectionY === undefined) {
        return;
      }

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
  }, [grid, selectionX, selectionY]);

  return (
    <div id="container">
      <div id="grid">
        {grid.map((row, y) => (
          <div key={y} className={`row row-${y}`}>
            {row.map((cell, x) => (
              <div
                key={x}
                className={`cell col-${x} ${
                  selectionX === x && selectionY === y ? "selected" : ""
                }`}
                onClick={() => setSelection([x, y])}
              >
                <span>{cell === 0 ? "" : cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
