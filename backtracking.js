// backtracking.js

async function backtrackingSolver() {
  const startTime = performance.now(); // 시작 시간 기록
  let attempts = 0; // 시도 횟수

  // 스도쿠를 푸는 메인 백트래킹 함수
  async function solve(row, col) {
    if (col === 9) {
      row++;
      col = 0;
    }

    if (row === 9) {
      updateBoard('backtracking'); // 보드 업데이트
      const endTime = performance.now(); // 끝난 시간 기록
      document.getElementById('backtracking-time').textContent = `걸린 시간: ${((endTime - startTime) / 1000).toFixed(2)}초`;
      return true; // 스도쿠 풀림
    }

    if (boards.backtracking[row][col] !== 0) {
      return solve(row, col + 1); // 이미 채워진 셀은 다음 셀로
    }

    // 1부터 9까지 가능한 숫자 넣기
    for (let num = 1; num <= 9; num++) {
      if (isValid(row, col, num, 'backtracking')) {
        boards.backtracking[row][col] = num; // 숫자 넣기
        attempts++; // 시도 횟수 증가
        updateBoard('backtracking'); // 보드 업데이트
        document.getElementById('backtracking-attempts').textContent = `시도 횟수: ${attempts}`;
        await sleep(10); // 0.2초 지연

        if (await solve(row, col + 1)) {
          return true; // 다음 셀이 풀리면 종료
        }

        boards.backtracking[row][col] = 0; // 백트래킹 (다음 셀이 안 풀리면 0으로 되돌리기)
        updateBoard('backtracking');
        await sleep(10); // 백트래킹 시에도 지연
      }
    }
    return false; // 숫자가 없으면 false 반환
  }

  await solve(0, 0); // 첫 번째 셀부터 시작
}

// 셀에 숫자를 넣을 수 있는지 확인하는 함수 (유효성 검사)
function isValid(row, col, value, boardId) {
  const board = boards[boardId];

  // 같은 행에 같은 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value) return false;
  }

  // 같은 열에 같은 숫자가 있는지 확인
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === value) return false;
  }

  // 3x3 박스에 같은 숫자가 있는지 확인
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === value) return false;
    }
  }

  return true; // 유효하다면 true 반환
}

// 지연을 위한 함수 (비동기 처리)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
