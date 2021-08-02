import { expect } from 'chai';
import { Cruiser } from '../src/Boat';
import { SquareHitError, SquareMissError } from '../src/errors';
import { Square, SquareStatus } from '../src/Square';

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
    square.hit(true);
    expect(square).to.have.property('status', SquareStatus.Hit);
  });

  it('Should place a boat on the square', function () {
    const square = new Square();
    square.placeBoat(Cruiser);
    expect(square.hasABoat()).to.be.true;
  });

  it('Should give a string representation of a Square', function () {
    const square = new Square();
    expect(square.toString()).to.be.equal(' ');

    square.hit(true);
    expect(square.toString()).to.be.equal('X');

    square.miss();
    expect(square.toString()).to.be.equal('O');

    square.placeBoat(Cruiser);
    expect(square.toString()).to.be.equal('3');

    square.content = undefined;
    expect(square.toString()).to.be.equal('B');
  });

  it('Should have been hit', function () {
    const square = new Square();
    square.hit(true);

    expect(square.hasBeenHit()).to.be.true;
  });

  it("Can't be miss when there's a boat", function () {
    const square = new Square();
    square.placeBoat(Cruiser);
    expect(() => square.miss()).to.throw(SquareMissError);
  });

  it("Can't be hit when there's a boat", function () {
    const square = new Square();
    expect(() => square.hit()).to.throw(SquareHitError);
  });
});
