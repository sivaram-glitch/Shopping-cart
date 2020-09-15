const mysql=require('mysql');
//for password privacy we import jsonwebtoken and bcryptjs
const jwt = require('jsonwebtoken');
const bcrypt= require('bcryptjs');
const db= mysql.createConnection({
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE

});
exports.login= async(req,res)=>{
    try{

        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).render('login',{
                message:"please provide email and password"
            })
        }
        db.query("SELECT * FROM users WHERE email= ?",[email],async(error,results) =>{
            console.log(results);
            if( !results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login',{
                    message:'email or password is incorrect'
                })
            }else{
                const id =results[0].id;

                const token = jwt.sign({id},process.env.JWT_SECRET,{
                       
                    expiresIn:process.env.JWT_EXPIRES_IN
                });
                console.log("the token is:" +token);

                const cookieOptions={
                    expires:new Date(
                        Date.now()+process.env.JWT_COOKIE_EXPIRES* 24 *60*60*1000
                    ),
                    //to prevent hacking.. to specify that onluy http server can change these values
                    httpOnly:true
                }
                res.cookie('jwt' ,token,cookieOptions);
                res.status(200).redirect("/");
                //redirect to home page
            }
        })
        
    }catch(error){
        console.log(error);
    }

}
exports.register= (req,res)=>{
    console.log(req.body);
    
    const{ name,email,password,passwordconfirm} = req.body;
    // to check whether it is already registered email id
    db.query('SELECT email FROM users WHERE email=?',[email],async(error , results)=>{
           if(error){
               console.log(error);
           }
           if(results.length > 0)
           {
               return res.render('register',{
                   message: "olmari thevdyaa mane this email is already in use"
               })
           }
           else if( password !== passwordconfirm){
            return res.render('register',{
                message: "kudigaara thayili password doesnt match"

           });
         }

         let hashedpassword = await bcrypt.hash(password, 8)
         console.log(hashedpassword);


         db.query('INSERT INTO users SET ?',{name: name, email: email ,password: hashedpassword},(error,results) =>{
             if(error){
                 console.log(error);
             }
             else{
                console.log(results);
                return res.render('register',{
                    message: "user Registered"
    
               });
             }

         })
    })


    

}