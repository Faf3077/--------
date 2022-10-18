'use strict';

let globalNumberBlocks = document.querySelectorAll('.btn');
let globalMatrixElement = standardMatrixElements(globalNumberBlocks); 
let globalNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8]; 
let globalExists = []; // Массив для проверки отсутсвия повторения
let gameMatrix = [ // Представление игрового поля внутри программы. Эти данные мы фактически меняем, а потом
	// функцией gameMatrixDataToHTML переносим их на html
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 0],
];

setEventListenerOnBlocks(); // на каждый блок вешаем обработчик событий
function reRender() { // функция "обновления" игрового поля. То есть обновления данных на нём
	globalNumberBlocks = document.querySelectorAll('.btn');
	globalMatrixElement = standardMatrixElements(globalNumberBlocks);
	gameMatrixDataToHTML();
	changeNullBlockStyle();
}
// перенос данных из массива в html код (цифры из массива gameMatrix суются в html span'ы)
function gameMatrixDataToHTML() {
	for (let x = 0; x < gameMatrix[0].length; x++) {
		for (let y = 0; y < gameMatrix.length; y++) {
			globalMatrixElement[x][y].innerHTML = gameMatrix[x][y];
		}
	}
}
//  превращение одномерного массива в матрицу 
function standardMatrixElements(numberBlocks) {
	let matrixElement = [[]];
	let row = 0;
	for (let i = 0; i < numberBlocks.length; i++) {
		if (i % 3 === 0 && i != 0) {
			row++;
			matrixElement.push([]);
		}
		matrixElement[row].push(numberBlocks[i]);
	}
	return matrixElement;
}
// рандомная генерация
function newRandomNumbersGenerate() {
	for (let x = 0; x < gameMatrix[0].length; x++) {
		for (let y = 0; y < gameMatrix.length; y++) {
			let random = getRandomNumber();
			gameMatrix[x][y] = globalNumbers[random];
		}
	}
	reRender();
	globalExists = [];
}
// скрытие блока с 0 и отображение всех остальных
function changeNullBlockStyle() {
	for (let x = 0; x < gameMatrix[0].length; x++) {
		for (let y = 0; y < gameMatrix.length; y++) {
			let element = globalMatrixElement[x][y];
			if (element.innerHTML === '0') {
				element.parentElement.classList.add('null-block');
			} else {
				element.parentElement.classList.remove('null-block');
			}
		}
	}
}
// функция для генерации неповторяющихся чисел
function getRandomNumber() {
	while (true) {
		let result = Math.floor(Math.random() * globalNumbers.length);
		if (!globalExists.includes(result)) {
			globalExists.push(result);
			return result;
		}
	}
}
// добавление обработчиков события нажатия на блок на каждый блок
function setEventListenerOnBlocks() {
	for (let x = 0; x < gameMatrix[0].length; x++) {
		for (let y = 0; y < gameMatrix.length; y++) {
			let element = globalMatrixElement[x][y]; // для удобства
			element.parentElement.addEventListener('click', () => { // перебираем каждый элемент и вешаем функцию-обработчик
				let numberInBlock = element.innerHTML; // для удобства. Число внутри span
				let [coordinates, nullCoordinates] = findBlockCoordinates(numberInBlock); // получаем координаты блока, на которых нажали и нулевого блока
				let isCloseToZero = checkNullClose(coordinates, nullCoordinates); // Проверка, рядом ли нулевой блок
				if (isCloseToZero) {
					gameMatrix[nullCoordinates.x][nullCoordinates.y] = gameMatrix[coordinates.x][coordinates.y];
					gameMatrix[coordinates.x][coordinates.y] = 0;
					// Тут просто меняем местами в матрице число, на которое мы нажали и 0
					// а затем ререндерим поле
					reRender();
				}
			});
		}
	}
}
// проверка блока на близость к блоку со значением 0
function checkNullClose(coordinaters, nullCoordinates) {
	let xClose = Math.abs(coordinaters.x - nullCoordinates.x);
	let yClose = Math.abs(coordinaters.y - nullCoordinates.y);
	let onDiagonal = xClose - yClose === 0;
	if (xClose <= 1 && yClose <= 1 && !onDiagonal) {
		return true;
	} else {
		return false;
	}
}

function findBlockCoordinates(numberInBlock) { // нахождение координаты блока, на который нажали мышкой + нахождение текущих координат блока со значением 0
	let coordinates = {
		x: 0,
		y: 0,
	};
	let nullCoordinates = {
		x: 0,
		y: 0,
	};
	for (let x = 0; x < gameMatrix[0].length; x++) {
		for (let y = 0; y < gameMatrix.length; y++) {
			if (gameMatrix[x][y] === Number(numberInBlock)) {
				coordinates.x = x;
				coordinates.y = y;
			}
			if (gameMatrix[x][y] === 0) {
				nullCoordinates.x = x;
				nullCoordinates.y = y;
			}
		}
	}
	return [coordinates, nullCoordinates];
}
