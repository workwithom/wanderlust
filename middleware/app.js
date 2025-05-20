const express = require ("express");
const app = express();


app.use("/api",(req,res,next)=>{
    let {token} = req.query;
    if(token === "giveaccess"){
        next();
    }
    else{
        res.send("access denied");
    }  
})

app.use((req,res,next)=>{
    console.log("hi! i'm middleware");
    
    next();
})

app.get("/api",(req,res)=>{
    res.send("this is a data page");
})


//logger - morgon
app.use((req,res,next)=>{
    req.time = new Date().toString();
    console.log(req.method,req.hostname,req.path,req.time);
    
    next();
})

//404 page
app.use("/err",(req,res,next)=>{
    //res.status(404).send("page not found"); 
    next();
})


app.get("/",(req,res)=>{
    res.send("this is a home page");
})

app.get("/random",(req,res)=>{
    res.send("this is a random page")
})

app.listen(8080,()=>{
    console.log("server listening to port 8080");

})
