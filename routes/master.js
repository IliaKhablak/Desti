const Master = require('../models/master');
const config = require('../config/database');
const Category = require('../models/category');
const multer = require('multer');
const sharp = require('sharp');

const store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+'-'+file.originalname);
    }
});
const upload = multer({storage:store}).single('file');
var avatarPath = null;
var thumb_avatarPath = null;

module.exports = (router,storage)=>{
    router.post('/newMaster', (req,res)=>{
        // console.log(req.body);
        if(!req.body['name']){
            res.json({success:false,message:'Master name is required.'})
        }else{
            if(!req.body['skills']){
                res.json({success:false,message:'Master skills is required.'})
            }else{
                let c = false;
                let params;
                if(avatarPath){
                    let a = [];
                    storage
                    .bucket('desti')
                    .upload(thumb_avatarPath, {
                        gzip: true,
                        metadata: {
                        cacheControl: 'public, max-age=31536000',
                        },
                    })
                    .then(() => {
                        a.push('wow');
                        console.log('success');
                    })
                    .catch(err => {
                        res.json({success:false,message:err});
                    });
                    storage
                        .bucket('desti')
                        .upload(avatarPath, {
                            gzip: true,
                            metadata: {
                            cacheControl: 'public, max-age=31536000',
                            },
                        })
                        .then(() => {
                            a.push('wow');
                            console.log('success');
                        })
                        .catch(err => {
                            res.json({success:false,message:err});
                    });
                    let b = setInterval(()=>{
                        if(a.length>1){
                            let filename = avatarPath.split('/')[avatarPath.split('/').length-1];
                            let thumb_filename = thumb_avatarPath.split('/')[thumb_avatarPath.split('/').length-1];
                            params = {
                                name: req.body.name,
                                about: req.body.about,
                                skills: req.body.skills,
                                _userId: req.decoded.userId,
                                avatar: "https://storage.googleapis.com/desti/"+filename,
                                thumbAvatar: "https://storage.googleapis.com/desti/"+thumb_filename
                            };
                            avatarPath = null;
                            thumb_avatarPath = null;
                            c = true;
                            clearInterval(b);
                        }
                    },100)
                }else{
                    params = {
                        name: req.body.name,
                        about: req.body.about,
                        skills: req.body.skills,
                        _userId: req.decoded.userId
                    };
                    c = true;
                }
                let d = setInterval(()=>{
                    if(c){
                        const master = new Master(params);
                        master.save((err,newMaster)=>{
                            if(err){
                                if(err.errors){
                                    if(err.errors.name){
                                        res.json({success:false,message:err.errors.name.message})
                                    }else{
                                        if(err.errors.skills){
                                            res.json({success:false,message:err.errors.skills.message})
                                        }else{
                                            res.json({success:false,message:err.errors._userId.message})
                                        }
                                    }
                                }else{
                                    res.json({success:false,message:err})
                                }
                            }else{
                                    res.json({success:true,message:'Master successfully creted'})                     
                            }
                        })
                        clearInterval(d);
                    }
                },100)
            }
        }
    })

    router.post('/imgUpload', (req,res)=>{
        upload(req,res,function(err){
            if(err){
                return res.json({success:false, message:err});
            }else{
                const host = req.hostname;
                // const filePath = req.protocol + "://" + host + '/' + req.file.path;
                const filePath = req.protocol + "://" + host + ':8080/' + req.file.path;
                avatarPath = req.file.path;
                let arr = req.file.path.split('.');
                arr[arr.length-2] = arr[arr.length-2] + '_thumb';
                thumb_avatarPath =  arr.join('.');
                sharp(avatarPath)
                .resize(300)
                .toFile(thumb_avatarPath)
                .then(data => {
                    // console.log(data);
                    return res.json({success:true,path:filePath,uploadname:req.file.filename});
                })
                .catch(function(e) {
                    console.log('Error', e.toString());
                });
            }
        })
    })

    router.route('/allCategories').get((req,res)=>{
        Category.findById(config.categoryId,(err,categories)=>{
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
            Category.findById(config.categoryId,(err,category)=>{
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

    router.get('/allMasters', (req,res)=>{
        // console.log(req.params.username);
        if(!req.decoded.userId){
            res.json({success:false,message:'No username presented'})
        }else{
            Master.find({_userId: req.decoded.userId},(err,masters)=>{
                if (err){
                    res.json({success:false,message:err})
                }else{
                    if(masters.length < 1){
                        res.json({success:false,message:'There is no masters yet',masters:[]})
                    }else{
                        res.json({success:true, message:'Success!',masters:masters})
                    }
                }
            })
        }
    })

    router.route('/deleteMaster/:id').delete((req,res)=>{
        Master.findById(req.params.id, (err,master)=>{
            if(err){
                res.json({success:false,message:err})
            }else{
                if(master.avatar){
                    let url = master.avatar.split('/')[master.avatar.split('/').length-1];
                    let thumb_url = master.thumbAvatar.split('/')[master.thumbAvatar.split('/').length-1];
                    storage
                        .bucket('desti')
                        .file(url)
                        .delete()
                        .then(() => {
                            console.log('success');
                        })
                        .catch(err => {
                            console.error('ERROR:', err);
                    });
                    storage
                        .bucket('desti')
                        .file(thumb_url)
                        .delete()
                        .then(() => {
                            console.log('success');
                        })
                        .catch(err => {
                            console.error('ERROR:', err);
                    });
                }
                master.remove((err)=>{
                    if(err){
                        res.json({success:false,message:err})
                    }else{
                        res.json({success:true,message:'Master successfully deleted!'})
                    }
                })
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