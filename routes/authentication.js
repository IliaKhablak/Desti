const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Blog = require('../models/blog');


module.exports = (router)=>{
    router.post('/register', (req,res)=>{
        // console.log(req.body)
        if(!req.body.email){
            res.json({success:false, message: 'You must provide an e-mail'});
        }else{
            if(!req.body.username){
                res.json({success:false, message: 'You must provide a username'});
            }else{
                if(!req.body.password){
                    res.json({success:false, message: 'You must provide a password'});
                }else{
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err)=>{
                        if(err){
                            if(err.code === 11000){
                                res.json({success:false, message:'Username or e-mail alredy exists'})
                            }else{
                                if(err.errors.email){
                                    res.json({success:false, message:err.errors.email.message})
                                }else{
                                    if(err.errors.username){
                                        res.json({success:false, message:err.errors.username.message})
                                    }else{
                                        if(err.errors.password){
                                            res.json({success:false, message:err.errors.password.message})
                                        }else{
                                            res.json({success:false, message:'Could not save user. Error: ', err})
                                        }
                                    }
                                }
                            }
                        }else{
                            const token = jwt.sign({userId:user._id},config.secret,{expiresIn:86400});
                            res.json({success:true,message:'User saved!',token:token, expiresIn:86400, user:{username:user.username,email:user.email}})                        
                        }
                    });
                }
            }
        }
        
    });
    router.get('/checkEmail/:email', (req,res)=>{
        if(!req.params.email){
            res.json({success:false,message:'E-mail was not provided'})
        }else{
            User.findOne({email:req.params.email},(err,user)=>{
                if(err){
                    res.json({success:false,message:err})
                }else{
                    if(user){
                        res.json({success:false,message:'E-mail is alredy taken'})
                    }else{
                        res.json({success:true,message:'E-mail is avalible'})
                    }
                }
            })
        }
    })

    router.get('/checkUsername/:username', (req,res)=>{
        if(!req.params.username){
            res.json({success:false,message:'User name was not provided'})
        }else{
            User.findOne({username:req.params.username},(err,user)=>{
                if(err){
                    res.json({success:false,message:err})
                }else{
                    if(user){
                        res.json({success:false,message:'User name is alredy taken'})
                    }else{
                        res.json({success:true,message:'User name is avalible'})
                    }
                }
            })
        }
    })

    router.post('/login', (req,res)=>{
        if(!req.body.email){
            res.json({success:false,message:'No email was provided'})
        }else{
            if(!req.body.password){
                res.json({success:false,message:'No password was provided'})
            }else{
                User.findOne({email:req.body.email.toLowerCase()},(err,user)=>{
                    if(err){
                        res.json({success:false,message:err})
                    }else{
                        if(!user){
                            res.json({success:false,message:'User not found'})
                        }else{
                            const validPass = user.comparePassword(req.body.password);
                            // console.log(validPass);
                            if(!validPass){
                                res.json({success:false,message:'Wrong password'})
                            }else{
                                const token = jwt.sign({userId:user._id},config.secret,{expiresIn:86400});
                                res.json({success:true,message:'Success!',token:token, expiresIn:86400, user:{username:user.username,email:user.email}})
                            }
                        }
                    }
                })
            }
        }
    })

    router.get('/allBlogs', (req,res)=>{
        Blog.find({},(err,blogs)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                if(!blogs){
                    res.json({success:false,message:'No blogs found'})
                }else{
                    res.json({success:true,blogs:blogs})
                }
            }
        }).sort({'_id': -1}).limit(20);
    }) 

    router.get('/findBlog/:title', (req,res)=>{
        console.log(req.params.title);
        const title = req.params.title.toString();
        if(!req.params.title){
            res.json({success:false,message:'Nothig to search'})
        }else{
            Blog.find({title: new RegExp(title, "i")},(err,blog)=>{
                if (err){
                    res.json({success:false,message:err})
                }else{
                    res.json({success:true, blog: blog})
                }
            }).limit(20);
        }
    })

    // router.use((req,res,next)=>{
    //     const bla = [];
    //     for(let i = 0;i<5000;i++){
    //         bla[i] = {
    //             title: 'Post No. '+i,
    //             body: 'Description for post No. ' + i,
    //             createdBy: 'ilia'
    //         }
    //     }
    //     Blog.insertMany(bla);
    //     next();
    // })

    router.use((req,res,next)=>{
        const token = req.headers['authorization']
        if(!token){
            res.json({success:false, message:'No token provided'})
        }else{
            jwt.verify(token,config.secret,(err,decoded)=>{
                if(err){
                    res.json({success:false,message:'Token invalid'+err})
                }else{
                    req.decoded = decoded;
                    next();
                }
            })
        }
    })

    router.get('/profile', (req,res)=>{
        // console.log(req.decoded.userId);
        User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                if(!user){
                    res.json({success:false,message:'User not found'})
                }else{
                    res.json({success:true,user:user})
                }
            }
        })
    })
    return router;
}