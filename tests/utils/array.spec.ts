import { expect } from 'chai';
import {
  flattenTwoDimensionalArray,
  initializeTwoDimensionalArray
} from '../../src/utils';

describe('initializeTwoDimensionalArray', function () {
  it('Initialize empty array', function () {
    const twodim = initializeTwoDimensionalArray(0, 0, String);

    expect(twodim).to.be.empty;
    expect(twodim).deep.equal([]);
  });

  it('Creates a 2d array of strings', function () {
    const twoDimStrings = initializeTwoDimensionalArray(2, 2, String);

    expect(twoDimStrings).deep.equal([
      [new String(), new String()],
      [new String(), new String()]
    ]);
  });
});

describe('flattenTwoDimensionalArray', function () {
  it('Flattens an empty 2D array', function () {
    const array = [[]];
    const flatten = flattenTwoDimensionalArray(array);
    expect(flatten).deep.equal([]);
  });

  it('Flattens a small 2D array', function () {
    const array = [
      [2, 3, 1],
      [4, 23]
    ];

    const flatten = flattenTwoDimensionalArray(array);

    expect(flatten).deep.equal([2, 3, 1, 4, 23]);
  });
});
