class Vehicles {
  constructor() {
    this.type = 'Car';
  }
  printType() {
    console.log(this.type);
  }
}

class Cars extends Vehicles {
  constructor() {
    super();
    this.model = 'Ford';
  }
  printModel() {
    console.log(this.model);
  }
}

const car = new Cars();
car.printModel();
car.printType();
