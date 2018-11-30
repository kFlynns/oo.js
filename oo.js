/*!
 * oo.js JavaScript Library
 * https://flynns.me
 *
 * Copyright Erik Calov
 * Released under the MIT license
 * 
 */
"use strict";
/*
 *  init the oojs-object under given identifier 'global'
 */
function oojsInit(global) {
    
    window[global] = window[global] || {

        /* holding all instances of objects */
        instances: {},
        
        /* create a new instantiable class */
        create: function(className, members, Parent) {
            
            let newClass = (function(className) {
                
                let objectId = 0;
                
                /* constructor calls init if possible */
                return function(params) {
                    
                    if(typeof params === 'undefined')
                    {
                        params = {};
                    }
                    
                    this.className = className;

                    if(typeof this.__init !== 'undefined')
                    {
                        this.__init(
                            params//(typeof params !== 'undefined') ? params : null
                        );
                    }

                    if(!params.anonym)
                    {
                        this.objectId = className + "_" + (objectId++).toString();
                        window[global].instances[this.objectId] = this;
                    }
                    
                };
                
            })(className);

            /* inheriting if Parent is given */
            if(typeof Parent !== 'undefined')
            {
                
                newClass.prototype = new Parent({
                    anonym: true
                });
                
                /* original Parent for exucting parent-methods on actuel object */
                newClass.prototype.__parent = new Parent({
                    anonym: true
                });
                
                newClass.prototype.execParent = function(methode, args) {
                    this.__parent[methode].apply(this, args);                    
                };
                
            }

            /* return parent */
            newClass.prototype.getParent = function() {
                return (this.__parent) ? this.__parent : {};
            };

            /* return true if actual object or it's parents are an instance of the given class name  */
            newClass.prototype.isInstanceOf = function(className) {
                
                if(this.className === className)
                {
                    return true;
                }
                
                let parent = this.__parent;
                
                while(typeof parent !== 'undefined')
                {
                    if(parent.className === className)
                    {
                        return true;
                    }
                    parent = parent.__parent;
                }

                return false;
            };

            /* copies all properties of an object in this instance if properties are defined */
            newClass.prototype.copyDataFrom = function(params)
            {

                if(!params) return;
                
                for(let property in params)
                {
                    if(typeof this[property] !== 'undefined')
                    {
                        this[property] = params[property];
                    }
                }
            };

            /*  delete registered instance */
            newClass.prototype.destroy = function() {

                if(window[global].instances[this.objectId].__parent)
                {
                    window[global].instances[this.objectId].__parent = null;
                }

                window[global].instances[this.objectId] = null;
                delete window[global].instances[this.objectId];
                 
                for(let member in this)
                {
                    this[member] = null;
                }
                
                window.setTimeout((function(toDelete) {
                    return function() {
                        toDelete = null;
                    };
                    
                })(this), 1);
                
            };
            
            /* fill the members, setter and getter in the prototype */
            for(let member in members)
            {
                newClass.prototype[member] = members[member];

                if(typeof newClass.prototype[member] !== 'function')
                {

                    let property = member
                        .charAt(0)
                        .toUpperCase() +
                        member.slice(1);
                    
                    newClass.prototype['set' + property] = (function() {
                        let link = member;
                        return function(value) {
                            this[link] = value;
                        };
                    })();

                    newClass.prototype['get' + property] = (function() {
                        let link = member;
                        return function() {
                            return this[link];
                        };
                    })();
                    
                }
                 
            }
            
            this[className] = newClass;

        },
        
        /* create a new instantiable class and inherit from a given parent */
        inherit: function(Parent, className, members)
        {
            this.new(className, members, Parent);
        },

        /* create a new instance of a class and put it on the global identifier */
        makeSingleton: function(className, members, params) {
            this.new(className, members);
            this[className] = new this[className](params);
        },

        /* return all instances that was created */
        getInstances: function() {
            return this.instances;
        }
        
    };
}