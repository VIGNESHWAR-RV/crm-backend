import express from "express";
import { Admin_auth } from "../../middleware/auth.js";

const route = express.Router();

 //dashboard section
route.get('/dashboard',Admin_auth,async (req, res) => {
     try{
         const graphData = [{name:"day 1",cost:7},
                            {name:"day 2",cost:4},
                            {name:"day 3",cost:12},
                            {name:"day 4",cost:8},
                            {name:"day 5",cost:15},
                            {name:"day 6",cost:20},
                            {name:"day 7",cost:10},
                           ];

         const notesData = "This is my first note";

         const infoCardData = ["5000","0"];

         const pendingJobData = [{firstName:"Vicky",lastName:"RV",customer_id:666666,dueDate:"2022-05-17",taskDescription:"Have to complete the project as soon as possible"},
                                 {firstName:"Vicky",lastName:"RV",customer_id:666666,dueDate:"2022-05-18",taskDescription:"Have to complete the project as soon as possible"},
                                 {firstName:"Vicky",lastName:"RV",customer_id:666666,dueDate:"2022-05-19",taskDescription:"Have to complete the project as soon as possible"},
                                 {firstName:"Vicky",lastName:"RV",customer_id:666666,dueDate:"2022-05-20",taskDescription:"Have to complete the project as soon as possible"},
                                 {firstName:"Vicky",lastName:"RV",customer_id:666666,dueDate:"2022-05-21",taskDescription:"Have to complete the project as soon as possible"},
                                 {firstName:"Vicky",lastName:"RV",customer_id:666666,dueDate:"2022-05-22",taskDescription:"Have to complete the project as soon as possible"}
                                ]

        return res.send({graphData,notesData,infoCardData,pendingJobData});

     }
     catch(e){
      console.error("error at getting dashboard data from admin/dashboard ----> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 

     }
});

route.post("/dashboard/notes",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully saved notes"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
}
catch(e){
  console.error("error at posting admin notes from admin/dashboard/notes ------> ",e.message);
  return res.status(500).send({message:"server error, please try again later"}); 
}


});

// route.put("/",async (req, res) => {

// });

// route.delete("/",async (req, res) => {

// });

// -------------------------------------------------


   //team-lead section
