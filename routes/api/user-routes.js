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

module.exports = router;


//// NOTES -> 
 
//// 1) The .findAll() method lets us query all of the users from the user table in the database, and is the JavaScript equivalent of the following SQL query: (SELECT * FROM users;) 

//// 2)

//// 1)

//// 1)