var mysql = require('mysql');
var prompt = require('prompt');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo_db'
});


// connection.connect(function(err) {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         };
//         console.log('connected as id ' + connection.threadId);
//     });



  // prompt.start();
  // prompt.message ="";
 
  // prompt.get(['prompt'], function (err, result) {
  
  // });


var zoo = {
  welcome: function () {
    console.log("Welcome to Zoo and Friends App~");
  },
  menu: function () {
    console.log("Enter (A): ------> to Add a new animal to the Zoo!");
    console.log(" ");
    console.log("Enter (U): ------> to Update info on an animal in the Zoo!");
    console.log(" ");
    console.log("Enter (V): ------> to Visit the animals in the Zoo!");
    console.log(" ");
    console.log("Enter (D): ------> to Adopt an animal from the Zoo!");
    console.log(" ");
    console.log("Enter (Q): ------> to Quit and exit the Zoo!");
  },
  add: function(input_scope) {
    var currentScope = input_scope;
    console.log("To add an animal to the zoo please fill out the following form for us");
    prompt.get(['name','type','age'], function (err, result){
      var connectionQuery = "INSERT INTO animals (name, type, age) VALUES (?,?,?,?);";
      var newAnimalValue = [result.name, result.type, result.age];
      connection.query(connectionQuery, newAnimalValue, function (err, res) {
      currentScope.menu();
      currentScope.promptUser();
      });
    });
    
  },
  visit: function () {
    console.log("Enter (I): ------> do you know the animal by it’s id? We will visit that animal!");
    console.log("Enter (N): ------> do you know the animal by it’s name? We will visit that animal!");
    console.log("Enter (A): ------> here’s the count for all animals in all locations!");
    console.log("Enter (C): ------> here’s the count for all animals in this one city!");
    console.log("Enter (O): ------> here’s the count for all the animals in all locations by the type you specified!");
    console.log("Enter (Q): ------> Quits to the main menu!");
  },
  view: function (input_scope) {
    var currentScope = input_scope;
    console.log("Please choose what you would like to visit");
    prompt.get(['visit'], function (err, result) {
      if (result.visit === 'Q') {
        currentScope.menu();
      }
      else if (result.visit.toUpperCase() === 'O') {
        currentScope.type();
      }
      else if (result.visit.toUpperCase() === 'I') {
        currentScope.type();
      }
      else if (result.visit.toUpperCase() === 'N') {
        currentScope.name();
      }
      else if (result.visit.toUpperCase() === 'A') {
        currentScope.all();
      }
      else if (result.visit.toUpperCase() === 'C') {
        currentScope.care();
      }
      else {
        console.log("Sorry retry input");
        currentScope.visit();
        currentScope.view(currentScope);
      }
    });
  },
  type: function (input_scope) {
    var currentScope = input_scope;
    console.log("Enter animal type to find how many animals of that type");
    prompt.get(['animal_type'], function (err, result){
      var connectionQuery = 'SELECT COUNT (type) FROM animals WHERE type=?'
      connection.query(connectionQuery, result.animal_type, function (err, res) {
        console.log(res[0]['COUNT(type)'] + result.animal_type);
      });
    });
    currentScope.menu();
    currentScope.promptUser();
  },
  care: function (input_scope) {
    var currentScope = input_scope;
    console.log("Enter City Name NY/SF");
    prompt.get(['city_name'], function (err, result) {
      var connectionQuery = 'SELECT COUNT(*) FROM animals a, caretakers c WHERE a.caretaker_id = c.id AND city =?'; 
      connection.query(connectionQuery,result.city_name, function (err, res){
        console.log(res[0]['COUNT(*)']+ "animals in " + result.city_name);
      });
    });
    currentScope.visit();
    currentScope.view(currentScope);
  },
  animId: function (input_scope) {
    var currentScope = input_scope;
    console.log("Enter ID of animal");
    prompt.get(['animal_id'], function (err, result) {
      var connectionQuery = "SELECT COUNT (*) FROM animals WHERE id =?";
      connection.query(connectionQuery,result.animal_id, function (err, res) {
        console.log(res[0].name);
        console.log(res[0].age);
        console.log(res[0].type);
      });
    }); 
    currentScope.visit();
    currentScope.view(currentScope);
  },
  name: function (input_scope) {
    console.log("enter animal name");
    prompt.get(['animal_name'], function (err, result) {
      var connectionQuery = 'SELECT (*) FROM animals where name =?'
      connection.query(connectionQuery, result.animal_name, function (err, res) {
        console.log(res[0].id);
        console.log(res[0].name);
        console.log(res[0].type);
        console.log(res[0].age);
      });
    });
    currentScope.visit();
    currentScope.view(currentScope);
  },
  all: function (input_scope) {
    var currentScope =input_scope;
    connection.query("SELECT COUNT(*) FROM animals", function (err, res) {
      console.log("there are a total of" + res[0]['COUNT(*)'] + "animals");
      currentScope.menu();
      currentScope.promptUser();
    });
  },
  update: function (input_scope) {
    var currentScope = input_scope;
    prompt.get(["id","new_name","new_age","new_type","new_caretaker_id"], function (err, result) {
      var connectionQuery = "UPDATE animals SET name = result.new_name, age = result.new_age, type = result.new_type, caretaker_id = result.new_caretaker_id WHERE id=?";
      connection.query(connectionQuery, result.id, function (err, res) {
        console.log("new animal" + res[0].name + ", " + res[0].age + ", " +res[0].type);
      });
      currentScope.menu();
      currentScope.promptUser();
    });
  },
  adopt: function (input_scope) {
    var currentScope = input_scope;
    prompt.get(['animal_id'], function (err, result) {
      var connectionQuery= 'DELETE FROM animals WHERE id=?';
      connection.query(connectionQuery, result.animal_id, function (err, res) {
      });
      console.log("Adopted animal" + result.animal_id);
      currentScope.visit();
      currentScope.view(currentScope);
    });
  },
  promptUser: function () {
    var self = this;
    prompt.get(['input'], function (err, result) {
      if (result.input.toUpperCase() === 'Q') {
        self.exit();
      }
      else if (result.input.toUpperCase() === 'A') {
        self.add(self);
      }
      else if (result.input.toUpperCase() === 'V') {
        self.view(self);
      }
      else if (result.input.toUpperCase() === 'D') {
        self.adopt(self);
      }
      else if (result.input.toUpperCase() === 'U') {
        self.update(self);
      }
      else {
        console.log ("Try again");
      }
    });
  },
  exit: function () {
    console.log ("good bye");
    process.exit();
  },
  open: function () {
    this.welcome();
    this.menu();
    this.promptUser();
  }

}

zoo.open();