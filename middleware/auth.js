import jwt from "jsonwebtoken";

export const Employee_auth = (request,response,next)=>{
    try{
    if(request.header("employee-auth")){
        const token = request.header("employee-auth");
        console.log(token);
        jwt.verify(token, process.env.SECRET_EMPLOYEE_KEY);
        next();}
    else if(request.header("admin-auth")){
        const token = request.header("admin-auth");
        console.log(token);
        jwt.verify(token, process.env.SECRET_ADMIN_KEY);
        next();
    }
    else if(request.header("manager-auth")){
        const token = request.header("manager-auth");
        console.log(token);
        jwt.verify(token, process.env.SECRET_MANAGER_KEY);
        next();
     }
}
    catch(err){
        response.send({error:err.message})
    }
}

export const Admin_auth = (request,response,next)=>{
    try{
    if(request.header("admin-auth")){
        const token = request.header("admin-auth");
        console.log(token);
        jwt.verify(token, process.env.SECRET_ADMIN_KEY);
        next();
    }
}
    catch(err){
        response.send({error:err.message})
    }
}

export const Manager_auth = (request,response,next)=>{
    try{
        if(request.header("manager-auth")){
            const token = request.header("manager-auth");
            console.log(token);
            jwt.verify(token, process.env.SECRET_MANAGER_KEY);
            next();
         }
        else  if(request.header("admin-auth")){
            const token = request.header("admin-auth");
            console.log(token);
            jwt.verify(token, process.env.SECRET_ADMIN_KEY);
            next();
        }
    }
    catch(err){
        response.send({error:err.message})
    }

}