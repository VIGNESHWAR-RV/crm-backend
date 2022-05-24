import jwt from "jsonwebtoken";
import {client} from "../index.js";
import {ObjectId} from "mongodb";


export const Admin_auth = (request,response,next)=>{
    try{
    if(request.header("admin_auth")){
        const token = request.header("admin_auth");
        jwt.verify(token, process.env.SECRET_ADMIN_KEY,async(err,decoded)=>{
            if(err || !decoded.id){
                return response.status(406).send({message:"unAuthorized Access"});
            }
            else{
                let admin = await client.db("CRM").collection("accounts").findOne({_id:ObjectId(decoded.id)});
                if(!admin){
                    return response.status(406).send({message:"unauthorized Access"});
                }else{
                    request.params.loggedInUser = admin;
                    next();
                }
            }
          });
    }else{
        // console.log(request.header("admin_auth"));
        return response.status(404).send({message:"Invalid request"});
    }
}
    catch(err){
         console.log(err);
         return  response.status(406).send({error:err.message})
    }
}

export const teamLead_auth = (request,response,next)=>{
    try{
        if(request.header("teamLead_auth")){
            const token = request.header("teamLead_auth");
           
            jwt.verify(token, process.env.SECRET_MANAGER_KEY,async(err,decoded)=>{
                if(err || !decoded.id){
                    return response.status(406).send({message:"unAuthorized Access"});
                }
                else{
                    let manager = await client.db("CRM").collection("accounts").findOne({_id:ObjectId(decoded.id)});
                    if(!manager){
                        return response.status(406).send({message:"unauthorized Access"});
                    }else{
                        request.params.loggedInUser = manager;
                        next();
                    }
                }
            });
         }else{
            return response.status(404).send({message:"Invalid request"});
        }
    }
    catch(err){
       return response.status(406).send({error:err.message})
    }

}

export const Employee_auth = (request,response,next)=>{
    try{
     
    if(request.header("employee_auth")){
        const token = request.header("employee_auth");
        jwt.verify(token, process.env.SECRET_EMPLOYEE_KEY,async(err,decoded)=>{
            //   console.log(decoded);
            if(err || !decoded.id){
                return response.status(406).send({message:"unAuthorized Access"});
            }
            else{
                let employee = await client.db("CRM").collection("accounts").findOne({_id:ObjectId(decoded.id)});
                // console.log(employee);
                if(!employee){
                    return response.status(406).send({message:"unauthorized Access"});
                }else{
                    request.params.loggedInUser = employee;
                    next();
                }
            }
        });
    }else{
        return response.status(404).send({message:"Invalid request"});
    }
}
    catch(err){
        console.log(err);
      return  response.status(406).send({error:err.message})
    }
}

export const Check_auth = (request,response,next)=>{

    try{
        if(request.header("admin_auth")){
            // console.log(request.header("admin_auth"));
            Admin_auth(request,response,next);
        }
        else if(request.header("teamLead_auth")){
            // console.log(request.header("manager_auth"));
            teamLead_auth(request,response,next);
        }
        else if(request.header("employee_auth")){
            // console.log(request.header("employee_auth"));
            Employee_auth(request,response,next);
        }
        else{
            return response.status(404).send({message:"not a valid request"})
        }
    }catch(err){
        console.error("check_auth",err.message);
        return response.status(500).send({message:"server error"});
    }
}