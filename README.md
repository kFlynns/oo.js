# oo.js
oo.js JavaScript Library  
https://flynns.me  
Copyright Erik Calov  
Released under the MIT license  

*"Somewhat to implement oo functionality via JS prototyping"*

# Features
- creating instances of "classes"
- automatic creation of getter- and setter methods for properties
- getter and setter can be overwritten as all members
- inheritance of classes
- polymorphism, children can be threaded as it's parent(s)
- automatic collection of all instances in a container
- identifying instances by an automatic id
- create singleton objects
- execute the parents version of overwritten methods on actual context

# Methods of oo.js
- create new class (will be available under oojs.ClassName)  
**oojs.create(string:ClassName, object:members)**

- inherite from parent (will be available under oojs.ClassName)  
**oojs.inherit(oojsObject:parent, string:ClassName, object:members)**

- create singleton object (will be available under oojs.ClassName but already as instance  
**oojs.makeSingleton(string:ClassName, object:members, object:parameter)**

- all objects that was instantiated with new  
**oojs.getInstances()**

- create anonymous instance (will not be tracked by oo.js for regular garbage collector) by passing "anoym: true" in the parameters  
**var anonymInstance = new oojs.Employee({
  anonym: true
});**

# Methods of any oo.js instance
- automatic getter and setter, each property get this  
**instance.getXxx() / .setXxx()**

- execute original methode on parent if it be overwritten  
**instance.execParent(string:methodName, array:params)**

- check if instance is or inherit this class  
**instance.isInstanceOf(string:className)**

- copies all data of given object where the key exists in both  
**instance.copyDataFrom(object:data)**

- remove instance in the oo.js container to be free for garbage collection   
**instance.destroy()**


Basic usage:
============
```
// define the name of the member on window where oojs is stored  
oojsInit('oojs');

// creating a "class" for an Employee  
oojs.create('Employee', {  

  // properties  
  name: null,  
  salary: 0,  
  
  // construtor will be called on new oojs.Employee();  
  __init: function(params) {  
    // automaticly copying date where this and params have same keys  
    this.copyFromData(params);
  },
  
  payRaise: function(amount) {
    this.salary += amount;
  }
  
});

// instantiate an Employee
var bob = new oojs.Employee({
  name: 'Bob Test',
  salary: 3000
});

// call automatic setter
bob.setSalary(2550);
```
