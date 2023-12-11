const express=require('express')
const app=express()
const bodyParser=require('body-parser')

var cors=require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(cors());

const port=3000


let mysql=require('mysql')

var con=mysql.createConnection({
    
    host:"mysql.razs.me",

    user:"twitter_db_user",

    database:"angular_twitter",

    password:"swEqodl2aP_PrUrU0AkA",

})

app.get('/',(req,res)=>{
    res.send("Welcome to express!")
})

app.get('/users',(req,res)=>{
    let sqlQuery='SELECT * FROM SIGNUP'
    con.query(sqlQuery,function(err,result){
        if(err) throw err;
        res.send(result)

    })
})

app.get('/users/:id',(req,res)=>{
    let data=req.body
    let userId=req.params.id
    let sqlQuery=`SELECT * FROM SIGNUP WHERE SIGNUP.id='${userId}';`;
    con.query(sqlQuery,function(err,result){
        if(err) throw err;
        res.send(result[0])
    })
})

app.post('/users',(req,res)=>{
    let data=req.body
    let sqlQuery=`INSERT INTO SIGNUP (name,email,password,company) VALUES ('${data.name}','${data.email}','${data.password}','${data.company}');`;
    con.query(sqlQuery,function(err,result){
        if (err) throw err;
        console.log(result)
        res.send({message:'Registration successful'});
    });
})

app.post("/users/login", (req, res) => {
    let data = req.body;


    let sqlQuery = `SELECT id, name, email, company FROM SIGNUP WHERE email LIKE '${data.email}'AND password LIKE '${data.password}'`;


    con.query(sqlQuery, function (err, result) {
        if (err) throw err;
        // console.log(result)
        if (result.length) {
            res.send({
                user: {
                    // passord:result.password,


                    ...result[0],


                    avatar: "assets/images/avatars/brian-hughes.jpg",
                    status: "online",
                },
                accessToken:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTM4MjY1NzQsImlzcyI6IkZ1c2UiLCJleHAiOjE2OTQ0MzEzNzR9.qVdzkTHVKYpXgVulc559RFs33luU2eqYcx1KT_Un2t8",
                tokenType: "bearer",
            });
        } else {
            res.send("email/password incorrect");
        }
    });
});

app.delete('/users/:id',(req,res)=>{
    let data=req.body
    const userId=req.params.id
    let sqlQuery=`DELETE FROM SIGNUP WHERE SIGNUP.id='${userId}'`;
    con.query(sqlQuery,function(err,result){
        if(err) throw err;
        console.log(result)
        res.send({message:"Deleted sucessfully"})
    })
})

// app.patch('/users/:id',(req,res)=>{
//     let data=req.body
//     const userId=req.params.id;
//     let sqlQuery=`UPDATE SIGNUP SET name = '${data.name}', email = '${data.email}', password = '${data.password}', company='${data.company}' WHERE SIGNUP.id='${userId}';`;
//     con.query(sqlQuery,function(err,result){
//         if(err) throw err;
//         res.send(result)[0]
//     })

// })

app.patch("/users/:id", (req, res) => {
    let data = req.body;


    let sqlQuery = `UPDATE SIGNUP SET name = '${data.name}', email = '${data.email}', password = '${data.password}',  company = '${data.company}',  salary = '${data.salary}',  experience = '${data.experience}' WHERE SIGNUP.id = '${req.params.id}';`;


    con.query(sqlQuery, function (err, result) {
        if (err) throw err;


        if (result.affectedRows) res.send({ message: "Updated successful!" });
    });
});


app.listen(port,()=>{
    console.log(`App is ruuning on ${port}`)
})
