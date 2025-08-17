const { Router } = require("express");
const { contentModel, purchaseModel } = require("./db");
const { userMiddleware } = require("../middlewares/user");

const contentRouter = Router();

contentRouter.post("/purchase", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const contentId = req.body.contentId;

    await purchaseModel.create({
        userId,
        contentId
    });

    res.json({
        msg : "Content bought successfully"
    });
});

contentRouter.get("/preview", async (req, res) => {
    const content = await contentModel.find({});

    res.json({
        content
    })
});

module.exports = {
    contentRouter : contentRouter
};


