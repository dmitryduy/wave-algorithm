import { typeOfCell } from "./utils.js";

export class Wave {
  constructor(drawHTML, field, options) {
    this.field = field;
    this.queue = [];
    this.end = null;
    this.options = options;
    this.drawHTML = drawHTML;
  }
  start() {
    const start = this.findStart();
    this.pushToQueue(start.x, start.y, 1);

    const emptyQueue = () => {
      const length = this.queue.length;
      for (let i = 0; i < length; i++) {
        const cell = this.queue.shift();
        if (!this.end && this.checkCell(cell.x, cell.y, typeOfCell.end)) {
          this.end = {x: cell.x, y: cell.y, value: cell.value};
          if (this.options.stopOnEnd) {
            this.drawPath();
            this.drawHTML(this.field);
            return;
          }
        }
        if (this.checkCell(cell.x, cell.y, typeOfCell.empty)) {
          this.field[cell.x][cell.y] = cell.value;
          this.pushToQueue(cell.x, cell.y, cell.value + 1);
        }
      }
      this.drawHTML(this.field);
      if (this.queue.length) {
        this.options.isAnimate ? requestAnimationFrame(emptyQueue) : emptyQueue();
      } else {
        this.drawPath();
        this.drawHTML(this.field);
      }
    }
    requestAnimationFrame(emptyQueue);
  }

  pushToQueue(startX, startY, value) {
    this.queue.push(
      {x: startX + 1, y: startY, value},
      {x: startX, y: startY + 1, value},
      {x: startX - 1, y: startY, value},
      {x: startX, y: startY - 1, value}
    );
  }

  findStart() {
    for (let i = 0; i < this.field.length; i++) {
      for (let j = 0; j < this.field[i].length; j++) {
        if (typeOfCell.start === this.field[i][j]) {
          return {x: i, y: j};
        }
      }
    }
  }
  checkCell(x, y, value) {
    return this.field[x] && this.field[x][y] === value;
  }

  drawPath() {
    if (!this.end) {
      return;
    }
    let currPos = {...this.end};
    const fn = () => {
      const newValue = currPos.value - 1;
      if (this.checkCell(currPos.x + 1, currPos.y, newValue)) {
        currPos = {...currPos, x: currPos.x + 1};
      } else if (this.checkCell(currPos.x, currPos.y + 1, newValue)) {
        currPos = {...currPos, y: currPos.y + 1};
      } else if (this.checkCell(currPos.x - 1, currPos.y, newValue)) {
        currPos = {...currPos, x: currPos.x - 1};
      } else if (this.checkCell(currPos.x, currPos.y - 1, newValue)) {
        currPos = {...currPos, y: currPos.y - 1};
      }
      currPos.value = newValue;
      this.field[currPos.x][currPos.y] = typeOfCell.path;
      this.drawHTML(this.field);
      if (currPos.value > 1) {
        this.options.isAnimate? requestAnimationFrame(fn): fn();
      }
    }
    requestAnimationFrame(fn);
  }
}