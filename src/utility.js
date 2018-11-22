function findHighestNumber(array) {
	let highest = 0;

	for (let i = 0; i < array.length; i++) {
		if (array[i] > highest) {
			highest = array[i];
		}
	}
	return highest;
}

function findLowestNumber(array) {
	let lowest = 9999999;

	for (let i = 0; i < array.length; i++) {
		if (array[i] < lowest) {
			lowest = array[i];
		}
	}
	return lowest;
}

export {findHighestNumber};
export {findLowestNumber};