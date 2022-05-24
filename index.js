import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { Admin_auth, teamLead_auth, Employee_auth,Check_auth} from "./middleware/auth.js"
import nodemailer from 'nodemailer';
import {EmployeeRoutes} from "./Routes/EmployeeRoutes/EmployeeRoutes.js";
import {TeamLeadRoutes} from "./Routes/TeamLeadRoutes/TeamLeadRoutes.js";
import {AdminRoutes} from "./Routes/AdminRoutes/AdminRoutes.js";

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
export const client = await createConnection();



app.use(express.json()); //middleWare
app.use(cors());

// //password generation
// async function genPassword(password) {
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     return hashedPassword;
// }

//login
app.post("/login", async (req, res) => {

 try{
    const loginUser = req.body;

    const existingUser = await client.db("CRM")
                                     .collection("accounts")
                                     .findOne({ email: loginUser.email });

    if (!existingUser) {
        return res.status(404).send({message:"invalid credentials"})
    }

    const role = existingUser.role;
    const password = existingUser.password;

    const passwordMatch = await bcrypt.compare(loginUser.password, password);

    if (!passwordMatch) {
        return res.status(406).send({message:"invalid credentials"});
    }

    // function randomStr(){
    //     const arr = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    //     let ans = '';
    //     for (var i = 10; i > 0; i--) {
    //         ans += 
    //           arr[Math.floor(Math.random() * arr.length)];
    //     }
    //     return ans;
    //   }
      
    // const encryption = randomStr();



    if (role === "admin") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_ADMIN_KEY);
        return res.send({ "role": role,name:existingUser.userName, "token": token });
    }
    else if(role === "manager") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_MANAGER_KEY);
        return res.send({ "role": role,name:existingUser.userName, "token": token });
    }
    else if(role === "employee") {
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_EMPLOYEE_KEY);
        return res.send({ "role": role,name:existingUser.userName, "token": token });
    }else{ 
        return res.status(404).send("user role is not defined");
    }
 }catch(err){
     console.log("login route",err.message);
     return res.status(500).send({message:"server error,try again later"});
 }

});

 //loggedInCheck
app.post("/loggedInCheck",Check_auth,async (req,res)=>{

  try{
    const {loggedInUser} = req.params;

    if(loggedInUser){
        
      return res.send({name:loggedInUser.firstName,role:loggedInUser.role});
    }
  }catch(err){
      console.log("loggedInCheck",err.message);
      return res.status(500).send({message:"server error"});
  }

});

 // sign-up
app.post("/signup", async (req, res) => {

  try{
    const {firstName,lastName,email,company,password,confirm_password,terms_and_conditions} = req.body;

    const regex = {name:"^[a-zA-Z]{2,}$",
                   password:"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$",
                //    userName:"^[a-zA-Z0-9@#]{4,16}$",
                   company:`^[a-zA-Z0-9.'",@ ()-_]{1,}$`,
                   email:"^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
                  };

    if(!new RegExp(regex.name).test(firstName)){
        return res.status(404).send({message:"Valid First Name is required",field:"firstName"});
    }
    if(!new RegExp(regex.name).test(lastName)){
        return res.status(404).send({message:"Valid Last Name is required",field:"lastName"});
    }
    if(!new RegExp(regex.email).test(email)){
        return res.status(404).send({message:"Valid Email is required",field:"email"});
    }
    if(!new RegExp(regex.company).test(company)){
        return res.status(404).send({message:"Company Name is required",field:"company"});
    }
    if(!new RegExp(regex.password).test(password)){
        return res.status(404).send({message:"Valid Password is required",field:"password"});
    }
    if(!new RegExp(regex.password).test(confirm_password)){
        return res.status(404).send({message:"Passwords Mis-Matched",field:"confirm_password"});
    }
    if(terms_and_conditions !== true ){
        return res.status(404).send({message:"You should Agree to our Terms and Conditions",field:"terms_and_conditions"});
    }
    

    const newUser = {firstName,lastName,email,company,password,terms_and_conditions};


        //--- check for existing mail -------------------------
       const existingMail = await client.db("CRM")
                                        .collection("accounts")
                                        .findOne({ email: newUser.email});

       if(existingMail){
           return res.status(400).send({message:"email already exists",field:"email"}); 
       }
        //-------------------------------------------------------

         //--- check for existing company -------------------------
       const existingCompany = await client.db("CRM")
                                        .collection("accounts")
                                        .findOne({ company: newUser.company});

       if(existingCompany){
           return res.status(400).send({message:"Only your company's ADMIN can make you as ADMIN",field:"company"}); 
       }
        //-------------------------------------------------------

        //--- hashing  password --------------------------------     
        newUser.password = await genPassword(newUser.password);
        //---------------------------------------------------------

        //--- createUserName --------------------------------------
        const userName = await createUserName(newUser);
        //---------------------------------------------------------
     

    if(userName){
        const joinedDate = new Date(Date.now()).toDateString().split(" ").slice(1,4).join("/");
        //--- adding new user -------------------------------------
        const result = await client.db("CRM")
                                   .collection("accounts")
                                   .insertOne({...newUser,role:"admin",userName,joinedDate});
    
        if(result){
           return  res.send(result);
        }else{
           return res.status(500).send({message:"server error,please try again later"});
        }
        //----------------------------------------------------------
    }else{
        return res.status(500).send({message:"server error,please try again later"});
    }

  }catch(err){
      console.log("signup error",err.message);
      return res.status(500).send({message:"server error,try again later"});
  }
})

 // forgot password
