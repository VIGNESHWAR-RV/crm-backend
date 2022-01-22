import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
// import {Auth} from "two-step-auth";
import { Admin_auth, Manager_auth, Employee_auth, User_auth } from "./middleware/auth.js"
import nodemailer from 'nodemailer';
dotenv.config();

const app = express();

const port = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongo is connected");
    return client;
}
const client = await createConnection();



app.use(express.json()); //middleWare
app.use(cors());

// //password generation
// async function genPassword(password) {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
// }


    //home test
app.get("/", (req, res) => {
    res.send("hello, 🌍20000")
});


 // forgot password
app.post("/forgotPassword", async (req, res) => {
    const new_password = req.body.newPassword;
    const user_email = req.body.email;

    if(new_password){   

      async function genPassword(password) {
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password, salt);
       return hashedPassword;
    }

    const password = await genPassword(new_password);
    const passwordUpdate = await client.db("users")
                                           .collection("employees")
                                           .updateOne({email:user_email},{$set:{password:password}});

     return res.send(passwordUpdate);
    }

    const existingUser = await client.db("userDB")
    .collection("employees")
    .findOne({ email:user_email });

    if(!existingUser){
        return res.status(400).send("there is no user account such mail buddy");
    }

    const transport = nodemailer.createTransport({

        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.TOKEN_URI
        }
    });

    const otp_number = Math.floor(Math.random() * 1000000);

    var mailOptions = {
        from: '"RV`s CRM TEAM" <noreplycrmbyrv@gmail.com>',
        to: user_email,
        subject: 'Mail verification for password reset',
        text: 'Hey there, it`s our first message sent with Nodemailer ',
        html: `<b>Hii user</b>The verification code for resetting password is <b>${otp_number}</b><br>`
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        return res.send({message:"frontEnd dude!!!, I sent the mail.Alert him to check the inbox and verify the otp",
                         otp:otp_number,
                        })
    });

});


//login

app.post("/login", async (req, res) => {
    const login = req.body;

    const existingUser = await client.db("userDB")
        .collection("employees")
        .findOne({ name: login.name });

    if (!existingUser) {
        return res.status(400).send("invalid credentials")
    }

    const role = existingUser.role;
    const password = existingUser.password;

    const passwordMatch = await bcrypt.compare(login.password, password);

    if (!passwordMatch) {
        return res.status(400).send("invalid credentials");
    }

    function randomStr(){
        const arr = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        let ans = '';
        for (var i = 10; i > 0; i--) {
            ans += 
              arr[Math.floor(Math.random() * arr.length)];
        }
        return ans;
      }
      
    const encryption = randomStr();

    if (role === "admin") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_ADMIN_KEY);
        return res.send({ "userId": existingUser._id,"encryption":encryption, "role": role, "token": token });
    }
    if (role === "manager") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_MANAGER_KEY);
        return res.send({ "userId": existingUser._id,"encryption":encryption, "role": role, "token": token });
    }
    if (role === "employee") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_EMPLOYEE_KEY);
        return res.send({ "userId": existingUser._id,"encryption":encryption, "role": role, "token": token });
    }
    if (role === "user") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_USER_KEY);
        return res.send({ "userId": existingUser._id,"encryption":encryption, "role": role, "token": token });
    }


    return res.status(400).send("user role is not defined");
});

// sign-up
app.post("/Sign-Up", async (req, resp) => {
    const employee = req.body;

    const existingUser = await client.db("userDB")
        .collection("employees")
        .findOne({ name: employee.name });


    if (existingUser) {
        return resp.status(400).send("username already exists");
    }
    if (employee.check === 1) {
        return resp.status(200).send("username available");
    }


    async function genPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    employee.password = await genPassword(employee.password);

    const result = await client.db("userDB")
        .collection("employees")
        .insertOne(employee);

    resp.send(result);
})

//add - lead
app.post("/addLeads", Manager_auth, async (req, res) => {
    const usersLead = req.body;
    const result = await client.db("userDB")
        .collection("users")
        .insertMany(usersLead);

    res.send(result);
    console.log("addedd");
});

//delete all - leads
app.delete("/deleteLeads/all", Admin_auth, async (req, res) => {
    const result = await client.db("userDB").collection("users").deleteMany({});
    res.send(result);
})

//delete - lead
app.delete("/deleteLeads/:id", Admin_auth, async (req, res) => {
    const id = req.id;
    console.log(id);
    const result = await client.db("userDB").collection("users").deleteOne({ id: id });
    res.send(result);
})

//get lead
app.get("/leads/:id", Employee_auth, async (req, res) => {
    console.log(req.params.id);
    const result = await client.db("userDB")
        .collection("users")
        .findOne({ id: req.params.id });
    res.send(result);
});

//get all and filtered leads
app.get("/leads", User_auth, async (req, res) => {
    const queries = req.query;
    if (queries.rating) {
        queries.rating = +queries.rating;
    }
    let filteredMovies = await client.db("userDB").collection("users").find(queries).toArray();
    res.send(filteredMovies);
})

//edit a lead
app.put(`/lead/:id`, Manager_auth, async (req, res) => {
    const id = req.params.id;
    const EditMovie = request.body;
    const result = await client.db("userDB")
        .collection("users")
        .updateOne({ id: id }, { $set: EditMovie });
    res.send(result);
    console.log("edited");
});


app.listen(port, console.log("server started at port " + port));