const express=require('express');
const app= express()
const {open}=require("sqlite");
const sqlite3=require("sqlite3")
const path=require('path');
const { log } = require('console');
const { request } = require('http');

 
const dbPath=path.join(__dirname,"goodreads.db")

app.use(express.json())

let db=null

const intailizAndStartServer=async ()=>{
    try{
    db= await open({
        filename:dbPath,
        driver:sqlite3.Database
     })
     app.listen("3008",()=>{
        console.log("server is running at port 3008");
    })
}
catch(e){
    console.log(`DB error : ${e.massege}`);
    process.exit(1)
}
    


}

intailizAndStartServer();

app.get("/",async(request,resposne)=>{
    const query=`
    select * From users;`;
    const dbResponse=await db.all(query)
    console.log(dbResponse);
    resposne.send(dbResponse)
})

app.post("/post", async (request, response) => {
      
    const { name, role } =  request.body;
    
    const query = `
        INSERT INTO users (name, role) 
        VALUES (?, ?)
    `;
    
    try {
        await db.run(query, [name, role]);
        console.log("Inserted successfully");
        response.send("Successfully inserted");
    } catch (error) {
        console.error(`Error inserting data: ${error.message}`);
        response.status(500).send("Failed to insert data");
    }
});
