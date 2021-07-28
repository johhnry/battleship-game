import { expect } from 'chai';
import { GridLocation } from './GridLocation';

function testGridLocationToBeEqualTo(
  location: GridLocation,
  row: number,
  col: number
) {
  expect(location.row).to.be.equal(row);
  expect(location.col).to.be.equal(col);
}

describe('GridLocation tests', function () {
  it('Should construct a new location', function () {
    const location = new GridLocation(5, 8);
    testGridLocationToBeEqualTo(location, 5, 8);
  });

  it('Should return a new location with the offset added', function () {
    const addedLocation = new GridLocation(-1, 4).add(5, 2);
    testGridLocationToBeEqualTo(addedLocation, 4, 6);
  });

  it('Should give the string representation of a GridLocation', function () {
    expect(new GridLocation(0, 0).toString()).to.be.equal('(0, 0)');
    expect(new GridLocation(-1, 1000).toString()).to.be.equal('(-1, 1000)');
  });
});
