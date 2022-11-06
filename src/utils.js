export const typeOfCell = {
  empty: 0,
  start: -2,
  end: -3,
  block: -1,
  path: -5,
};

export const getRandom = (min, max) => Math.floor(Math.random() * (max - min) + min);

export const getClassNameByCellType = cellType => {
  switch (cellType) {
    case typeOfCell.block:
      return 'block';
    case typeOfCell.empty:
      return 'empty';
    case typeOfCell.start:
      return 'start';
    case typeOfCell.end:
      return 'end';
    case typeOfCell.path:
      return 'path';
    default:
      return 'fill';
  }
};
