// STEP 1 -> First, we imported the Model class and DataTypes object from Sequelize.
//////////// This Model class is what we create our own models from using the extends keyword so User inherits all of the functionality the Model class has.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// create our User model
class User extends Model {}

// STEP 3 -> Import ByCript to hash password
const bcrypt = require('bcrypt');

// STEP 2 -> Once we create the User class, we use the .init() method to initialize the model's data and configuration, passing in two objects as arguments. 
//////////// The first object will define the columns and data types for those columns. The second object it accepts configures certain options for the table.

// define table columns and configuration
User.init(
  { 
    //OBJECT 1 -> TABLE COLUMN DEFINITIONS GO HERE

    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
          isEmail: true
        }
    },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        // this means the password must be at least four characters long
        len: [4]
        }
    }

  },
  {
    //OBJECT 2 -> TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

    // To use hooks, sequalize asks to pass another object labeled hooks. This hook will be the one of bycrypt to hash passwords
    hooks: { 
        // set up beforeCreate lifecycle "hook" functionality
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        // set up beforeUpdate lifecycle "hook" functionality
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;


//// NOTES -> 
 
//// 1) Each column's definition gets its own type definition, in which we use the imported Sequelize DataTypes object to define what type of data it will be.  
    

//// 2) Sequelize's built-in validators are another great feature. We can use them to ensure any email data follows the pattern of an email address 
////    (i.e., <string>@<string>.<string>) so no one can give us incorrect data. There are a lot of prebuilt validators we can use from Sequelize, but you can also make your own,


//// 3) First hook object is the same as second one

        // hooks: { 
        //     // set up beforeCreate lifecycle "hook" functionality
        //     beforeCreate(userData) {
        //         return bcrypt.hash(userData.password, 10).then(newUserData => {
        //         return newUserData
        //         });
        //     }
        // }


        // hooks: { 
        //     // set up beforeCreate lifecycle "hook" functionality
        //     async beforeCreate(newUserData) {
        //         newUserData.password = await bcrypt.hash(newUserData.password, 10);
        //         return newUserData;
        //     }
        // }

        // The async keyword is used as a prefix to the function that contains the asynchronous function. 
        //await can be used to prefix the async function, which will then gracefully assign the value from the response to the newUserData's password property. 
        //The newUserData is then returned to the application with the hashed password.
