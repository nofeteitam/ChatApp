const router = require('express').Router();
const authBl = require('../BL/authBl');

router.post('/register', async (req, res) => {
    console.log("Hi")
    let userData = req.body;
    let response = await authBl.registerUser(userData);
    res.status(201).send(response) 
})

router.post('/login', async (req, res) => {
    let userData = req.body;
    let response = await authBl.logInUser(userData);
    if (typeof response === 'string' && response.includes("Error")) {
        res.status(400).send(response) //400- bad request
    } else {
        req.session.token = response.token;
        //console.log(req.session)
        //console.log(req.session.token)
        res.status(200).send(response) //200- ok
    }
})

module.exports = router;