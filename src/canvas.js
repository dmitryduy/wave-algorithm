import { getCellColor } from "./utils.js";

export class Canvas {
  options = {
    cellSize: 10,
    backgroundColor: '#1e1e1e',
    padding: 0
  }

  constructor(canvas, columns, rows, board, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.options = {...this.options, ...options};
    this.board = board;
    this.rows = rows;
    this.columns = columns;
    this.canvas.width = this.options.cellSize * this.columns + this.options.padding * 2;
    this.canvas.height = this.options.cellSize * this.rows + this.options.padding * 2;
  }

  drawMaze() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fill();

    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        const cellColor = getCellColor(this.board[y][x]);
        this.ctx.beginPath();
        this.ctx.rect(
          this.options.padding + x * this.options.cellSize,
          this.options.padding + y * this.options.cellSize,
          this.options.cellSize,
          this.options.cellSize
        );

        this.ctx.fillStyle = cellColor;
        this.ctx.fill();
      }
    }
  }

  getContext() {
    return this.ctx;
  }

  getCellSize() {
    return this.options.cellSize;
  }
  getPadding() {
    return this.options.padding;
  }
}