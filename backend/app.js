const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { userRouter } = require("./routes/user");
const { contentRouter } = require("./routes/content");
const { adminRouter } = require("./routes/admin");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    methods : ["GET", "POST", "DELETE", "PUT"],
    credentials: true 
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/admin", adminRouter);

// when using different route syntax
// userRouter(app);
// contentRouter(app); 

async function main() {
    await mongoose.connect("mongodb+srv://Kutt:Nalla321@cluster0.ravbc.mongodb.net/digital-store");
    app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
    });
}

main();


