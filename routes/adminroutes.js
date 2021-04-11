var express = require('express');
var router = express.Router();
require("../src/db/conn");
const session = require('express-session');

router.use(session({
    secret:'admin',
    name:'uniqueSessionId',
    resave:false,
    saveUninitialized:true
    
}));

const admin = require('../src/models/adminmodule');
const Student = require('../src/models/studentmodule');
const Staff = require('../src/models/staffmodule');
const Course = require('../src/models/coursemodule');
const Subject = require('../src/models/subjectmodule');
const Semester = require('../src/models/semmodule');
const ClassTable = require('../src/models/clgclassmodule');
const Lecture = require('../src/models/sub-class-allocmodule');
const StudentDetails = require('../src/models/studentDetails');

//-------------------------------------------------------------------------------------------
router.get('/',(req, res) =>{
  if(req.session.isAuth){
    res.status(200).render('adminindex',{user:req.session.user});
  }
  console.log('Session=',req.session.user);
  console.log(req.session.id);
  res.render('adminlogin');
});

router.post('/', async(req,res)=>{
  try {
        const em = req.body.email;
        const ps = req.body.password;
        const ad = await admin.findOne({email:em});
      
       console.log(ad.email);
        if(ad.password == ps){
          req.session.isAuth = true;
          req.session.user = ad.email;
          req.session.save();
          res.status(201).render('adminindex',{user:ad.email});
        }
        else{
          res.render('adminlogin',{msg:'Invalid Username or Password'});
        }
  } catch (error) {
    res.status(400).send(error);
  }
});
//--------------------------------------termination--------------------------------

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/admin');
})

//----------------------------------student CRUD-------------------------------------
router.get('/adminStudentView',(req,res)=>{
  if(req.session.isAuth){  
      Student.find({},null,{sort:{enroll:1}},(err,data)=>{
        if(err){
          res.status(400).send(err);
        }
        else{
          res.status(200).render('adminStudentView',{student:data,user:req.session.user})
          //console.log('data sent...');
          //console.log('student details:',data);
        }
      });
    }
    else{
      res.redirect('/admin/')
    }
});

router.get('/adminStudentDelete/:id', (req,res) => {
  if(req.session.isAuth){
  try {
      const _id = req.params.id;
      const id = _id.substring(1)
      Student.findOneAndDelete({enroll:id},(err,data)=>{
          if(err){
            res.send(err)
          }
          else{
            //console.log('student deleted:',data);
            //console.log('record deleted..');
            res.status(200).redirect('/admin/adminStudentView');
          }
      }); 
  } catch (error) {
      res.status(400).send(error);
  }}
  else{
    res.redirect('/admin/')
  }
});


