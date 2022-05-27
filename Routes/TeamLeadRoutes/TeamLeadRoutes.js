import express from "express";

import { teamLead_auth } from "../../middleware/auth.js";

const route = express.Router();

 //dashboard section
 route.get('/dashboard',teamLead_auth,async (req, res) => {
    try{
        if(req.params.loggedInUser){
             const user = req.params.loggedInUser;

             const graphData = [{name:"day 1",cost:7},
                           {name:"day 2",cost:4},
                           {name:"day 3",cost:12},
                           {name:"day 4",cost:8},
                           {name:"day 5",cost:15},
                           {name:"day 6",cost:20},
                           {name:"day 7",cost:10},
                               ];    
             
             const infoCardData = ["5000","0"];
    
             const pendingJobData = [{firstName:"Demo Customer",lastName:"D1",customer_id:"123456",dueDate:"2022-05-26",taskDescription:"Completing the CRM task",},
                                     {firstName:"Demo Customer",lastName:"D2",customer_id:"234567",dueDate:"2022-05-27",taskDescription:"Repairing the laptop",},
                                     {firstName:"Demo Customer",lastName:"D3",customer_id:"345678",dueDate:"2022-05-27",taskDescription:"Mobile repairing",},
                                     {firstName:"Demo Customer",lastName:"D4",customer_id:"456789",dueDate:"2022-05-27",taskDescription:"TV repairing"},
                                    ];
    
            return res.send({graphData,notesData:user.notes,infoCardData,pendingJobData});
        }
        return res.status(500).send({message:"something went wrong , please try again later"});
    }
    catch(e){
     console.error("error at getting dashboard data from teamLead/dashboard ----> ",e.message);
     return res.status(500).send({message:"server error, please try again later"}); 

    }
});

route.post("/dashboard/notes",teamLead_auth,async (req, res) => {

 try{
   const { notes="" } = req.body;
   const user = req.params.loggedInUser;

   if( typeof(notes)==="string" && user){

         const update = await client.db("CRM").collection("accounts").updateOne(user,{$set:{notes:notes}},{upsert:true});
         
         if(update){
            return res.send({message:"successfully saved notes"});
         }else{
            return res.status(400).send({message:"error while saving the message"});
         }
   }else{
      return res.status(400).send({message:"not authorized"});
   }
}
catch(e){
 console.error("error at posting admin notes from teamLead/dashboard/notes ------> ",e.message);
 return res.status(500).send({message:"server error, please try again later"}); 
}


});


//-------------------------------------------------------------------------------

 // employee section
 route.get("/employees/table",teamLead_auth,async (req, res) => {

    try{
  
      const tableData = [
        {
         firstName:"Employee",
         lastName:"D1",
         email:"employeedemo1@gmail.com",
         status:"ACTIVE",
         userName:"ED-123456",
         revenue:3200,
         role:"employee",
         pendingJobs:3,
         completedJobs:6,
         joinedDate:"12/02/2022"
         },
  
         {
         firstName:"Employee",
         lastName:"D2",
         email:"employeedemo2@gmail.com",
         status:"ACTIVE",
         userName:"ED-234567",
         revenue:3600,
         role:"employee",
         pendingJobs:5,
         completedJobs:6,
         joinedDate:"12/02/2022"
         },
  
         {
         firstName:"Employee",
         lastName:"D3",
         email:"employeedemo3@gmail.com",
         status:"ACTIVE",
         userName:"ED-345678",
         revenue:3000,
         role:"employee",
         pendingJobs:2,
         completedJobs:6,
         joinedDate:"12/02/2022"
         },
  
       ];
        
      return res.send(tableData);
  
    }
    catch(e){
        console.error("error at getting employees table data from teamLead/employees/table ----> ",e.message);
        return res.status(500).send({message:"server error, please try again later"}); 
    }
     
  });
  
 
route.get("/employees/:userName",teamLead_auth,async (req, res) => {

    try{
  
      const { userName } = req.params;
  
      const tableData = [
        {
         firstName:"Employee",
         lastName:"D1",
         email:"employeedemo1@gmail.com",
         status:"ACTIVE",
         userName:"ED-123456",
         revenue:3200,
         role:"employee",
         pendingJobs:3,
         completedJobs:6,
         joinedDate:"12/02/2022"
         },
  
         {
         firstName:"Employee",
         lastName:"D2",
         email:"employeedemo2@gmail.com",
         status:"ACTIVE",
         userName:"ED-234567",
         revenue:3600,
         role:"employee",
         pendingJobs:5,
         completedJobs:6,
         joinedDate:"12/02/2022"
         },
  
         {
         firstName:"Employee",
         lastName:"D3",
         email:"employeedemo3@gmail.com",
         status:"ACTIVE",
         userName:"ED-345678",
         revenue:3000,
         role:"employee",
         pendingJobs:2,
         completedJobs:6,
         joinedDate:"12/02/2022"
         },
       ];
  
       const userData = tableData.find((data)=>userName === data.userName);
  
    //    const teamMembers = tableData.filter((data)=>userName !== data.userName).map((data)=>{return {userName:data.userName,id:data.id}});
  
       const pendingJobData = [{firstName:"Demo Customer",lastName:"D1",customer_id:"123456",dueDate:"2022-05-26",taskDescription:"Completing the CRM task",},
                              {firstName:"Demo Customer",lastName:"D2",customer_id:"234567",dueDate:"2022-05-27",taskDescription:"Repairing the laptop",},
                              {firstName:"Demo Customer",lastName:"D3",customer_id:"345678",dueDate:"2022-05-27",taskDescription:"Mobile repairing",},
                              {firstName:"Demo Customer",lastName:"D4",customer_id:"456789",dueDate:"2022-05-27",taskDescription:"TV repairing"},
                             ];
  
      let data = {userData,
                  pendingJobData
                      }
  
      return res.send(data);
  
    }
    catch(e){
        console.error("error at getting employee data from teamLead/employees/:username -----> ",e.message);
        return res.status(500).send({message:"server error, please try again later "}); 
    }
  
  });
  
