import { delay, getCellColor, getRandom, typeOfCell } from "./utils.js";
import { Board } from "./board.js";
import { Canvas } from "./canvas.js";

export class MazeCreator {
  options = {
    tractorsCount: 1,
    columns: null,
    rows: null,
    increaseTractorsIn: 50,
    animationSpeed: 0,
    maxTractors: 100
  }
  iterations = 0
  tractors = [];
  stop = false

  constructor(canvas, options, onUpdate) {
    this.onUpdate = onUpdate;
    this.options = {...this.options, ...options};
    this.board = new Board(this.options.columns, this.options.rows);
    this.board.generateField();
    this.canvas = new Canvas(
      canvas,
      this.board.getColumns(),
      this.board.getRows(),
      this.board.getBoard(),
      {cellSize: options.cellSize}
    );
    this.tractorStartPosition = this.options.tractorStartPosition;
    this.visitedSupportBlocks = 1;
    this.maxSupportBlocks = Math.ceil(this.options.columns / 2) * Math.ceil(this.options.rows / 2);
    this.addTractor();
  }

  addTractor() {
    if (this.tractors.length >= this.options.maxTractors) {
      return;
    }
    this.tractors.push({x: 0, y: 0});
  }

  getTractorDirection(tractor) {
    const directions = [];
    if (tractor.x > 1) {
      directions.push([-2, 0]);
    }
    if (tractor.x < this.options.columns - 1) {
      directions.push([2, 0]);
    }
    if (tractor.y > 1) {
      directions.push([0, -2]);
    }
    if (tractor.y < this.options.rows - 1) {
      directions.push([0, 2]);
    }
    return directions[getRandom(0, directions.length)];
  }

  moveTractors() {
    for (const tractor of this.tractors) {
      const [dx, dy] = this.getTractorDirection(tractor);
      tractor.x += dx;
      tractor.y += dy;
      const board = this.board.getBoard();
      if (board[tractor.y] && board[tractor.y][tractor.x] === typeOfCell.block) {
        this.visitedSupportBlocks++;
        this.onUpdate(this.visitedSupportBlocks, this.maxSupportBlocks);
        board[tractor.y][tractor.x] = typeOfCell.empty;
        board[tractor.y - dy / 2][tractor.x - dx / 2] = typeOfCell.empty;
      }
    }
  }

  async run() {
    while (this.visitedSupportBlocks !== this.maxSupportBlocks && !this.stop) {
      this.iterations++;
      this.moveTractors();
      this.canvas.drawMaze();
      this.drawTractors();
      await delay(this.options.animationSpeed);
      if (this.iterations % this.options.increaseTractorsIn === 0) {
        this.addTractor();
      }
    }
    this.canvas.drawMaze();
  }

  drawTractors() {
    const ctx = this.canvas.getContext();
    const cellSize = this.canvas.getCellSize();
    const padding = this.canvas.getPadding();
    for (const tractor of this.tractors) {
      ctx.beginPath();
      ctx.rect(
        padding + tractor.x * cellSize,
        padding + tractor.y * cellSize,
        cellSize,
        cellSize
      );

      ctx.fillStyle = 'red';
      ctx.fill();
    }
  }

  getCanvasInstance() {
    return this.canvas;
  }

  getBoard() {
    return this.board.getBoard();
  }

  finish() {
    this.stop = true;
  }
  checkCell(x, y) {
    return this.board.getBoard()[x][y] === typeOfCell.empty;
  }
  addCell(position, type) {
    this.board.addCell(position, type);
  }
  draw() {
    this.canvas.drawMaze();
  }
}