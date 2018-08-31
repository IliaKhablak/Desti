const User = require('../models/user');
const Blog = require('../models/blog');
const Master = require('../models/master');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Category = require('../models/category');
const Day = require('../models/day');
const mongoose = require('mongoose');
const WebSocket = require('ws');

module.exports = (router,server)=>{
    router.route('/day/:day').get((req,res)=>{
        var arr = req.params['day'].split("_");
        const date = arr[0];
        const masterId = arr[1];
        if(!req.params['day']){
            res.json({success:false,message:'Day not spesified'})
        }else{
            if(!req.decoded.userId){
                res.json({success:false,message:'User not spesified'})
            }else{
                Day.find({date:date,_userId:req.decoded.userId,_masterId:masterId},(err,day)=>{
                    if(err){
                        res.json({success:false,message:err})
                    }else{
                        if(!day || day.length < 1){
                            res.json({success:false,message:'There is no work for this master today',day:[]})
                        }else{
                            res.json({success:true,message:'Success',day:day})
                        }
                    }
                })
            }
        }
    })

    router.route('/newDay').post((req,res)=>{
        if(!req.body){
            res.json({success:false,message:'No information provided'})
        }else{
            Day.findOne({_userId:req.body._userId,_masterId:req.body._masterId,date: req.body.date,hour:req.body.hour},(err,unit)=>{
                if(err){
                    res.json({success:false,message:err})
                }else{
                    if(unit){
                        res.json({success:false,message:'This position already created'})
                    }else{
                        const unit = new Day({
                            _userId: req.body._userId,
                            _masterId:req.body._masterId,
                            date: req.body.date,
                            categories: req.body.categories,
                            hour:req.body.hour
                        });
                        unit.save((err,newUnit)=>{
                            if(err){
                                res.json({success:false,message:err})
                            }else{
                                res.json({success:true,message:'Success',unit:newUnit})
                            }
                        })
                    }
                }
            })
        }
    })

    router.route('/removeDay/:day').delete((req,res)=>{
        if(!req.params.day){
            res.json({success:false,message:'No id provided'})
        }else{
            Day.remove({
                _id: req.params.day
            },(err,master)=>{
                if(err){
                    res.json({success:false,message:err})
                }else{
                    server.clients.forEach(client=>{
                        if(client.readyState === WebSocket.OPEN){
                            client.send(JSON.stringify({type:'day',action:'remove',dayId:req.params.day}));
                        }
                    });
                    res.json({success:true,message:'Unit successfully deleted'})
                }
            })
        }
    });

    router.route('/search').post((req,res)=>{
        const id = mongoose.Types.ObjectId(req.decoded.userId);
        Day.aggregate([
            {
                $match: {categories: { "$in" : req.body['categories']},date:req.body['date'],hour:{"$in":req.body['hours']}, $or:[{booked:false},{_bookedBy:id}]},
            },
            {
                $lookup:{
                    from:'users',
                    localField:'_userId',
                    foreignField:'_id',
                    as:"user"
                }
            },{
                $unwind: "$user"
            },{
                $addFields: {
                    "user.password":null
                }
            },
            {
                $lookup:{
                    from:"masters",
                    localField:"_masterId",
                    foreignField:"_id",
                    as:"master"
                }
            },{
                $unwind: "$master"
            }
        ],function (err, result) {
            if (err) {
                res.json({success:false,message:err});
            } else {
                res.json({success:true,message:'Success',res:result})
            }
        })
    })

    router.route('/allBookings/:date').get((req,res)=>{
        const id = mongoose.Types.ObjectId(req.decoded.userId);
        Day.aggregate([
            {
                $match: {date:req.params['date'], _userId:id},
            },
            {
                $lookup:{
                    from:"masters",
                    localField:"_masterId",
                    foreignField:"_id",
                    as:"master"
                }
            },{
                $unwind: "$master"
            }
        ],function (err, result) {
            if (err) {
                res.json({success:false,message:err});
            } else {
                res.json({success:true,message:'Success',res:result})
            }
        })
    })

    router.route('/update').post((req,res)=>{
        if(!req.body){
            res.json({success:false,message:'No information presented'})
        }else{
            Day.findById(req.body._id,(err,day)=>{
                if(err){
                    res.json({success:false,message:err})
                }else{
                    if(!day){
                        res.json({success:false,message:'Booking not found'})
                    }else{
                        if(!req.body['_bookedBy']){
                            if(req.body['reason']){
                                day.reason = req.body['reason'];
                                day.unbooked = true;
                            }
                            day._bookedBy = null;
                            day.booked = req.body['booked'];
                            
                        }else{
                            day._bookedBy = req.body['_bookedBy'];
                            day.booked = req.body['booked'];
                        }
                        day.save((err,newDay)=>{
                            if(err){
                                res.json({success:false,message:err})
                            }else{
                                server.clients.forEach(client=>{
                                    if(client.readyState === WebSocket.OPEN){
                                        client.send(JSON.stringify({type:'day',action:'update',dayId:newDay._id,day:newDay}));
                                    }
                                });
                                res.json({success:true,message:'Success',day:newDay})
                            }
                        })
                    }   
                }
            })
        }
        // res.json({success:false,message:'Bla'})
    })

    return router;
}