app.post("/forgotPassword", async (req, res) => {
    
    const {role,userName,email} = req.body;


    // if(new_password){   

    //   async function genPassword(password) {
    //    const salt = await bcrypt.genSalt(10);
    //    const hashedPassword = await bcrypt.hash(password, salt);
    //    return hashedPassword;
    //   }

    // const password = await genPassword(new_password);
    // const passwordUpdate = await client.db("userDB")
    //                                    .collection("employees")
    //                                    .updateOne({email:user_email},{$set:{password:password}});

    //  if(passwordUpdate){
    // // console.log("password updated");
    //  return res.send(passwordUpdate);
    //  }
    // // console.log("password couldnt update");
    //  return res.status(400).send("couldnt update");
    
    // }

    let existingUser;

    if(role === "admin"){
          existingUser = await client.db("CRM")
                                     .collection("admins")
                                     .findOne({ userName:userName,email:email });
    }
    if(role === "manager"){
        existingUser = await client.db("CRM")
                                   .collection("managers")
                                   .findOne({ userName:userName,email:email });
    }
    if(role === "employee"){
        existingUser = await client.db("CRM")
                                   .collection("employees")
                                   .findOne({ userName:userName,email:email });
    }

    if(!existingUser){
        return res.status(400).send({email:email ,userName:userName});
    }else{
        await otpMailer(email,userName,res);
    }
});

 // password - reset have to work
app.post("/passwordReset",async(req,res)=>{

})

app.use("/employee",Employee_auth,EmployeeRoutes);

app.use("/teamLead",teamLead_auth,TeamLeadRoutes);

app.use("/admin",AdminRoutes);

app.listen(port, console.log("server started at port " + port));

async function otpMailer(email,userName, res) {
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

    const passwordResetPage = `https://localhost:3000/password-reset/`

    var mailOptions = {
        from: '"RV`s CRM TEAM" <noreplycrmbyrv@gmail.com>',
        to: email,
        subject: 'OTP FOR MAIL CONFIRMATION',
        html: `<b>Dear CRM User</b>,<br/><br/> The password reset link is given below.<br/><b>${passwordResetPage}</b><br/>
               <p>PLEASE KEEP YOUR PASSWORD SAFE AND SECURE !!!</p><br/>
               <img style="width:200px;height:200px;object-fit:contain;" src="https://www.puffin.com/imgs/img_secure_security.gif"></img>`
    };

    transport.sendMail(mailOptions,  async (error) => {
        if (error) {
            return res.status(400).send({email,userName});
        }
        return res.send({email,userName});
    });
}

async function genPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};
// console.log(Date.now());
// console.log(Date.now().toString().slice(7,13));

async function createUserName(newUser){
    let userName = `${newUser.firstName[0]}${newUser.lastName[0]}-${Date.now().toString().slice(7,13)}`;
    const isUserExist = await client.db("CRM")
                                    .collection("accounts")
                                    .findOne({userName});

    if(isUserExist){
       userName = await createUserName(newUser);
    }else{
       return userName;
    }
}

// console.log(Date.parse(new Date(Date.now())),Date.now(),new Date("2022-02-06"));
// console.log(new Date().toDateString().split(" "));

// export function giveDate(date) {
//     let ActualDate = new Date(date).toDateString().split(" ");
//     ActualDate.shift();
//     ActualDate.pop();
//     return ActualDate.reverse().join(" ");
//   }

// console.log(Date.parse(new Date("2022-05-16")));
// console.log(1000*60*60*24);
// console.log(Date.parse(new Date("2022-05-15")));
// console.log(new Date("2022-05-15"));
// console.log();
// console.log(new Date(new Date()- (-5.5*(1000*60*60))) -  (new Date("2022-05-15")));
// console.log(Date.parse(new Date("2022-05-16")) - (new Date()- (-5.5*(1000*60*60))));

// console.log(new Date());
// console.log(giveDate("2022-05-15"));

// export function giveDate(date,withYear) {
//     let ActualDate = new Date(date).toDateString().split(" ");
//     ActualDate.shift();
//     if(withYear === "withYear"){
//         return ActualDate.join("/");
//     }
//     ActualDate.pop();
//     return ActualDate.reverse().join(" ");
//   }

// console.log(giveDate("2022-05-15T18:30:00.000Z"));

// export function dateColor(date){

//     let difference = new Date(date) -  new Date();
    
//     if(difference <= (1000*60*60*24)){
//         return "error"
//     }
//     else if (difference <= (1000*60*60*24*3)){
//         return "warning";
//     }
//     else{
//         return "primary";
//     }

// }

// console.log(giveDate(new Date(),"withYear"));

// console.log(new Date("2022-05-15T18:30:00.000Z"), new Date());
// console.log(dateColor("2022-05-15T18:30:00.000Z"));