const prompt = require('prompt-sync')({sigint: true});
const clear = require('clear-screen');

const hat = '^';
const hole = 'O';
const fieldCharacter = '▒';
const pathCharacter = '*';

//const name = prompt('What is your name?');
//console.log(`Hey there ${name}`); 

//create a class controller for the game
class Field {

    //initiate the variables in the class
    constructor(field){
    this.field = field;
    this.start = {
        x: 0,
        y: 0
    };

    //this.start is the default for char'*'
    

    this.hatPos = {
        x: 0,
        y: 0
    };

  
    this.locationX = 0;
    this.locationY = 0;

    this.locationXOld = 0; //old X char location
    this.locationYOld = 0; //old Y char location

    this.holeLocationX = []; //hole X locations
    this.holeLocationY = []; //hole Y locations

    } //end of constructor

    //Call static method directly from the class object
    static generateField(fieldH, fieldW, percentage = 0.1) {
        const field = new Array(fieldH)
                      .fill(0)
                      .map(element => new Array(fieldW));
        
        console.log(field);

        for(let y = 0; y < fieldH; y++) {
          for(let x = 0; x < fieldW; x++) {
            const prob = Math.random();        //return a value between 1 and 0      
            field[y][x] = prob > percentage ? fieldCharacter : hole
          }
        }
        return field;
      } //end of generateField method


      runGame() {
        //other methods in the class  
        this.setStart(); //set the random position of my char '*'
        this.setHat();  //set the random postion of my hat '^'
      
        //find locations of all the holes and save in holeLocation array
        this.findHole();

        
        
        let endGame = false; 
        while (!endGame) {

          this.print();   //print out the rows and columns

          console.log('hat ^ position X: ' + this.hatPos.x + ' Y: ' + this.hatPos.y); //console log hat x and y positon
          
          console.log('your * position X: ' + this.locationX + ' Y: ' + this.locationY); //console log char x and y position

          this.getInput(); //get input from the user

          //reset old char position 
          this.resetPosition();

          //path chararcter new positon from user input
          this.setInputPosition();
         
          //check if fell into hole
          for (let i = 0; i < this.holeLocationX.length; i++) {   
            if (this.locationY == this.holeLocationY[i] && this.locationX == this.holeLocationX[i]) { 
                console.log('Oh no, you fell into a hole!'); 
                endGame = true; 
            } 
                      
          }  

           //compare new position with hat position
          if (this.hatPos.x == this.locationX && this.hatPos.y == this.locationY) {

            console.log('Congrats, you found your hat!');

            endGame = true;  
          } 
          
          else{
            console.log('Sorry, hat not yet found'); 
          }

        }        
      }
     
      setStart() {
        this.start = this.setPos(); //setPos method returns a random x and y value
        this.locationX = this.start.x; 
        this.locationY = this.start.y;
        this.field[this.locationY][this.locationX] = pathCharacter; //* initial position
      }
      
      resetPosition() {
        
        this.field[this.locationYOld][this.locationXOld] = fieldCharacter; // sets field character to previous position after moving
      }
      
    
      setInputPosition() {
        
        this.field[this.locationY][this.locationX] = pathCharacter; //* positon after user input
          
      }

      findHole() {
        
        for (let y = 0; y < this.field[1].length; y++) {
          for (let x = 0; x < this.field[0].length; x++) {
            if (this.field[y][x] == hole) {
              this.holeLocationX.push(x);
              this.holeLocationY.push(y);
            }
          }
        }
      }
    


      setHat() {
        this.hatPos = this.setPos(this.start)
        this.field[this.hatPos.y][this.hatPos.x] = hat; //^
        
      }
     
     print() {
        clear();
        this.field.forEach(element => console.log(element.join(' ')));
          
      }
     
      getInput() {
        const input = prompt('Which way? (u, d, l, r) ').toUpperCase();

        this.locationYOld = this.locationY; //set old X position to locationXOld to cover up with fieldCharacter
        this.locationXOld = this.locationX; //set old Y position to locationYOld to cover up with fieldCharacter

        //check input : u, d, l, r 
        
        
        if (input == 'U' && this.locationY > 0) {
         
          this.locationY -= 1;
        }

        if (input == 'D' && this.locationY < this.field[1].length -1) {
         
          this.locationY += 1;          
        }

        if (input == 'L' && this.locationX > 0) {
          
          this.locationX -= 1;          
        }
        
        if (input == 'R' && this.locationX < this.field[0].length -1) {
        
          this.locationX += 1;          
        }
        
      }
     
    
     setPos() {
        const pos = {
          x: 0,
          y: 0
        }
      
        pos.x = Math.floor(Math.random() * this.field[0].length);   //x = 10
        pos.y = Math.floor(Math.random() * this.field[1].length);   //y = 10

        return pos;
      }
      
     
} //end of field class


//create an instance of Field Class and call generatorField directly from Class name
const myField = new Field(Field.generateField(10,10,0.2));
myField.runGame();
