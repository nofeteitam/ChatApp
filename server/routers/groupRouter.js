const router = require("express").Router();
const messagesBl = require("../BL/groupsBl");

// POST new group
router.post("/", async (req, res) => {
    const { name, members } = req.body;
    let response = await messagesBl.createGroup(name, members);
    if (typeof response != 'string') {
        res.status(200).send(response)
    } else {
        res.status(400).send(response)
    }
});

// GET all groups
router.get("/", async (req, res) => {
    let response = await messagesBl.getAllGroups();
    if (typeof response != 'string') {
        res.status(200).json(response);
    } else {
        res.status(400).send(response)
    }
});

// GET group history
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let response = await messagesBl.getGroupHistory(id);
    if (typeof response != 'string') {
        res.status(200).send(response)
    } else {
        res.status(400).send(response)
    }
});

module.exports = router;

