// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
    db
        .find()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(err.code).json({ error: "The users information could not be retrieved." });
        })
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db
        .findById(id)
        .then(user => {
            user ?
            res.status(200).json(user)
            : res.status(404).json({ message: "The user with the specified ID does not exist." });
        })
        .catch(err => {
            res.status(err.code).json({ error: "The user information could not be retrieved." });
        })
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db
        .remove(id)
        .then(user => {
            console.log(user);
            user ? res.status(204).end()
            : res.status(404).json({ message: "The user with the specified ID does not exist." });
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed" });
        })
});

server.post('/api/users', (req, res) => {
    const user = req.body;

    if(user.name && user.bio ){
        db
        .insert(user)
        .then(result => {
            db
            .findById(result.id)
            .then(user => res.status(201).json(user))         
        })
        .catch(({ code, message}) => {
            res.status(code).json({ error: "There was an error while saving the user to the database",
             message });
        })
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio"});
    }
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    db
        .update(id, changes)
        .then(user => {
            if(user){
                if(changes.name && changes.bio){                      
                        db
                            .findById(id)
                            .then(user => res.status(200).json(user))
                } else{
                    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
                } 
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch()
});

server.listen(4000, () => {
    console.log('\n*** Running on port 4000 ***\n');
});