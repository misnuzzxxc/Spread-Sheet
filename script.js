// HTML에서 id가 "spreadsheet-container"인 요소를 가져옵니다.
const spreadSheetContainer = document.querySelector("#spreadsheet-container");

// "Export Spreadsheet" 버튼 요소를 가져옵니다.
const exportBtn = document.querySelector("#export-btn");

// 행과 열의 수를 정의합니다.
const ROWS = 10;
const COLS = 10;

// 스프레드시트 데이터를 저장할 배열을 생성합니다.
const spreadsheet = [];

// 열 헤더를 정의합니다.
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

// 각 셀을 나타내는 클래스 정의
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader; // 셀이 헤더인지 여부
        this.disabled = disabled; // 셀이 편집 불가능한지 여부
        this.data = data; // 셀의 데이터
        this.row = row; // 행 번호
        this.rowName = rowName; // 행 이름 (헤더 셀의 경우)
        this.column = column; // 열 번호
        this.columnName = columnName; // 열 이름 (헤더 셀의 경우)
        this.active = active; // 셀이 활성화된 상태인지 여부
    }
}

// "Export Spreadsheet" 버튼 클릭 시 CSV 파일을 생성 및 다운로드하는 함수
exportBtn.onclick = function (e) {
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n";
    }
    console.log('csv: ', csv);

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvUrl', csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = 'spreadsheet name.csv';
    a.click();
}

// 스프레드시트 초기화 함수 호출
initSpreadsheet();

// 스프레드시트 초기화 함수
function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            let cellData = "";
            let isHeader = false;
            let disabled = false;

            // 첫 번째 열은 행 헤더입니다.
            if (j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            // 첫 번째 행은 열 헤더입니다.
            if (i === 0) {
                isHeader = true;
                disabled = true;
                cellData = alphabets[j - 1];
            }

            // 셀 데이터가 비어있으면 빈 문자열로 설정
            if (!cellData) {
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j - 1];

            // Cell 클래스의 인스턴스를 생성하여 스프레드시트 행에 추가
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false);
            spreadsheetRow.push(cell);
        }
        // 스프레드시트 배열에 행을 추가
        spreadsheet.push(spreadsheetRow);
    }

    // 스프레드시트 그리기 함수 호출
    drawsheet();

    // 스프레드시트 데이터를 콘솔에 출력
    console.log(spreadsheet);
}

// 셀 엘리먼트를 생성하는 함수
function createCellEl(cell) {
    const cellEl = document.createElement('input');
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    // 헤더인 경우 CSS 클래스 "header"를 추가
    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    // 셀을 클릭했을 때 이벤트 핸들러 등록
    cellEl.onclick = () => handleCellClick(cell);
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
    return cellEl;
}

// 셀 데이터 변경 시 이벤트 핸들러
function handleOnChange(data, cell) {
    cell.data = data;
}

// 셀 클릭 이벤트 핸들러
function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
    columnHeaderEl.classList.add('active');
    rowHeaderEl.classList.add('active');
    document.querySelector("#cell-status").innerHTML = cell.columnName + " " + cell.rowName;
}

// 셀 클릭시 이벤트 중복 핸들러 삭제 
function clearHeaderActiveStates() {
    const headers = document.querySelectorAll('.header');
    headers.forEach((header) => {
        header.classList.remove('active');
    });
}

// 특정 행 및 열에서 엘리먼트 가져오는 함수
function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

// 스프레드시트 그리기 함수
function drawsheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            // 셀 엘리먼트를 스프레드시트 컨테이너에 추가
            spreadSheetContainer.append(createCellEl(cell));
        }
        // 행 컨테이너를 스프레드시트 컨테이너에 추가
        spreadSheetContainer.append(rowContainerEl);
    }
}
