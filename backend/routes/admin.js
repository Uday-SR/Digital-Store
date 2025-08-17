const { Router } = require("express");
const { adminModel, contentModel } = require("./db");
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_SECRET } = require("../config");
const { adminMiddleware } = require("../middlewares/admin");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
    const { email, password, firstName, lastName} = req.body;
    //zod validation
    //bcrypt hashing

    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ msg: "All fields are required!" });
    };

    try {
        const adminExists = await adminModel.findOne({ email });

        if(adminExists) {
            return res.status(400).json({
                msg : "User already exist!"
            })
        };

        const newAdmin = await adminModel.create({
            email : email,
            password : password,
            firstName : firstName,
            lastName : lastName
        });

        const token = jwt.sign(
            { id: newAdmin._id },
            JWT_ADMIN_SECRET,
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

adminRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminExists = await adminModel.findOne({
            email : email,
            password : password
        });

        if(adminExists) {
            const token = jwt.sign({
                id : adminExists._id
            }, JWT_ADMIN_SECRET);

            //do cookie logic
            return res.status(200).json({
                msg: "Sign in successful!",
                token: token
            });

        } else {
            res.status(403).json({
                msg : "Incorrect Credentials"
            });
        }; 

    } catch (e) {
        return res.status(400).json({
            msg : "Error finding!!!"
        });
    }       
 
});

adminRouter.post("/content", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;

    const  { title, description, imageUrl, price } = req.body;

    const content = await contentModel.create({
        title : title,
        description : description,
        imageUrl : imageUrl,
        price : price,
        creatorId : adminId
    });

    res.json({msg : "content created", contentId : content._id});
});

adminRouter.put("/content", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;

    const  { title, description, imageUrl, price, courseId } = req.body;

    const content = await contentModel.findOneAndUpdate({
        _id : courseId,
        creatorId : adminId
    }, {
        title : title,
        description : description,
        imageUrl : imageUrl,
        price : price,        
    });

    res.json({
        msg : "Content Updated!"
    })
});

adminRouter.get("/content/bulk", adminMiddleware, async (req, res) => {
    const adminId = req.adminId; 

    try {
        const content = await contentModel.find({ creatorId: adminId });
        res.json({ content });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching content" });
    }
});


module.exports = {
    adminRouter : adminRouter
};