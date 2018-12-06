/*!
 * oo.js JavaScript Library
 * https://flynns.me
 *
 * Copyright Erik Calov
 * Released under the MIT license
 *
 */
"use strict";
/**
 * init the oojs-object under given identifier 'global'
 * @param {string} global
 */
function oojsInit(global) {

    window[global] = window[global] || {

        /* holding all instances of objects */
        instances: {},

        /**
         * create a new instantiable class
         * @param {string} className
         * @param {Object} members
         * @param {Function} Parent
         */
        create: function(className, members, Parent) {

            let newClass = (function(className) {

                let objectId = 0;

                /* constructor calls init if possible */
                return function(params) {

                    if(typeof params === 'undefined') params = {};

                    this.className = className;
                    this.objectId = className + '_' + (objectId++).toString();

                    if(typeof this.__init !== 'undefined' && !params.isParent)
                    {
                        this.__init(
                            params
                        );
                    }

                    /* put instance in container */
                    if(!params.anonym)
                    {

                        window[global].instances[className][this.objectId] = this;
                        /* ref for find object as parent */
                        if(typeof this.__parent !== 'undefined')
                        {
                            window[global].instances[this.__parent.className][this.objectId] = this;
                        }
                    }

                };

            })(className);


            /* inheriting if Parent is given */
            if(typeof Parent !== 'undefined')
            {

                /* inherit */
                newClass.prototype = new Parent({
                    anonym: true,
                    isParent: true
                });

                /* original Parent for exucting parent-methods on actual object */
                newClass.prototype.__parent = new Parent({
                    anonym: true,
                    isParent: true
                });

                /* for executing parents version of a methode at tha actual instance */
                newClass.prototype.execParent = function(methode, args) {
                    this.__parent[methode].apply(this, args);
                };

                /* return parent */
                newClass.prototype.getParent = function() {
                    return this.__parent;
                };
            }

            /**
             * return true if actual object or it's parents are an instance of the given class name
             * @param {string} className
             * @returns {boolean}
             */
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

            /**
             * copies all properties of an object in this instance if properties are defined
             * @param {Object} params
             */
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

            /**
             * delete registered instance
             */
            newClass.prototype.destroy = function() {

                window[global].instances[this.className][this.objectId] = null;
                delete window[global].instances[this.className][this.objectId];

                if(typeof this.__parent !== 'undefined')
                {
                    window[global].instances[this.__parent.className][this.objectId] = null;
                    delete window[global].instances[this.__parent.className][this.objectId];
                }

                for(let member in this)
                {
                    this[member] = null;
                }

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

                    newClass.prototype['set' + property] = (function(member) {
                        return function(value) {
                            this[member] = value;
                        };
                    })(member);

                    newClass.prototype['get' + property] = (function() {
                        return function() {
                            return this[member];
                        };
                    })(member);

                }

            }

            // save
            this[className] = newClass;


            /* create empty container */
            if(typeof this.instances[className] === 'undefined')
            {
                this.instances[className] = {};
            }

            /* getter for class container */
            if(typeof this['get' + className + 's'] === 'undefined')
            {
                this['get' + className + 's'] = (function(className) {
                    return function() {
                        return this.instances[className];
                    };
                })(className);
            }

        },

        /**
         * iterate over container for a specific class
         * @param {string} className
         * @param {Function} callback
         * @param {Object} context
         */
        each: function(className, callback, context)
        {
            for(let objectId in this.instances[className])
            {
                if(context)
                {
                    callback.bind(context)(this.instances[className][objectId]);
                    continue;
                }
                callback(this.instances[className][objectId]);
            }
        },

        /**
         * iterate over container for a specific class
         * @param {string} className
         * @param {Object} filter
         * @param {Function} callback
         * @param {Object} context
         */
        filter: function(className, filter, callback, context)
        {
            for(let objectId in this.instances[className])
            {

                let matchFilter = true;
                for(let property in filter)
                {
                    if(this.instances[className][objectId][property] !== filter[property])
                    {
                        matchFilter = false;
                    }
                }

                if(!matchFilter)
                {
                    continue;
                }

                if(context)
                {
                    callback.bind(context)(this.instances[className][objectId]);
                    continue;
                }
                callback(this.instances[className][objectId]);
            }
        },

        /**
         * create a new instantiable class and inherit from a given parent
         * @param {Function} Parent
         * @param {string} className
         * @param {Object} members
         */
        inherit: function(Parent, className, members)
        {
            this.create(className, members, Parent);
        },

        /**
         * create a new instance of a class and put it on the global identifier
         * @param {string} className
         * @param {Object} members
         * @param {Object} params
         */
        makeSingleton: function(className, members, params) {
            this.create(className, members);
            this[className] = new this[className](params);
        },

        /**
         * return all instances that was created
         * @returns {instances|{}}
         */
        getInstances: function() {
            return this.instances;
        },

        /**
         * return all instances that was created as one list
         * @returns {}
         */
        getHydratedInstances: function() {

            let list = {};
            for(let className in this.instances)
            {
                for(let objectId in this.instances[className])
                {
                    list[objectId] = this.instances[className][objectId];
                }
            }
            return list;
        }

    };
}