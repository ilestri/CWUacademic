// dlx.js

async function dlxSolver() {
  const startTime = performance.now(); // 시작 시간 기록
  let attempts = 0; // 시도 횟수

  const matrix = createExactCoverMatrix(); // 정확한 커버 행렬 생성
  const header = buildDLX(matrix); // Dancing Links 구조로 변환
  const solution = []; // 해답을 저장할 배열

  async function search(k) {
    if (header.right === header) {
      // 해답을 찾으면, 보드 업데이트
      updateBoardFromSolution(solution);
      const endTime = performance.now();
      document.getElementById('dlx-time').textContent = `걸린 시간: ${((endTime - startTime) / 1000).toFixed(2)}초`;
      return true;
    }

    let column = chooseColumn(header);
    cover(column);

    for (let rowNode = column.down; rowNode !== column; rowNode = rowNode.down) {
      solution[k] = rowNode;

      for (let j = rowNode.right; j !== rowNode; j = j.right) {
        cover(j.column);
      }

      attempts++;
      updateBoard('dlx');
      document.getElementById('dlx-attempts').textContent = `시도 횟수: ${attempts}`;
      await sleep(200); // 실시간 업데이트를 위한 지연

      if (await search(k + 1)) {
        return true;
      }

      rowNode = solution[k];
      for (let j = rowNode.left; j !== rowNode; j = j.left) {
        uncover(j.column);
      }
    }

    uncover(column);
    return false;
  }

  await search(0); // 초기 검색 시작
}

// 정확한 커버 행렬을 생성하는 함수
function createExactCoverMatrix() {
  const matrix = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (boards.dlx[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(row, col, num, 'dlx')) {
            const rowEntry = [row, col, num];
            matrix.push(rowEntry);
          }
        }
      }
    }
  }
  return matrix;
}

// Dancing Links 구조를 생성하는 함수
function buildDLX(matrix) {
  // Dancing Links 구조 생성 (구체적인 노드와 연결 코드)
  // ...
}

// 커버 함수
function cover(column) {
  column.remove();
  for (let rowNode = column.down; rowNode !== column; rowNode = rowNode.down) {
    for (let j = rowNode.right; j !== rowNode; j = j.right) {
      j.remove();
    }
  }
}

// 커버 해제 함수
function uncover(column) {
  for (let rowNode = column.up; rowNode !== column; rowNode = rowNode.up) {
    for (let j = rowNode.left; j !== rowNode; j = j.left) {
      j.restore();
    }
  }
}

// 가장 제한적인 열 선택 함수
function chooseColumn(header) {
  let minSize = Infinity;
  let chosenColumn = null;

  for (let colNode = header.right; colNode !== header; colNode = colNode.right) {
    if (colNode.size < minSize) {
      minSize = colNode.size;
      chosenColumn = colNode;
    }
  }

  return chosenColumn;
}

// 보드 업데이트 함수 (해답을 보드에 반영)
function updateBoardFromSolution(solution) {
  for (const rowNode of solution) {
    const [row, col, num] = rowToCoordinates(rowNode);
    boards.dlx[row][col] = num;
  }
  updateBoard('dlx'); // 보드 업데이트
}

// 좌표 변환 함수 (해당 행을 보드 좌표로 변환)
function rowToCoordinates(rowNode) {
  const row = rowNode[0];
  const col = rowNode[1];
  const num = rowNode[2];
  return [row, col, num];
}

// 유효성 검사를 위한 함수 (중복된 숫자가 있는지 확인)
function isValid(row, col, num, boardId) {
  const board = boards[boardId];

  // 같은 행에 중복된 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  // 같은 열에 중복된 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  // 3x3 박스에 중복된 숫자가 있는지 확인
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true; // 중복이 없으면 true 반환
}

// 지연을 위한 함수 (비동기 처리)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
