const User = require('../models/user');
const Blog = require('../models/blog');
const Master = require('../models/master');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Category = require('../models/category');


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

    router.route('/allCategories').get((req,res)=>{
        Category.findById("5b7cee683555323a73212033",(err,categories)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                if(!categories){
                    res.json({success:false,message:'There is some problem on the serrver'})
                }else{
                    res.json({success:true,message:'Success', categories:categories})
                }
            }
        })
    })

    router.route('/newCategory').post((req,res)=>{
        if(!req.body['category']){
            res.json({success:false,message:'No category to save'})
        }else{
            Category.findById("5b7cee683555323a73212033",(err,category)=>{
                if(err){
                    res.json({success:false,message:err})
                }else{
                    if(!category){
                        res.json({success:false,message:'There is some problems on a server'})
                    }else{
                        if(category.category.includes(req.body['category'])){
                            res.json({success:false,message:'This category already exists'})
                        }else{
                            category.category.push(req.body['category']);
                            category.save((err,category)=>{
                                if(err){
                                    res.json({success:false,message:err})
                                }else{
                                    res.json({success:true,message:'Success',category:category})
                                }
                            })
                        }
                    }
                }
            })
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