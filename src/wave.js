import { typeOfCell } from "./utils.js";

export class Wave {
  constructor(drawHTML, field, options) {
    this.field = field;
    this.queue = [];
    this.options = options;
    this.drawHTML = drawHTML;
    this.options.endsCount = options.endsCount || 1;
    this.ends = [];
  }

  isFoundedEnd(x, y) {
    return this.ends.some(end => end.x === x && end.y === y);
}
  start() {
    const start = this.findStart();
    this.pushToQueue(start.x, start.y, 1);

    const emptyQueue = () => {
      const length = this.queue.length;
      for (let i = 0; i < length; i++) {
        const cell = this.queue.shift();
        if (!this.isFoundedEnd(cell.x, cell.y) && this.checkCell(cell.x, cell.y, typeOfCell.end)) {
          this.ends.push({x: cell.x, y: cell.y, value: cell.value});
          if (this.options.stopOnEnd && this.ends.length === this.options.endsCount) {
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
        this.options.isAnimate ? (this.animationFrameId = requestAnimationFrame(emptyQueue)) : emptyQueue();
      } else {
        this.drawPath();
        this.drawHTML(this.field);
      }
    }
    this.animationFrameId = requestAnimationFrame(emptyQueue);
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
    if (!this.ends.length) {
      return;
    }

    const fn = (currPos) => {
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
        this.options.isAnimate? (this.animationFrameId = requestAnimationFrame(() => fn(currPos))): fn(currPos);
      }
    }
    for (let i = 0; i < this.ends.length; i++) {
      const currPos = {...this.ends[i]};
      this.animationFrameId = requestAnimationFrame(() => fn(currPos));
    }
  }
  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    delete this.queue;

  }
}