router.get('/editStudent/:eno',(req,res)=>{
  if(req.session.isAuth){
  const e = req.params.eno;
  const eno = e.substring(1);
  console.log(eno);
  Student.findOne({enroll:eno},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminEditStudent',{std:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

router.post('/updateStudent/:id', (req,res)=>{
  if(req.session.isAuth){
  try {
    const _id = req.params.id;
    const id = _id.substring(1)
    Student.findOneAndUpdate(id,{
            enroll: req.body.eno,
            name : req.body.sname,
            address : req.body.saddress,
            phone : req.body.sphone,
            email : req.body.semail,
            password : req.body.password,
            cpassword : req.body.cpassword,
    },(err,data)=>{
        if(err){
          res.send(err)
        }
        else{
          //console.log('student updated:',data);
          //console.log('record updated..');
          res.status(200).redirect('/admin/adminStudentView');
        }
    }); 
} catch (error) {
    res.status(400).send(error);
}}
else{
  res.redirect('/admin/')
}
});

router.get('/stdSingleView/:eno',(req,res)=>{
  if(req.session.isAuth){
  const e = req.params.eno;
  const eno = e.substring(1);
  //console.log(eno);
  Student.findOne({enroll:eno},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminStdSingleView',{student:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
});
//--------------------------------Student class details CRUD------------------------
   router.get('/adminStudentClassView',(req,res)=>{
    if(req.session.isAuth){
      try {
          StudentDetails.find({},(err,data)=>{
            if(err){
              res.status(400).send(err);
            }
            else{
              res.status(200).render('adminStudentClassView',{student:data,user:req.session.user})
              //console.log('data sent...');
              //console.log('student details:',data);
            }
          });
      } catch (error) {
          res.status(400).send(error);
      }}
      else{
        res.redirect('/admin/')
      }
    });
//------------------------------staff CRUD----------------------------------------------
router.get('/adminStaffView',(req,res)=>{
  if(req.session.isAuth){
    Staff.find({},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminStaffView',{staff:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
});

router.get('/editStaff/:eno',(req,res)=>{
  if(req.session.isAuth){
  const e = req.params.eno;
  const eno = e.substring(1);
  //console.log(eno);
  Staff.findOne({fid:eno},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminEditStaff',{std:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

router.post('/updateStaff/:id', (req,res)=>{
  if(req.session.isAuth){
  try {
    const _id = req.params.id;
    const id = _id.substring(1)
    Staff.findOneAndUpdate(id,{
            
            name : req.body.sname,
            address : req.body.saddress,
            phone : req.body.sphone,
            email : req.body.semail,
            password : req.body.password,
            cpassword : req.body.cpassword,
    },(err,data)=>{
        if(err){
          res.send(err)
        }
        else{
          //console.log('staff updated:',data);
          //console.log('record updated..');
          res.status(200).redirect('/admin/adminStaffView');
        }
    }); 
} catch (error) {
    res.status(400).send(error);
}}
else{
  res.redirect('/admin/')
}
});

router.get('/adminStaffDelete/:id', (req,res) => {
  if(req.session.isAuth){
    try {
      const _id = req.params.id;
      const id = _id.substring(1)
      Staff.findOneAndDelete({fid:id},(err,data)=>{
          if(err){
            res.send(err)
          }
          else{
            //console.log('staff deleted:',data);
            //console.log('record deleted..');
            res.status(200).redirect('/admin/adminStaffView');
          }
      }); 
  } catch (error) {
      res.status(400).send(error);
  }}
  else{
    res.redirect('/admin/')
  }
});

router.get('/staffSingleView/:eno',(req,res)=>{
  if(req.session.isAuth){
  const e = req.params.eno;
  const eno = e.substring(1);
  console.log(eno);
  Staff.findOne({fid:eno},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminStaffSingleView',{student:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
});



//-----------------------------------Course CRUD--------------------------------
router.get('/adminCourseView',(req,res)=>{
  if(req.session.isAuth){
    Course.find({},(err,data)=>{
    if(err){
      res.send(err)
    }
    else{
      res.status(200).render('adminCourseView',{'course':data,user:req.session.user})
    }
  })}
  else{
    res.redirect('/admin/')
  }
})

router.get('/addCourse',(req,res)=>{
  if(req.session.isAuth){
  try {
      res.render('addCourse',{user:req.session.user})
  } catch (error) {
    res.status(400).send(error)
  }}
  else{
    res.redirect('/admin/')
  }
})

router.post('/addCourse', async(req,res)=>{
  if(req.session.isAuth){
    try { 
       console.log('course id',req.body.courseId);
       console.log('course name',req.body.courseName);
       const cor =  new Course({
          cid : req.body.courseId,
          cname : req.body.courseName
        });
        const reply = await cor.save();
        res.status(201).redirect('/admin/adminCourseView');
        console.log('data saved successfully');
  } catch (error) {
    res.status(500).send(error);
  }}
  else{
    res.redirect('/admin/')
  }
})

router.get('/editCourse/:cid',(req,res)=>{
  if(req.session.isAuth){
  const c = req.params.cid;
  const coid = c.substring(1);
  //console.log(eno);
  Course.findOne({cid:coid},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminEditCourse',{cor:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

router.post('/updateCourse/:id', (req,res)=>{
  if(req.session.isAuth){
    try {
    const _id = req.params.id;
    const id = _id.substring(1)
    Course.findOneAndUpdate({cid:id},{
            
      cid : req.body.courseId,
      cname : req.body.courseName
    },(err,data)=>{
        if(err){
          res.send(err)
        }
        else{
          //console.log('Course updated:',data);
          //console.log('record updated..');
          res.status(200).redirect('/admin/adminCourseView');
        }
    }); 
} catch (error) {
    res.status(400).send(error);
}}
else{
  res.redirect('/admin/')
}
});

router.get('/deleteCourse/:id',(req,res)=>{
  if(req.session.isAuth){
  const cid = req.params.id;
  const id = cid.substring(1);
  console.log(id);
  Course.findOneAndDelete({cid:id},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).redirect('/admin/adminCourseView')
      //console.log('data sent...');
    }
  });}
  else{
    res.redirect('/admin/')
  }
})
//--------------------------------------------Subject CRUD------------------------------

router.get('/adminSubjectView',(req,res)=>{
  if(req.session.isAuth){
  Subject.find({},null,{sort:{sid:1}},(err,data)=>{
    if(err){
      res.status(400).send(err)
    }
    else{
      res.render('adminSubjectView',{'subject':data,user:req.session.user});
    }
  })}
  else{
    res.redirect('/admin/')
  }
})

router.get('/addSubject',(req,res)=>{
  if(req.session.isAuth){
  try {
  Course.find({},(err,data)=>{
    if(err){
      res.status(400).send(err)
    }
    else{
      Semester.find({},(err,data1)=>{
        if(err){
          res.status(400).send(err)
        }
        else{
          res.render('addsubject',{'course':data,'sem':data1,'user':req.session.user})
        }
      })
    }
  })
      //console.log('data pass');
  } catch (error) {
   res.status(400).send(error) 
  }}
  else{
    res.redirect('/admin/')
  }
})

router.post('/addSubject',async(req,res)=>{
  if(req.session.isAuth){
  try {
     
      const sub = new Subject({
         subid : req.body.subId,
         subname : req.body.subName,
         cid :  req.body.courseId,
         sid :  req.body.semId
      });
      const reply = await sub.save();
      //console.log('data saved..');
      res.status(201).redirect('/admin/adminSubjectView');
  } catch (error) {
    res.status(400).send(error)
  }}
  else{
    res.redirect('/admin/')
  }
})


router.get('/editSubject/:id',(req,res)=>{
  if(req.session.isAuth){
  const id = req.params.id;
  const subid = id.substring(1);
  //console.log(eno);
  Subject.findOne({subid:subid},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminEditSubject',{sub:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

router.post('/updateSubject/:id', (req,res)=>{
  if(req.session.isAuth){
  try {
    const _id = req.params.id;
    const id = _id.substring(1)
    Subject.findOneAndUpdate({subid:id},{
            
      subid : req.body.subId,
      subname : req.body.subName,
      cid : req.body.courseId,
      sid : req.body.semId
    },(err,data)=>{
        if(err){
          res.send(err)
        }
        else{
          //console.log('Course updated:',data);
          //console.log('record updated..');
          res.status(200).redirect('/admin/adminSubjectView');
        }
    }); 
} catch (error) {
    res.status(400).send(error);
}}
else{
  res.redirect('/admin/')
}
});

router.get('/deleteSubject/:id',(req,res)=>{
  if(req.session.isAuth){
  const sid = req.params.id;
  const id = sid.substring(1);
  console.log(id);
  Subject.findOneAndDelete({subid:id},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      //console.log(data);
      res.status(200).redirect('/admin/adminSubjectView')
      //console.log('data sent...');
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

//--------------------------------------Class CRUD-------------------------------
router.get('/adminClassView',(req,res)=>{
  if(req.session.isAuth){
  ClassTable.find({},(err,data)=>{
    if(err){
      res.status(400).send(err)
    }
    else{
      res.render('adminClassView',{class:data,user:req.session.user});
    }
  })}
  else{
    res.redirect('/admin/')
  }
})

router.get('/addClass',(req,res)=>{
  if(req.session.isAuth){
  ClassTable.find({},(err,data)=>{
    if(err){
        res.send(err)
    }
    else{
      res.render('addClass',{user:req.session.user})
    }
  })}
  else{
    res.redirect('/admin/')
  }
  
})

router.post('/addClass', async(req,res)=>{
  if(req.session.isAuth){
  try {
    const cls = new ClassTable({
      class_id : req.body.classId,
      className : req.body.clsName
   });
   const reply = await cls.save();
   //console.log('data saved..');
   res.status(201).redirect('/admin/adminClassView');
  } catch (error) {
    res.status(500).send(error)
  }   }
  else{
    res.redirect('/admin/')
  }
})


router.get('/editClass/:id',(req,res)=>{
  if(req.session.isAuth){
  const id = req.params.id;
  const clsid = id.substring(1);
  //console.log(clsid);
  ClassTable.findOne({class_id:clsid},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminEditClass',{class:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

router.post('/updateClass/:id', (req,res)=>{
  if(req.session.isAuth){
  try {
    const _id = req.params.id;
    const id = _id.substring(1)
    ClassTable.findOneAndUpdate({class_id:id},{
      class_id : req.body.classId,
      className : req.body.clsName
    },(err,data)=>{
        if(err){
          res.send(err)
        }
        else{
         // console.log('Class updated:',data);
          //console.log('record updated..');
          res.status(200).redirect('/admin/adminClassView');
        }
    }); 
} catch (error) {
    res.status(400).send(error);
}}
else{
  res.redirect('/admin/')
}
});

router.get('/deleteClass/:id',(req,res)=>{
  if(req.session.isAuth){
  const sid = req.params.id;
  const id = sid.substring(1);
  console.log(id);
  ClassTable.findOneAndDelete({class_id:id},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).redirect('/admin/adminClassView')
      //console.log('data sent...');
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

//---------------------------------Lecture CRUD-----------------------------------

router.get('/adminLecView',(req,res)=>{
  if(req.session.isAuth){
  Lecture.find({},(err,data)=>{
    if(err){
      res.send(err)
    }
    res.render('adminLecView',{lec:data,user:req.session.user});
  })
}
else{
  res.redirect('/admin/')
}
    
})


router.get('/addLec',(req,res)=>{
  if(req.session.isAuth){
  Staff.find({},(err,data)=>{
    if(err){
        res.send(err)
    }
    else{
      ClassTable.find({},(err,data1)=>{
        Subject.find({},null,{sort:{subid:1}},(err,data2)=>{
          res.render('addLec',{'staff':data,'class':data1,'subject':data2,user:req.session.user})
        })
      })
      
     
    }
  })
}
else{
  res.redirect('/admin/')
}
})

router.post('/addLec', async(req,res)=>{
  if(req.session.isAuth){
  try {
    const lec = new Lecture({
      classid : req.body.classId,
      fid:  req.body.fId,
      subid: req.body.sId
   });
   const reply = await lec.save();
   //console.log('data saved..');
   res.status(201).redirect('/admin/adminLecView');
  } catch (error) {
    res.status(500).send(error)
  }   }
  else{
    res.redirect('/admin/')
  }
})



router.get('/editLec/:id',(req,res)=>{
  if(req.session.isAuth){
  const _id = req.params.id;
  const id = _id.substring(1);
  //console.log(eno);
  Lecture.findOne({_id:id},(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      res.status(200).render('adminEditLec',{lec:data,user:req.session.user})
      //console.log('data sent...');
      //console.log('student details:',data);
    }
  });}
  else{
    res.redirect('/admin/')
  }
})

router.post('/updateLec/:id', (req,res)=>{
  if(req.session.isAuth){
  try {
    const _id = req.params.id;
    const id = _id.substring(1);
    console.log(id);
    Lecture.findOneAndUpdate({_id:id},{
      classid : req.body.classId,
      fid:  req.body.fId,
      subid: req.body.sId
    },(err,data)=>{
        if(err){
          res.send(err)
        }
        else{
          res.status(200).redirect('/admin/adminLecView');
        }
    }); 
} catch (error) {
    res.status(400).send(error);
}}
res.redirect('/admin/')
});

router.get('/deleteLec/:id',(req,res)=>{
  if(req.session.isAuth){
  const sid = req.params.id;
  const id = sid.substring(1);
  console.log(id);
  Lecture.findByIdAndDelete(id,(err,data)=>{
    if(err){
      res.status(400).send(err);
    }
    else{
      console.log(data);
      res.status(200).redirect('/admin/adminLecView')
      //console.log('data sent...');
    }
  });}
  else{
    res.redirect('/admin/')
  }
})


module.exports = router;
