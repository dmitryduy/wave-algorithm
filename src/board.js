import { getRandom, typeOfCell } from "./utils.js";

export class Board {
  constructor(columns, rows) {
    this.rows = rows;
    this.columns = columns;
  }

  generateField() {
    this.field = Array(this.rows).fill(0);
    this.field = this.field.map(_ => Array(this.columns).fill(typeOfCell.block));
    this.field[0][0] = typeOfCell.empty;
  }

  fillField() {
    this.addCells(1, typeOfCell.start);
    this.addCells(1, typeOfCell.end);
  }

  addCells(count, type) {
    for (let i = 0; i < count; i++) {
      const pos = this.getRandomPosition();
      this.field[pos.x][pos.y] = type;
    }
  }

  getRandomPosition() {
    let pos = null;
    do {
      pos = {
        x: getRandom(0, this.rows),
        y: getRandom(0, this.columns),
      };
    } while (this.field[pos.x][pos.y] !== typeOfCell.empty);
    return pos;
  }

  getBoard() {
    return this.field;
  }

  getRows() {
    return this.rows;
  }

  getColumns() {
    return this.columns;
  }
}