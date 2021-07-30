/**
 * Return a random element of an array
 * @param array the array to choose from
 * @returns the choosen element
 */
export function chooseRandomFrom<T>(array: Array<T>): T {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * Creates a two dimensional array with the provided type
 * @param rows number of rows
 * @param cols number of columns
 * @param cellClass class to instantiate
 * @returns a two dimensional array with cellClass objects
 */
export function initializeTwoDimensionalArray<T>(
  rows: number,
  cols: number,
  cellClass: new () => T
): T[][] {
  const array: T[][] = [];

  for (let i = 0; i < rows; i++) {
    array[i] = [];
    for (let j = 0; j < cols; j++) {
      array[i][j] = new cellClass();
    }
  }

  return array;
}
