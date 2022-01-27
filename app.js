import express from 'express'
import mongoose from 'mongoose'
import catModel from './db/categorySchema.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')

const db = "mongodb://localhost:27017/form"

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+.[^\s@]+$/);
const regForName = RegExp(/^[a-zA-Z]/);
const regForpassword = RegExp(/^(.{0,7}|[^0-9]|[^A-Z]|[^a-z]|[a-zA-Z0-9])$/);
const connectDB = async()=>{
    try{
        await mongoose.connect(db,{useNewUrlParser:true})
        console.log("Mongodb is connectec");
    }
    catch(err){
        console.log(err.message);
    }
}
connectDB();

app.get('/',(req,res)=>{
    catModel.find({},(err,data)=>{
        if(err) throw err
        else{
    res.render('table',{data})

        }
    })
})
app.get('/login',(req,res)=>{
    res.render('form')
})


app.post('/post',(req,res)=>{

    let ins = new catModel({name:req.body.name,email:req.body.email,pass:req.body.pass})

    if(req.body.name==='' && req.body.email==='' &&req.body.pass==='')
    {
        res.render('error',{data:{name:'Data is required',path:'/login'}})
    }
    else if(!regForName.test(req.body.name)){
        res.render('error',{data:{name:'Enter proper name',path:'/login'}})

    }
    else if(!regForEmail.test(req.body.email)){
        res.render('error',{data:{name:'Enter proper email',path:'/login'}})

    } else if(regForpassword.test(req.body.pass)){
        res.render('error',{data:{name:'Enter proper password',path:'/login'}})

    }
    else{
    ins.save((e)=>{
        if(e){
        res.send("Already added")
        console.log(e);}
       else {
           res.send("New data Added");
        }
    })
}

})

app.get('/delete/:id',(req,res)=>{
    let id = req.params.id;
    catModel.deleteOne({_id:id},(e)=>{
        if(e) throw e
        else{
            res.redirect('/')
        }
    })
})
app.get('/getupdate/:id',(req,res)=>{
    res.render('update',{id:req.params.id})

})
app.post('/update/:id',(req,res)=>{
    let id=req.params.id;
    catModel.updateOne({_id:id},{$set:{name:req.body.name,email:req.body.email,pass:req.body.pass}},(err)=>{
        if(err) throw err;
        else {
            res.redirect('/')
        }
    })
})



app.listen(8000,(err)=>{
    if(err) throw err
    else{console.log("Port is listening");}
})