//---------------------------------------------------------------------------------


  //Customers section
route.get("/customers/table",teamLead_auth,async (req, res) => {

    try{
  
  
      const tableData = [
        {
        firstName:"Demo Customer",
        lastName:"D1",
        email:"democustomerd1@gmail.com",
        status:"in-complete",
        customer_id:"123456",
        address:"1/10,Demo Nagar,Demo City,Demo State,Demo",
        phone:"+91-1234567890",
        taskDescription:"Completing the CRM task",
        taskOwner:"ED-123456",
        teamLead:"TD-123456",
        startDate:"2022-05-25",
        dueDate:"2022-05-26",
        PreviousTasks:[],
        createdBy:"",
        createdDate:"2022-05-20"
        },
  
        {
         firstName:"Demo Customer",
         lastName:"D2",
         email:"democustomerd2@gmail.com",
         status:"in-progress",
         customer_id:"234567",
         address:"2/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Repairing the laptop",
         taskOwner:"ED-234567",
         teamLead:"TD-123456",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
  
        {
         firstName:"Demo Customer",
         lastName:"D3",
         email:"democustomerd3@gmail.com",
         status:"in-complete",
         customer_id:"345678",
         address:"3/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Mobile repairing",
         taskOwner:"ED-345678",
         teamLead:"TD-234567",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
        
        {
         firstName:"Demo Customer",
         lastName:"D4",
         email:"democustomerd4@gmail.com",
         status:"in-complete",
         customer_id:"456789",
         address:"4/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Television repairing",
         taskOwner:"ED-234567",
         teamLead:"TD-234567",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
      ];
       
      return res.send(tableData);
  
    }
    catch(e){
        console.error("error at getting customers table data from teamLead/customers/table ----> ",e.message);
        return res.status(500).send({message:"server error, please try again later"}); 
    }
  
});
   
route.get("/customers/add",teamLead_auth,async (req,res)=>{
  
    try{
      const teamLead = req.header("teamLead");
  
      if(teamLead !== undefined ){
  
          const data  = [{userName:"ED-123456" },
                         {userName:"ED-234567" },
                         {userName:"ED-345678" },
                         {username:"ED-456789" }
                          ];
  
             if(data){
               return res.send(data);
             }else{
               return res.status(400).send({message:"no such data"});
             }
            
      }else{
            const data  = [{userName:"TD-123456" },
                           {userName:"TD-234567" },
                           {userName:"TD-345678" },
                           {userName:"TD-456789" }
                          ];
  
             if(data){
               return res.send(data);
             }else{
               return res.status(400).send({message:"no such data"});
             }
      }
  
  }
  catch(e){
      console.error("error at getting team lead data from teamLead/customers/add -----> ",e.message);
      return res.status(500).send({message:"server error, please try again later "}); 
  }
  
});

route.get("/customers/:customer_id",teamLead_auth,async (req,res)=>{
  
    try{
  
      const { customer_id } = req.params;
      // console.log(customer_id); 
  
      const tableData = [
        {
        firstName:"Demo Customer",
        lastName:"D1",
        email:"democustomerd1@gmail.com",
        status:"in-complete",
        customer_id:"123456",
        address:"1/10,Demo Nagar,Demo City,Demo State,Demo",
        phone:"+91-1234567890",
        taskDescription:"Completing the CRM task",
        taskOwner:"ED-123456",
        teamLead:"TD-123456",
        startDate:"2022-05-25",
        dueDate:"2022-05-26",
        PreviousTasks:[],
        createdBy:"",
        createdDate:"2022-05-20"
        },
  
        {
         firstName:"Demo Customer",
         lastName:"D2",
         email:"democustomerd2@gmail.com",
         status:"in-progress",
         customer_id:"234567",
         address:"2/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Repairing the laptop",
         taskOwner:"ED-234567",
         teamLead:"TD-123456",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
  
        {
         firstName:"Demo Customer",
         lastName:"D3",
         email:"democustomerd3@gmail.com",
         status:"in-complete",
         customer_id:"345678",
         address:"3/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Mobile repairing",
         taskOwner:"ED-345678",
         teamLead:"TD-234567",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
        
        {
         firstName:"Demo Customer",
         lastName:"D4",
         email:"democustomerd4@gmail.com",
         status:"in-complete",
         customer_id:"456789",
         address:"4/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Television repairing",
         taskOwner:"ED-234567",
         teamLead:"TD-234567",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
        
        {
         firstName:"Demo Customer",
         lastName:"D5",
         email:"democustomerd5@gmail.com",
         status:"in-progress",
         customer_id:"567890",
         address:"5/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"RO repairing",
         taskOwner:"ED-345678",
         teamLead:"TD-345678",
         startDate:"2022-05-20",
         dueDate:"2022-05-27",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-18"
        },
        
        {
         firstName:"Demo Customer",
         lastName:"D6",
         email:"democustomerd6@gmail.com",
         status:"in-complete",
         customer_id:"678901",
         address:"6/10,Demo Naga,Demo City,Demo State,Demo",
         phone:"+91-2345678901",
         taskDescription:"Washing Machine repairing",
         taskOwner:"ED-123456",
         teamLead:"TD-345678",
         startDate:"2022-05-26",
         dueDate:"2022-05-30",
         PreviousTask:[],
         createdBy:"",
         createdDate:"2022-05-25"
        },
  
        {
        firstName:"Demo Customer",
        lastName:"D7",
        email:"democustomerd7@gmail.com",
        status:"completed",
        customer_id:"789012",
        address:"7/10,Demo Naga,Demo City,Demo State,Demo",
        phone:"+91-3456789012",
        taskDescription:"Repairing the refridgrator",
        taskOwner:"ED-234567",
        teamLead:"TD-456789",
        startDate:"2022-05-14",
        dueDate:"2022-05-20",
        PreviousTask:[],
        createdBy:"",
        createdDate:"2022-05-13",
        serviceCharge:"400",
        completionDate:"2022-05-18"
        },
  
        {
        firstName:"Demo Customer",
        lastName:"D8",
        email:"democustomerd8@gmail.com",
        status:"completed",
        customer_id:"890123",
        address:"8/10,Demo Naga,Demo City,Demo State,Demo",
        phone:"+91-4567890123",
        taskDescription:"Repairing the Air conditioner",
        taskOwner:"ED-345678",
        teamLead:"TD-456789",
        startDate:"2022-05-12",
        dueDate:"2022-05-18",
        PreviousTask:[],
        createdBy:"",
        createdDate:"2022-05-11",
        serviceCharge:"400",
        completionDate:"2022-05-17"
        }
      ];   
        
      const customerData = tableData.find((data)=>data.customer_id === customer_id);
  
      let data = {customerData,
                  taskOwners :[
                              {userName:"ED-123456" },
                              {userName:"ED-234567" },
                              {userName:"ED-345678" },
                              {userName:"ED-456789" }
                             ]
                      }
  
      // console.log(data);
      return res.send(data);
  
    }
    catch(e){
        console.error("error at getting customer data from teamLead/customers/:customer_id -----> ",e.message);
        return res.status(500).send({message:"server error, please try again later "}); 
    }
  
});
  
route.post("/customers/add",teamLead_auth,async (req, res) => {
  
    try{
       const newCustomer = req.body;
 
       if(newCustomer){
       //    console.log(newCustomer);
          return res.send({message:"successfully created the user"});
       }else{
         return res.send(404).send({message:"didnt get the data , please try again"});
       }
 
    }
    catch(e){
       console.error("error at posting new customer data from teamLead/customers/add -----> ",e.message);
       return res.status(500).send({message:"server error, please try again later "}); 
    }
    
});
  
route.put("/customers/update",teamLead_auth,async (req, res) => {
  
    try{
      const data = req.body;
  
      if(data){
         return res.send({message:"successfully updated the details"});
      }else{
         return res.status(400).send({message:"no data received"});
      }
    }
    catch(e){
      console.error("error at updating customer data from teamLead/customer/update ------> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 
    }
  
});

//--------------------------------------------------------------------------------


 //profile section
 route.get("/myProfile",teamLead_auth,async (req, res)=>{
    try{
       const {loggedInUser} = req.params;

      //  console.log(loggedInUser , "line 667");
       
       if(loggedInUser){
          const { firstName,lastName,userName,email,role,company,joinedDate } = loggedInUser;
          const response = {userData : { firstName,lastName,userName,email,role,company,joinedDate }};
          return res.send(response);
       }else{
         return res.status(404).send({message:"no such user"});
       }
    }catch(e){
      console.error("error at getting profile data from teamLead/myProfile/ ------> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 
    }
});

route.put("/myProfile",teamLead_auth,async (req, res) =>{

  try{
    const data = req.body;
    const { loggedInUser } = req.params;

    if(data && loggedInUser){

       const update = await client.db("CRM").collection("accounts").updateOne(loggedInUser,{$set:data});
       if(update){
         return res.send({message:"successfully updated the details"});
       }
       return res.status(400).send({message:"Couldn't authorize the changes"});

    }
       return res.status(400).send({message:"no data received"});
  }
  catch(e){
    console.error("error at updating profile data from teamLead/myProfile ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});



export const TeamLeadRoutes = route;