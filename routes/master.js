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
                        res.json({success:true, masters:masters})
                    }
                }
            })
        }
    })

    router.route('/deleteBlog/:id').delete((req,res)=>{
        Blog.remove({
            _id: req.params.id
        },(err,blog)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                res.json({success:true,message:'Blog successfully deleted'})
            }
        })
    })
    return router;
}