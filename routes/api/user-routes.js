// STEP 1 -> five routes that will work with the User model to perform CRUD operations.

const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {

    // Access our User model and run .findAll() method)
    User.findAll({
        // This object bellow is passed into the findAll() method. Has a Key (attributes) and instructs the query to exclude the password column. It is in an array if we need to pass more instruction objects
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)

    })
    

});

// GET /api/users/1
router.get('/:id', (req, res) => {

    // Access our User model and run .findOne() method), indicating that we only want one piece of data back.
    User.findOne({
        attributes: { exclude: ['password'] },

        // - findOne() method, lets us pass one argument, in this case the where: option to indicate we want to find
        // a user where it (id) value equales whatever (req.params.id) is ... req.params.id = the (id) from /api/user/:id 
        where: {
          id: req.params.id
        }
    })
    .then(dbUserData => {

        // -There's the possibility that we could accidentally search for a user with a nonexistent id value.
        //  Therefore, if the .then() method returns nothing from the query, we send a 404 status back to the client to indicate everything's okay and they just asked for the wrong piece of data.
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {

    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // - This .update() method combines the parameters for creating data and looking up data. 
    //   We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used.
    //   Also, if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    User.update(req.body, {

        //Needed to be able to use bycrypt hook... passed in req.body instead to only update what's passed through
        individualHooks: true,
    
        where: {
          id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
    
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {

    User.destroy({
        where: {
          id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

});


// POST ROUTE TO VERIFY USER IDENTITY BASED ON USERNAME AND EMAIL , this route will be http://localhost:3001/api/users/login
router.post('/login', (req, res) => {
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}

    // 1) queried the User table using the findOne() method for the email entered by the user and assigned it to req.body.email.
    User.findOne({
        where: {
          email: req.body.email
        }
    })
    .then(dbUserData => {
        // 2) If the user with that email was not found, a message is sent back as a response to the client. 
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
        return;
        }
        // 3) However, if the email was found in the database, the next step will be to verify the user's identity by matching the password from the user and the hashed password in the database.
        

        // Verify user - the dbuserdata from the findOne query is used with the checkpassword instance method wich has a param of the supplied password and returns to const validPassword a boolean for a comparison if statement
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        res.json({ user: dbUserData, message: 'You are now logged in!' });

    })
  
})



module.exports = router;


//// NOTES -> 
 
//// 1) The .findAll() method lets us query all of the users from the user table in the database, and is the JavaScript equivalent of the following SQL query: (SELECT * FROM users;) 

//// 2)

//// 1)

//// 1)