// heuristic.js

async function heuristicBacktrackingSolver() {
  const startTime = performance.now();
  let attempts = 0;

  // 가능한 값의 후보가 가장 적은 셀을 찾는 함수
  function findBestCell() {
    let minOptions = 10; // 가능한 숫자 후보는 최대 9개이므로 10으로 시작
    let bestCell = null;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (boards.heuristic[row][col] === 0) {
          const options = getOptions(row, col, 'heuristic');
          if (options.length < minOptions) {
            minOptions = options.length;
            bestCell = {row, col, options};
          }
        }
      }
    }
    return bestCell;
  }

  // 주어진 셀에 들어갈 수 있는 숫자 목록을 반환
  function getOptions(row, col, boardId) {
    const options = [];
    for (let num = 1; num <= 9; num++) {
      if (isValid(row, col, num, boardId)) {
        options.push(num);
      }
    }
    return options;
  }

  // 스도쿠를 푸는 함수
  async function solve() {
    const bestCell = findBestCell(); // 가능한 값이 가장 적은 셀 찾기

    if (!bestCell) {
      // 모든 셀이 채워지면 완료
      updateBoard('heuristic');
      const endTime = performance.now();
      document.getElementById(
          'heuristic-time').textContent = `걸린 시간: ${((endTime - startTime)
          / 1000).toFixed(2)}초`;
      return true;
    }

    const {row, col, options} = bestCell;

    for (const num of options) {
      boards.heuristic[row][col] = num;
      attempts++;
      updateBoard('heuristic');
      document.getElementById(
          'heuristic-attempts').textContent = `시도 횟수: ${attempts}`;
      await sleep(10); // 각 숫자 업데이트 시 지연

      if (await solve()) {
        return true;
      }

      // 백트래킹 (잘못된 경우 숫자 되돌림)
      boards.heuristic[row][col] = 0;
      updateBoard('heuristic');
      await sleep(10);
    }
    return false;
  }

  await solve();
}

// 유효성 검사를 위한 함수 (중복된 숫자가 있는지 확인)
function isValid(row, col, value, boardId) {
  const board = boards[boardId];

  // 같은 행에 중복된 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value) {
      return false;
    }
  }

  // 같은 열에 중복된 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === value) {
      return false;
    }
  }

  // 3x3 박스에 중복된 숫자가 있는지 확인
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === value) {
        return false;
      }
    }
  }

  return true;
}

// 지연을 위한 함수 (비동기 처리)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
