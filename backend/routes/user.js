const { Router } = require("express");
const { userModel, purchaseModel, contentModel } = require("./db");
const { signupSchema, signinSchema } = require("./validators");
const { validate } = require("../middlewares/validate");
const jwt = require("jsonwebtoken");
const { JWT_USER_SECRET } = require("../config");
const { userMiddleware } = require("../middlewares/user");


const userRouter = Router();

userRouter.post("/signup", validate(signupSchema), async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ msg: "All fields are required!" });
    }

    try {
        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        const newUser = await userModel.create({
            email,
            password,
            firstName,
            lastName
        });

        const token = jwt.sign(
            { id: newUser._id },
            JWT_USER_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            msg: "Account Created Successfully!",
            token: token
        });

    } catch (e) {
        return res.status(500).json({ msg: "Server error during signup." });
    }
});


userRouter.post("/signin", validate(signinSchema), async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExists = await userModel.findOne({
            email: email,
            password: password
        });

        if (userExists) {
            const token = jwt.sign(
                { id: userExists._id },
                JWT_USER_SECRET,
                { expiresIn: "1d" }
            );

            return res.status(200).json({
                msg: "Sign in successful!",
                token: token
            });

        } else {
            return res.status(403).json({
                msg: "Incorrect Credentials!"
            });
        }

    } catch (e) {
        return res.status(500).json({
            msg: "Error during sign in."
        });
    }
});


userRouter.get("/purchases", userMiddleware, async (req, res) => {
    try {
        const purchases = await purchaseModel.find({ userId: req.userId });

        const contentData = await contentModel.find({
            _id: { $in: purchases.map(x => x.contentId) }
        });

        return res.json(contentData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error fetching purchases" });
    }
});

module.exports = {
    userRouter : userRouter
};