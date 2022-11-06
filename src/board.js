import { getRandom, typeOfCell } from "./utils.js";

export class Board {
  constructor(rows, columns, endsCount) {
    this.rows = rows;
    this.columns = columns;
    this.endsCount = endsCount;
  }
  generateField() {
    this.field = Array(this.rows).fill(0);
    this.field = this.field.map(_ => Array(this.columns).fill(0));
    this.fillField();
  }
  fillField() {
    this.addCells(1, typeOfCell.start);
    this.addCells(this.endsCount, typeOfCell.end);
    this.addCells(
      Math.floor((this.rows * this.columns) / getRandom(2, 5)),
      typeOfCell.block
    );
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
}