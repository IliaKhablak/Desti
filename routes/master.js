const User = require('../models/user');
const Blog = require('../models/blog');
const Master = require('../models/master');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router)=>{

    router.post('/newMaster', (req,res)=>{
        if(!req.body['name']){
            res.json({success:false,message:'Master name is required.'})
        }else{
            if(!req.body['skills']){
                res.json({success:false,message:'Master skills is required.'})
            }else{
                const master = new Master({
                    name: req.body.name,
                    about: req.body.about,
                    skills: req.body.skills,
                    createdBy: req.body.createdBy
                });
                // console.log(blog);
                master.save((err)=>{
                    if(err){
                        if(err.errors){
                            if(err.errors.name){
                                res.json({success:false,message:err.errors.name.message})
                            }else{
                                if(err.errors.skills){
                                    res.json({success:false,message:err.errors.skills.message})
                                }else{
                                    res.json({success:false,message:err.errors.createdBy.message})
                                }
                            }
                        }else{
                            res.json({success:false,message:err})
                        }
                    }else{
                        res.json({success:true,message:'Master saved'})
                    }
                })
            }
        }
    })

    router.get('/allMasters/:username', (req,res)=>{
        // console.log(req.params.username);
        if(!req.params.username){
            res.json({success:false,message:'No username presented'})
        }else{
            Master.find({createdBy: req.params.username},(err,masters)=>{
                if (err){
                    res.json({success:false,message:err})
                }else{
                    if(masters.length < 1){
                        res.json({success:false,message:'There is no masters yet'})
                    }else{
                        res.json({success:true, message:'Success!',masters:masters})
                    }
                }
            })
        }
    })

    router.route('/deleteMaster/:id').delete((req,res)=>{
        Master.remove({
            _id: req.params.id
        },(err,master)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                res.json({success:true,message:'Master successfully deleted'})
            }
        })
    })

    router.route('/update').put((req,res)=>{
     if(!req.body['_id']){
         res.json({success:false,message:'Master is not presented'})
     }else{
         Master.findById(req.body['_id'],(err,master)=>{
             if(err){
                 res.json({success:false,message:err})
             }else{
                 if(!master){
                     res.json({success:false,message:'Master hase not found'})
                 }else{
                    //  console.log(req.decoded.userId)
                     master.name = req.body['name'];
                     master.about = req.body['about'];
                     master.skills = req.body['skills'];
                     master.save((err,newMaster)=>{
                         if (err){
                             res.json({success:false,message:err})
                         }else{
                            res.json({success:true, message:'Master updated'})
                         }
                     })
                 }
             }
         })
     }
    })
    return router;
}