route.get("/teamLeads/table",Admin_auth,async (req,res)=>{
  
  try{

    const tableData = [
      {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-1234",
       revenue:3200,
       role:"Team Lead",
       pendingJobs:3,
       completedJobs:6,
       joinedDate:"12/02/2022"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-4567",
       revenue:3600,
       role:"Team Lead",
       pendingJobs:5,
       completedJobs:6,
       joinedDate:"12/02/2022"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-1234",
       revenue:3000,
       role:"Team Lead",
       pendingJobs:2,
       completedJobs:6,
       joinedDate:"12/02/2022"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-1234",
       revenue:6000,
       role:"Team Lead",
       pendingJobs:0,
       completedJobs:6,
       joinedDate:"12/02/2022"
       }
     ];

    // console.log(tableData);
      
    return res.send(tableData);

  }
  catch(e){
      console.error("error at getting team leads table data from admin/teamLeads/table ----> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 
  }
   
   
});


route.get("/teamLeads/:userName",Admin_auth,async (req, res) => {

  try{

    const { userName } = req.params;
    // console.log(userName); 

    let data = {userData:{firstName:"Vigneshwar",
                          lastName:"Venkatachalam",
                          email:"vigneshwarrv666@gmail.com",
                          status:"ACTIVE",
                          pending:3,
                          completed:6,
                          revenue:3200,
                          userName:"RV-123456",
                          role:"team lead",
                          pendingJobs:3,
                          completedJobs:6,
                          joinedDate:"12/02/2022"},
                  teamLeads:[{userName:"RV-123455",id: 123456781 },
                       {userName:"RV-123454",id: 123456782 },
                       {userName:"RV-123453",id: 123456783 },
                      ],
                  teamMembers:[{userName:"RV-123545",id: 123456780 ,pendingJobs: 6},
                         {userName:"RV-123546",id: 123456783 ,pendingJobs: 6},
                         {userName:"RV-123547",id: 123456781 ,pendingJobs: 6},
                         {userName:"RV-123548", id: 123456782 ,pendingJobs: 6}
                        ],
                  employeesList:[
                      { userName: "RV-123545", id: 123456780 ,pendingJobs: 6},
                      { userName: "RV-123547", id: 123456781 ,penddingJobs: 6},
                      { userName: 'RV-123548', id: 123456782 ,pendingJobs: 6},
                      { userName: "RV-123546", id: 123456783 ,pendingJobs: 6},
                      { userName: 'RV-123549', id: 123456784 ,pendingJobs: 6},
                      { userName: "RV-123544", id: 123456785 ,pendingJobs: 6},
                     ]
                    }

    // console.log(data);
    return res.send(data);

  }
  catch(e){
      console.error("error at getting team lead data from admin/teamleads/:username -----> ",e.message);
      return res.status(500).send({message:"server error, please try again later "}); 
  }

});


route.post("/teamLeads/add",Admin_auth,async (req, res) => {

  try{
      const data = req.body;
  
      if(data){
         return res.send({message:"successfully sent mail"});
      }else{
         return res.status(400).send({message:"no data received"});
      }
  }
  catch(e){
    console.error("error at posting team lead data from admin/teamlead/add ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});


route.put("/teamLeads/update",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully updated the details"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at updating team lead data from admin/teamlead/update ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

route.delete("/teamLeads/delete",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully deleted the user"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at deleting team lead data from admin/teamlead/delete ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

//----------------------------------------------------------------


   //employees section
route.get("/employees/table",Admin_auth,async (req, res) => {

  try{

    const tableData = [
      {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-1234",
       revenue:3200,
       role:"Team Lead",
       pendingJobs:3,
       completedJobs:6,
       joinedDate:"12/02/2022"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-4567",
       revenue:3600,
       role:"Team Lead",
       pendingJobs:5,
       completedJobs:6,
       joinedDate:"12/02/2022"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-1234",
       revenue:3000,
       role:"Team Lead",
       pendingJobs:2,
       completedJobs:6,
       joinedDate:"12/02/2022"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"ACTIVE",
       userName:"RV-1234",
       revenue:6000,
       role:"Team Lead",
       pendingJobs:0,
       completedJobs:6,
       joinedDate:"12/02/2022"
       }
     ];

    // console.log(tableData);
      
    return res.send(tableData);

  }
  catch(e){
      console.error("error at getting employees table data from admin/employees/table ----> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 
  }
   
});

route.get("/employees/add",Admin_auth,async(req,res)=>{

  try{

      const data  = [{userName:"RV-123455" },
                     {userName:"RV-123454" },
                     {userName:"RV-123453" },
                    ];

      if(data){
        return res.send(data);
      }else{
        return res.status(400).send({message:"no such data"});
      }

  }
  catch(e){
      console.error("error at getting team lead data from admin/employees/:add -----> ",e.message);
      return res.status(500).send({message:"server error, please try again later "}); 
  }
});

route.get("/employees/:userName",Admin_auth,async (req, res) => {

  try{

    const { userName } = req.params;
    // console.log(userName); 

    let data = {userData:{firstName:"Vigneshwar",
                          lastName:"Venkatachalam",
                          email:"vigneshwarrv666@gmail.com",
                          status:"ACTIVE",
                          pending:3,
                          completed:6,
                          revenue:3200,
                          userName:"RV-123456",
                          role:"employee",
                          pendingJobs:3,
                          completedJobs:6,
                          joinedDate:"12/02/2022"},
                          teamMembers:[{userName:"RV-123545",id: 123456780 ,pendingJobs: 6},
                                       {userName:"RV-123546",id: 123456783 ,pendingJobs: 6},
                                       {userName:"RV-123547",id: 123456781 ,pendingJobs: 6},
                                       {userName:"RV-123548", id: 123456782 ,pendingJobs: 6}
                                      ]
                    }

    // console.log(data);
    return res.send(data);

  }
  catch(e){
      console.error("error at getting employee data from admin/employees/:username -----> ",e.message);
      return res.status(500).send({message:"server error, please try again later "}); 
  }

});

route.post("/employees/add",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully sent mail"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
  console.error("error at posting new employee data from admin/employees/add ------> ",e.message);
  return res.status(500).send({message:"server error, please try again later"}); 
  }

});

route.put("/employees/update",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully updated the details"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at updating employee data from admin/employees/update ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

route.delete("/employees/delete",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully deleted the user"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at deleting employee data from admin/employees/delete ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

//----------------------------------------------------------------

 //Customers section
route.get("/customers/table",Admin_auth,async (req, res) => {

  try{

    const tableData = [
      {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"not started",
       customer_id:"666666",
       Address:"9/161,uthukaadu,seelanaikanpatty,salem",
       contact:"+91-9080306971",
       taskDescription:"Repairing the laptop",
       taskOwner:"RV-1234",
       startDate:"2022-05-15",
       dueDate:"2022-05-15",
       PreviousTasks:[],
       createdBy:"",
       createdDate:"2022-05-13"
       },

       {
        firstName:"Vigneshwar",
        lastName:"Venkatachalam",
        email:"vigneshwarrv666@gmail.com",
        status:"in progress",
        customer_id:"666666",
        Address:"9/161,uthukaadu,seelanaikanpatty,salem",
        contact:"+91-9080306971",
        taskDescription:"Repairing the laptop",
        taskOwner:"RV-1234",
        startDate:"2022-05-15",
        dueDate:"2022-05-14",
        PreviousTask:[],
        createdBy:"",
        createdDate:"2022-05-13"
       },

       {
       firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"completed",
       customer_id:"666666",
       Address:"9/161,uthukaadu,seelanaikanpatty,salem",
       contact:"+91-9080306971",
       taskDescription:"Repairing the laptop",
       taskOwner:"RV-1234",
       startDate:"2022-05-15",
       dueDate:"2022-05-16",
       PreviousTask:[],
       createdBy:"",
       createdDate:"2022-05-13"
       },

       {
        firstName:"Vigneshwar",
       lastName:"Venkatachalam",
       email:"vigneshwarrv666@gmail.com",
       status:"completed",
       customer_id:"666666",
       Address:"9/161,uthukaadu,seelanaikanpatty,salem",
       contact:"+91-9080306971",
       taskDescription:"Repairing the laptop",
       taskOwner:"RV-1234",
       startDate:"2022-05-15",
       dueDate:"2022-05-18",
       PreviousTask:[],
       createdBy:"",
       createdDate:"2022-05-13"
       }
     ];
      
    return res.send(tableData);

  }
  catch(e){
      console.error("error at getting customers table data from admin/customers/table ----> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 
  }

});

route.get("/customers/add",Admin_auth,async (req,res)=>{

  try{
    const teamLead = req.header("teamLead");

    if(teamLead !== undefined ){

        const data  = [{userName:"RV-123455" },
                         {userName:"RV-123454" },
                         {userName:"RV-123453" },
                        ];

           if(data){
             return res.send(data);
           }else{
             return res.status(400).send({message:"no such data"});
           }
          
    }else{
          const data  = [{userName:"RV-123455" },
                         {userName:"RV-123454" },
                         {userName:"RV-123453" },
                        ];

           if(data){
             return res.send(data);
           }else{
             return res.status(400).send({message:"no such data"});
           }
    }

}
catch(e){
    console.error("error at getting team lead data from admin/customers/add -----> ",e.message);
    return res.status(500).send({message:"server error, please try again later "}); 
}

});

route.get("/customers/:customer_id",Admin_auth,async (req,res)=>{

  try{

    const { customer_id } = req.params;
    console.log(customer_id); 

    let data = {customerData:
                         {
                           firstName: 'VIGNESHWAR',
                           lastName: 'R.V',
                           email: 'vigneshwarrv666@gmail.com',
                           phone: '+919080306971',
                           address: 'NO.39, M.G.R NAGAR,\nSEELANAIKANPATTI,',
                           taskDescription: 'Complete the project work',
                           teamLead: 'RV-123454',
                           taskOwner: 'RV-123455',
                           startDate: '2022-05-16T18:30:00.000Z',
                           dueDate: '2022-05-19T18:30:00.000Z',
                           status:"in-complete",
                           customer_id
                         },
                teamLeads :[{userName:"RV-123455" },
                            {userName:"RV-123454" },
                            {userName:"RV-123453" },
                           ],
                taskOwners :[
                            {userName:"RV-123455" },
                            {userName:"RV-123454" },
                            {userName:"RV-123453" },
                           ]
                    }

    // console.log(data);
    return res.send(data);

  }
  catch(e){
      console.error("error at getting customer data from admin/customers/:customer_id -----> ",e.message);
      return res.status(500).send({message:"server error, please try again later "}); 
  }

});

route.post("/customers/add",Admin_auth,async (req, res) => {

   try{
      const newCustomer = req.body;

      if(newCustomer){
         console.log(newCustomer);
         return res.send({message:"successfully created the user"});
      }else{
        return res.send(404).send({message:"didnt get the data , please try again"});
      }

   }
   catch(e){
      console.error("error at posting new customer data from admin/customers/add -----> ",e.message);
      return res.status(500).send({message:"server error, please try again later "}); 
   }
   
});

route.put("/customers/update",Admin_auth,async (req, res) => {

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully updated the details"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at updating customer data from admin/customer/update ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

route.delete("/customers/delete",Admin_auth,async (req, res) =>{

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully deleted the user"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at deleting customer data from admin/customer/delete ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

//------------------------------------------------------------------------------------------------

 //profile section
route.get("/myProfile",Admin_auth,async (req, res)=>{
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
      console.error("error at getting profile data from admin/myProfile/ ------> ",e.message);
      return res.status(500).send({message:"server error, please try again later"}); 
    }
});

route.put("/myProfile",async (req, res) =>{

  try{
    const data = req.body;

    if(data){
       return res.send({message:"successfully updated the details"});
    }else{
       return res.status(400).send({message:"no data received"});
    }
  }
  catch(e){
    console.error("error at updating profile data from admin/myProfile ------> ",e.message);
    return res.status(500).send({message:"server error, please try again later"}); 
  }

});

route.post("/myProfile",async (req, res)=>{

});

route.delete("/myProfile",async (req, res) =>{

});

export const AdminRoutes = route;