const router = require("express").Router();
const usersBl = require("../BL/usersBl");

//GET all users
router.get("/", async (req, res) => {
    const response = await usersBl.getUsers();
    res.send(response);
});

module.exports = router;
