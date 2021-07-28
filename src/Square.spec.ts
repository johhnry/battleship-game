import { expect } from 'chai';
import { Cruiser } from './Boat';
import { Square, SquareStatus } from './Square';

describe('Square creation', function () {
  it('Create an empty Square', function () {
    const square = new Square();
    expect(square).not.to.be.null;
    expect(square).to.have.property('status', SquareStatus.Empty);
  });

  it('Create a Square with an initial content', function () {
    const possibleStatus: SquareStatus[] = [
      SquareStatus.Empty,
      SquareStatus.Boat,
      SquareStatus.Hit,
      SquareStatus.Miss
    ];

    for (const status of possibleStatus) {
      const square = new Square(status);
      expect(square).to.have.property('status', status);
    }
  });
});

describe('Square behavior', function () {
  it('Should miss the square', function () {
    const square = new Square();
    square.miss();
    expect(square).to.have.property('status', SquareStatus.Miss);
  });

  it('Should hit the square', function () {
    const square = new Square();
    square.hit();
    expect(square).to.have.property('status', SquareStatus.Hit);
  });

  it('Should place a boat on the square', function () {
    const square = new Square();
    square.placeBoat(Cruiser);
    expect(square.hasABoat()).to.be.true;
  });
});
