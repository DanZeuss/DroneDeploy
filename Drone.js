// Below is a drone object with six methods.
// Each method takes a callback and after some amount of time will execute that callback 
// For ease of testing, it will also console.log a value.

// At the bottom of the page the expected output is logged.
// We invoke the chained call of the drone object. 
// However the drone object does not yet have a chained api.

// Add a chained api to the drone object by only modifying the code in the middle of the page.

// A good answer should include the following criteria.
// 1. Code was only added between the below comments.
// 2. Each method in the chain executes only after the previous method has resolved
// 3. Your solution should be flexible to rearranging the methods or changing the timeouts.
// 4. Your solution should not change the behavior/side affects of the original methods. 

// You should assume that you don't know how the methods on the Drone object are implemented. 
// Only that they may or may not be asynchronous and and that they take a callback
// that will be called when the action is completed.

function Drone(){};

Drone.prototype.takeoff = function takeoff(callback) {
 setTimeout(function() {
   callback()
   console.log('Took off');
 }, 600);
};

Drone.prototype.turnOnCamera = function turnOnCamera(callback) {
 setTimeout(function() {
   callback()
   console.log('Camera turned on');
 }, 1000);
};

Drone.prototype.pointDownGimbal = function pointDownGimbal(callback) {
 setTimeout(function() {
   callback()
   console.log('Gimbal pointing down');
 }, 750);
};

Drone.prototype.flyToMission = function FlyToMission(callback) {
 setTimeout(function() {
   callback()
   console.log('Flown to mission');
 }, 2000);
};

Drone.prototype.takePhoto = function takePhoto(callback) {
 setTimeout(function() {
   callback()
   console.log('Photo taken');
 }, 500);
};

Drone.prototype.land = function land(callback) {
 setTimeout(function() {
   callback()
   console.log('Landed');
 }, 3000);
};
// DON'T MODIFY ANYTHING ABOVE HERE
// START ADD YOUR CODE HERE

// ObjectWrapper is an object that works with the chainned concept as well. It's responsible to collect all signatures(functions)
// of a prototype and wrap this in an way that it will ran the current function implemented in captured in the Prototype, injecting
// the method that is going to be our callback.
// The callback is going to be the responsible to trigger the next task according the sequence defined in the structure of 
// the Prototype.
const ObjectWrapper = function (objectWrapped, prototype) {
  // store the object that was instanced
  this.objectWrapped = objectWrapped;
  // store the prototype of the object
  this.prot = prototype;
  // store the methods that are going to be called;
  // once we have the list of methods, we could also rearrange it
  this.listMethods = [];
  
  
  // function that reflect the prototype getting and replacing its methods to add each method in the listMethods and passing
  // the callBack (callNext) that will be triggered when the first method is called.
  this.addMethods = function(methodToCall) {
    let self = this;
    Object.keys(self.prot).forEach((func, key) => {
      // for each method, replace it by a new function
      self.objectWrapped[func] = function() {
        // that adds a function to the list
        self.listMethods.push(function() {
          // that calls the method that is being replaced
          self.prot[func](function () {
            // passing the callback (callNext) as reference
            self.callNext(key + 1)
          })
        });
        
        // when the Prototype was mapped
        if (self.listMethods.length == Object.keys(self.prot).length)
          // call a specific method or the first one of the list.
          self.listMethods[methodToCall || 0]();
        
        // return the object instanced to be chained
        return self.objectWrapped;          
      }
    });

    // chain
    return this;
  }
  
  
  // function responsible to call a specific task or the nextone till reach the end of the list.
  this.callNext = function(key) {
    // if the list is empty and the user has defined a key.. it means that he want to start by a specific task/method
    if (this.listMethods.length == 0)
      // add the methods reflected from the object specifying which method should be triggered first
      this.addMethods(key);
    
    // get the method by a specific key (from the list)
    const func = this.listMethods[key];
    // the func exist? (in the list)
    if (func)
      // call it passing the callNext as callback
      func(this.callNext);
    
    return this;
  }
}

var drone = new Drone();
var wrapper = new ObjectWrapper(drone, Drone.prototype)
                    .addMethods() // capture the methods 
                    .callNext(0); // specify which one should be started first;

// END ADD YOUR CODE HERE

//DONT MODIFY ANYTHING BELOW HERE
console.log("Expected Output:")
console.log("Took off");
console.log("Camera turned on");
console.log("Gimbal pointing down");
console.log("Flown to mission");
console.log("Photo taken");
console.log("Landed");

console.log("\n\nActual Output:")
drone.takeoff().turnOnCamera().pointDownGimbal().flyToMission().takePhoto().land();