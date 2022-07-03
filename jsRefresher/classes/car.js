class Vehicles {
  type = 'Car';
  printType = () => {
    console.log(this.type);
  };
}

class Cars extends Vehicles {
  model = 'Ford';
  printModel = () => {
    console.log(this.model);
  };
}

const car = new Cars();
car.printModel();
car.printType();
