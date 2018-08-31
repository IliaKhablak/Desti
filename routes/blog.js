const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router,server)=>{
    router.post('/newBlog', (req,res)=>{
        // console.log(req.body);
        if(!req.body['title']){
            res.json({success:false,message:'Blog title is required.'})
        }else{
            if(!req.body['body']){
                res.json({success:false,message:'Blog body is required.'})
            }else{
                const blog = new Blog({
                    title: req.body.title,
                    body: req.body.body,
                    createdBy: req.body.createdBy
                });
                // console.log(blog);
                blog.save((err,blog)=>{
                    if(err){
                        if(err.errors){
                            if(err.errors.title){
                                res.json({success:false,message:err.errors.title.message})
                            }else{
                                if(err.errors.body){
                                    res.json({success:false,message:err.errors.body.message})
                                }else{
                                    res.json({success:false,message:err.errors.createdBy.message})
                                }
                            }
                        }else{
                            res.json({success:false,message:err})
                        }
                    }else{
                        server.clients.forEach(client=>{
                            if(client.readyState === WebSocket.OPEN){
                                client.send(JSON.stringify({type:'blog'}));
                            }
                        })
                        res.json({success:true,message:'Blog saved'})
                    }
                })
            }
        }
    })

    router.route('/deleteBlog/:id').delete((req,res)=>{
        Blog.remove({
            _id: req.params.id
        },(err,blog)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                server.clients.forEach(client=>{
                    if(client.readyState === WebSocket.OPEN){
                        client.send(JSON.stringify({type:'blog'}));
                    }
                })
                res.json({success:true,message:'Blog successfully deleted'})
            }
        })
    })
    return router;
}