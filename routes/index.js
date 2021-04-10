var express = require('express');
const Student = require('../src/models/studentmodule');
const Staff = require('../src/models/staffmodule');
var router = express.Router();
require("../src/db/conn");
const session = require('express-session');

router.use(session({
    secret:'student',
    name:'uniqueSessionId',
    resave:false,
    saveUninitialized:true
    
}));

/* GET home page. */
router.get('/', (req, res)=> {
  res.render('index', { title: 'Express' });
});

router.get('/courses',(req,res)=>{
  res.render('courses')
});


//---------------------------------Student code--------------------------------------
router.get('/login',(req,res)=>{
  if(req.session.isAuth){
    res.status(200).render('stdindex',{user:req.session.user});
  }
    res.render('stdlogin')
});

router.post('/login', async(req,res)=>{
  try {
        const eno = req.body.eno;
        const ps = req.body.password;
        console.log(eno);
        const ad = await Student.findOne({enroll:eno});
        req.session.isAuth = true;
        req.session.user = ad.enroll;
        req.session.save();

        console.log(ad.name);
        if(ad.password == ps){
          res.status(201).render('stdindex',{user:ad.enroll});
        }
        else{
          res.render('stdlogin',{msg:'Invalid Username or Password'});
        }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/');
})

router.get('/stdregister',(req,res)=>{
  res.render('stdregister');
});

router.post('/stdregister', async(req,res)=>{
  try {
        const ps = req.body.password;
        const cps = req.body.cpassword; 
        if(ps === cps){
          const registerStudent = new Student({
            enroll: req.body.eno,
            name : req.body.sname,
            address : req.body.saddress,
            phone : req.body.sphone,
            email : req.body.semail,
            password : ps,
            cpassword : cps
          });
            
         const reply = await registerStudent.save();
         res.status(201).render('stdlogin');
        }
        else{
          res.render('stdregister',{msg:'Password not match'})
        }   
  } catch (error) {
    res.status(400).send(error);
  }
})

router.get('/staffLogin',(req,res)=>{
  res.render('staffLogin');
});

router.post('/staffLogin', async(req,res)=>{
  try {
        const em = req.body.email;
        const ps = req.body.password;
        console.log(em);
        const ad = await Staff.findOne({email:em});
        console.log(ad.name);
        if(ad.password == ps){
          res.status(201).render('staffIndex',{user:ad.name});
        }
        else{
          res.render('staffLogin',{msg:'Invalid Username or Password'});
        }
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/staffReg',(req,res)=>{
  res.render('staffRegistration');
});

router.post('/staffReg', async(req,res)=>{
  try {
        const ps = req.body.password;
        const cps = req.body.cpassword; 
        if(ps === cps){
          const registerStaff = new Staff({
            fid:req.body.sid,
            name : req.body.sname,
            address : req.body.saddress,
            phone : req.body.sphone,
            email : req.body.semail,
            password : ps,
            cpassword : cps
          });
            
         const reply = await registerStaff.save();
         res.status(201).render('staffLogin');
        }
        else{
          res.render('staffRegistration',{msg:'Password not match'})
        }   
  } catch (error) {
    res.status(400).send(error);
  }
})


module.exports = router;
