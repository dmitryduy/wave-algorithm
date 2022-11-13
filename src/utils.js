export const typeOfCell = {
  empty: 0,
  start: -2,
  end: -3,
  block: -1,
  path: -5,
  tractor: -10,
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

export const getCellColor = cell => {
  switch (cell) {
    case typeOfCell.block:
      return '#000';
    case typeOfCell.empty:
      return '#a1a1a1';
    case typeOfCell.start:
      return '#98fb98';
    case typeOfCell.end:
      return '#ff6347';
    case typeOfCell.path:
      return '#cd853f';
    default:
      return '#fffaf0';
  }
}

export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

export const getCellSize = cellsCount => {
  if (cellsCount < 1000) {
    return 40;
  }
  if (cellsCount < 2000) {
    return 30;
  }
  if (cellsCount < 5000) {
    return 20;
  }

  return 10;
}
