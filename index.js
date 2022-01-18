import express from "express";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Admin_auth,Manager_auth,Employee_auth} from "./middleware/auth.js"

dotenv.config();

const app = express();

const port = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("mongo is connected");
    return client;
}
const client = await createConnection();



app.use(express.json()); //middleWare


     //password generation
async function genPassword(password){
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt);
  return hashedPassword;
}



app.get("/",(req, res)=>{
    res.send("hello, 🌍20000")
});

   //login

app.post("/login",async(req,res)=>{
    const login = req.body;

    const existingUser = await client.db("userDB")
                            .collection("employees")
                            .findOne({name:login.name});
        
     if(!existingUser){
        return res.status(400).send("invalid credentials")
     }
    
     const password = existingUser.password;
     
     const passwordMatch = await bcrypt.compare(login.password,password);
     
     if(!passwordMatch){
         return res.send("invalid credentials");}

     const role = existingUser.role;
      
     if(role==="admin"){
         const token = jwt.sign({id:existingUser._id},process.env.SECRET_ADMIN_KEY)
        return  res.send(`Admin login successful,${token}`)
     }
     
     if(role==="manager"){
        const token = jwt.sign({id:existingUser._id},process.env.SECRET_MANAGER_KEY);
        return res.send(`Manager login successful,${token}`);
     }
     
     if(role==="employee"){
        const token = jwt.sign({id:existingUser._id},process.env.SECRET_EMPLOYEE_KEY);
        return res.send(`Employee login successful,${token}`);
     }

})
     
     // sign-up
app.post("/SignUp",async(req,res)=>{
    const employee = req.body;

    const existingUser =  await client.db("userDB")
    .collection("employees")
    .findOne({name:employee.name});

 if(existingUser){
   return res.status(400).send("username already exists")
 }
 if(
    !/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#%&]).{8,}$/g.test(employee.password)
 ){
     return res.status(400).send("password pattern does not match");
 }

    async function genPassword(password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        return hashedPassword;
      }

    employee.password = await genPassword(employee.password);

    const result = await client.db("userDB")
                                .collection("employees")
                                .insertOne(employee);

    res.send(result);
})

   //add - lead
app.post("/addLeads",Manager_auth,async(req,res)=>{
    const usersLead = req.body;
    const result = await client.db("userDB")
    .collection("users")
    .insertMany(usersLead);

res.send(result);
console.log("addedd");
});

    //delete all - leads
app.delete("/deleteLeads/all",Admin_auth,async(req,res)=>{
     const result = await client.db("userDB").collection("users").deleteMany({});
     res.send(result);
})
      
    //delete - lead
app.delete("/deleteLeads/:id",Manager_auth,async(req,res)=>{
    const id = req.id;
    console.log(id);
    const result = await client.db("userDB").collection("users").deleteOne({id:id});
    res.send(result);
})

      //get lead
  app.get("/leads/:id",Employee_auth,async(req,res)=>{
        console.log(req.params.id);
        const result = await client.db("userDB")
                            .collection("users")
                            .findOne({id : req.params.id});
        res.send(result);
    });

      //get all and filtered leads
    app.get("/leads",Employee_auth,async(req,res)=>{
        const queries = req.query;
        if(queries.rating){
            queries.rating = +queries.rating;
        }
        let filteredMovies = await client.db("userDB").collection("users").find(queries).toArray();
         
         res.send(filteredMovies);
    })
  
      //edit a lead
   app.put(`/lead/:id`,Admin_auth,async(req,res)=>{
         const id = req.params.id;
         const EditMovie = request.body;
         const result = await client.db("userDB")
                                  .collection("users")
                                  .updateOne({id:id},{$set:EditMovie});
         res.send(result);
         console.log("edited");
     });

   
app.listen(port,console.log("server started at port "+port));