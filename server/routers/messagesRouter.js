const router = require("express").Router();
const messagesBl = require("../BL/messagesBl");

//GET chat history
router.get("/:u1/:u2", async (req, res) => {
    const { u1, u2 } = req.params;
    const response = await messagesBl.getChatHistory(u1, u2);
    res.send(response);
});

module.exports = router;
