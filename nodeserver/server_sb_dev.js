/**
 * Created by InfluxIQ09 on 2/7/2019.
 */
var fs = require("fs"),
    readline = require("readline");

var express = require('express');
var app = express();
//var port = process.env.PORT || 7001;
var port = process.env.PORT || 7002;
var request = require('request');
var cheerio = require('cheerio');
var mailer = require("nodemailer");
var moment = require('moment');
var randomString = require('random-string');
var http = require('http').Server(app);

/*/!*SSL*!/
var https = require('https');
var keyval=fs.readFileSync('./nexgentesting.key','utf8');
var certval=fs.readFileSync('./12d914352623c010.crt','utf8');
var options = {
    key: keyval,
    cert:certval
};
/!*SSL*!/*/



/*Access token JWT Verification*/

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
app.set('superSecret', config.secret); // secret variable

/*Access token JWT Verification*/

var momenttz = require('moment-timezone');

var bodyParser = require('body-parser');
app.use(
    bodyParser.json({
        parameterLimit: 10000000,
        limit: '90mb'
    })
);
app.use(
    bodyParser.urlencoded({
        parameterLimit: 10000000,
        limit: '90mb',
        extended: false})
);
var EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();
emitter.setMaxListeners(0)
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(function(req, res, next) {
    //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var mongodb = require('mongodb');
var db;
var url = 'mongodb://localhost:27017';
var MongoClient = mongodb.MongoClient;
MongoClient.connect(url, function (err, database) {
    if(err){
        console.log(err);
    }else{
        db=database.db('sb_dev');
        console.log("connected");
        //console.log(database);
    }
});

var tokenstatus='';
app.get('/test1',function(req,resp){
    console.log('etgggggggggggeset');
    //resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
   // return;
    var collection= db.collection('test');

    collection.insert([{

        added_time: moment().unix(),
        user_id:  'rr',
        linkid:  22
    }], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
        } else {
            resp.send(JSON.stringify({'status':'success','msg':'data inserted successfully !!'}));
        }
    });
});

var server = app.listen(port,'', function () {
    var host = server.address().address;
    var port = server.address().port;
});


/*-----Image----*/
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        //  cb(null, '../uploads/');
        // cb(null, '../src/assets/images/uploads/'); //for local
        //  cb(null, '/home/nexhealthtoday/public_html/assets/images/uploads/'); //for server
        cb(null, '../uploads/'); //for server
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        filename=file.originalname.split('.')[0].replace(/ /g,'') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        console.log(filename);
        cb(null, filename);
    }
});
var upload = multer({
    storage: storage
}).single('file');
app.post('/uploads', function(req, res) {
    datetimestamp = Date.now();

   /* if(7==7){
        res.json({error_code:1,err_desc:'File type not supported !!',rq:req.body});
        return;
    }*/
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:req.body});
            return;
        }
        else{
           console.log(filename);
           res.send(JSON.stringify(filename));
            return;
        }
    });
});

/*-----Image----*/
var rnval;
function randomnogenerate(tablename){
    rnval = null;
    var generatecodes=randomString({
        length: 5,
        numeric: true,
        letters: false,
        special: false
    });

    var collection = db.collection(tablename);
    collection.find({unique_id:generatecodes}).toArray(function(err, items) {
        if (items.length > 0) {
            randomnogenerate();
        }
        else{
             rnval = generatecodes;
        }
    });
}

app.post('/leadsignup', function (req, resp) {
    randomnogenerate('users');
    setTimeout(function () {
    var collection = db.collection('users');
    collection.insert([{
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phoneno: req.body.phoneno,
        city: req.body.city,
        state: req.body.state,
        regionalrecruiter_id: new mongodb.ObjectID(req.body.regionalrecruiter_id),
        lead_step: req.body.lead_step,
        type: req.body.type,
        created_at: new Date().getTime(),
        unique_id: rnval
    }], function (err, result) {
        if (err) {
            console.log('error'+err);
            resp.send(JSON.stringify({'status':'error','id':0}));
        } else {
            var tokenis = createjwttoken();
            if(tokenis!=null){
    /*            resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id,token:createjwttoken()})); return;*/
                var o_id = new mongodb.ObjectID(result.ops[0]._id);
                collection.find({_id:o_id}).toArray(function(err, items) {
                    if (err) {
                        resp.send(JSON.stringify({'status':'error','id':0}));
                        return;
                    } else {
                        resitem = items[0];
                        resp.send(JSON.stringify({'status':'success','item':resitem,token:createjwttoken()}));
                      //  resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id,token:createjwttoken()}));
                        return;
                    }
                });
            }else{
                resp.send(JSON.stringify({'status':'error','msg':'Contact to site administrator for further information!'}));
                return;
            }
        }
    });
    },100);
});


app.post('/leadsignupquestionnaireupdate',function (req,resp) {
    var collection = db.collection('users');
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
  //  console.log('tokenstatus');
  //  console.log(tokenstatus);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    else{
        var o_id = new mongodb.ObjectID(req.body.data.id);
        var crypto = require('crypto');
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
            .update('password')
            .digest('hex');
        for(var i in req.body.sourceobj){
            if(req.body.data[req.body.sourceobj[i]]!=null){
                req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
            }
        }
        if(req.body.data.contractstep==1){
            req.body.data.contractsigndate= new Date().getTime();
            req.body.data.status= 1;
        }

        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.id)!='undefined')  req.body.data.id = null;
        collection.update({_id:o_id}, {$set: req.body.data}, true, true);
        resp.send(JSON.stringify({'status':'success',update:1}));
        return;
    }
});


app.post('/addtocalendar',function (req,resp) {

    //resp.send(JSON.stringify({'resc':req.body}));
    //return;
    var str = [];
    var obj=req.body;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
            //console.log(key + " -> " + obj[key]);
        }
    }
    str= str.join("&");

    request.post({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     'http://api.nexgentesting.com/gapi/t3.php',
        body:    str
    }, function(error, response, body){
        //console.log(body);
        var o_id = new mongodb.ObjectID(req.body.eid);
        var collection = db.collection('eventdayarr');
        collection.update({"_id":o_id}, {$pull: {"slots": req.body.slot.trim()}});
        //collection.update({"_id":o_id}, {'$pull': {"slots": req.body.i}});
        body=JSON.parse(body);

        req.body.googleevent=body.id;
        req.body.id=new mongodb.ObjectID(req.body.id);
        req.body.emailid=req.body.attendees[0];


        var collection1 = db.collection('googleevents');
        collection1.insert([req.body], function (err1, result1) {
            if (err1) {
                console.log('error' + err1);
                //  console.log(obj);
                // resp.send(JSON.stringify({'status': 'error', 'id': 0}));
            }else{
                console.log('inserted!');
                //console.log(obj);
            }
        });

        resp.send(JSON.stringify({resc:req.body,body:body,solot:req.body.slot,id:body.id}));
        return;
    });



});
app.post('/getregionalrecruiter',function (req,resp) {
   /* var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);*/

    var collection = db.collection(req.body.source.toString());
    collection.find({state:{$in:req.body.state}}).sort({noofreps:1}).limit(1).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });

});


app.post('/addtraininglesson',function (req,resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    else{
        var crypto = require('crypto');
        var added_time= new Date().getTime();
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
            .update('password')
            .digest('hex');
        for(var i in req.body.sourceobj){
            req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
        }
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.confirmpassword)!='undefined')  req.body.data.confirmpassword = null;
        var collection = db.collection(req.body.source.toString());
        if(typeof(req.body.data.id)=='undefined'){
            req.body.data['created_at']=added_time;
            collection.insert([req.body.data], function (err, result) {
                if (err) {
                    resp.send(JSON.stringify({'status':'failed','id':0}));
                } else {
                    resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
                    return;
                }
            });
        }
    }
});

app.post('/togglestatus',function(req,resp){

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
   // console.log('tokenstatus');
   // console.log(tokenstatus);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    req.query=req.body;
    var collection = db.collection(req.query.source.toString());
    var o_id = new mongodb.ObjectID(req.query.id);     //[we use ObjectId to convert the data otherwise we could not get it]
    collection.update({_id:o_id}, {$set: {status:req.query.status}}, true, true);  //[_id defined that in database it is defined  _id so we used _id here to match field]

    resp.send(JSON.stringify({'status':'success'}));
});
app.get('/unlockemail',function(req,resp){

    var collection = db.collection('rep_view');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            //  console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {

            var collection1 = db.collection('users');
            // /var o_id = new mongodb.ObjectID(req.query.id);
            collection1.find({type:'admin'}).toArray(function(err, aitems) {
                if (err) {
                    //  console.log(err);
                    resp.send(JSON.stringify({'res':[]}));

                } else {

                    var ar=[];
                    for(a in aitems)
                    {
                        ar.push(aitems[a].email)
                    }
                    ar=ar.join(',');
                    var url='http://api.nexgentesting.com/php/mail/unlockaccount.php?email='+items[0].email+'&recname='+items[0].recruiter+'&recemail='+items[0].recemail+'&adminemail='+ar;


                    request(url, function (error, response, body) {
                        resp.send(JSON.stringify({'res':items,'admin':ar,url:url,body:body}));
                    });

                }
            });


            //resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });

    //resp.send(JSON.stringify({'status':'error',errormessage:req}));
});
app.get('/docemail',function(req,resp){
    console.log('in docemail');
    console.log(req.query);

    var collection = db.collection('rep_view');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            //  console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {

            var collection1 = db.collection('users');
            // /var o_id = new mongodb.ObjectID(req.query.id);
            collection1.find({type:'admin'}).toArray(function(err, aitems) {
                if (err) {
                    //  console.log(err);
                    resp.send(JSON.stringify({'res':[]}));

                } else {

                    var ar=[];
                    for(a in aitems)
                    {
                        ar.push(aitems[a].email)
                    }
                    console.log(items);
                    console.log(items[0]);
                    ar.push(items[0].recemail);
                    ar=ar.join(',');
                    http://api.nexgentesting.com/php/mail/docsubmit.php?recemail=ipsita.influxiq@gmail.com&adminemail=ipsitaghosal1@gmail.com&repname=Jamestest&formname=w9


                        var smtpTransport = mailer.createTransport({
                            service: "Gmail",
                            auth: {
                                user: "itplcc40@gmail.com",
                                pass: "DevelP7@"
                            }
                        });

                    var mail = {
                        from: "Nexgen Admin <support@nexgen.com>",
                        to: ar,
                        subject: items[0].fullname+' has submitted '+req.query.doctype,
                        html: '<p>'+items[0].fullname+' has submitted '+req.query.doctype+'<p>Click here:<a href="https://nexgentesting.com/rep">https://nexgentesting.com/rep</a></p>',
                           // html += '<p>Click here:<a href="https://nexgentesting.com/rep">https://nexgentesting.com/rep</a></p>',
                    }
                    smtpTransport.sendMail(mail, function (error, response) {
                        console.log('send');
                        console.log('error');
                        console.log(error);
                        console.log(response);
                        smtpTransport.close();
                        resp.send(JSON.stringify({'status':'success','msg':items[0],response:response,error:error}));
                        return;
                    });



               /*     var url='http://api.nexgentesting.com/php/mail/docsubmit.php?email='+items[0].email+'&repname='+items[0].fullname+'&recemail='+items[0].recemail+'&adminemail='+ar+'&formname='+req.query.doctype;


                    request(url, function (error, response, body) {
                        resp.send(JSON.stringify({'res':items,'admin':ar,url:url,body:body}));
                    });*/

                }
            });


            //resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });

    //resp.send(JSON.stringify({'status':'error',errormessage:req}));
});


app.post('/togglelockedstatus',function(req,resp){

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
 //   console.log('tokenstatus');
 //   console.log(tokenstatus);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    req.query=req.body;

    if(req.query.status==1){

        request('http://api.nexgentesting.com:7001/unlockemail?id='+req.body.id, function (error, response, body) {

        });
    }

    var collection = db.collection(req.query.source.toString());
    var o_id = new mongodb.ObjectID(req.query.id);     //[we use ObjectId to convert the data otherwise we could not get it]
    collection.update({_id:o_id}, {$set: {lock:(1-(req.query.status))}}, true, true);  //[_id defined that in database it is defined  _id so we used _id here to match field]

    resp.send(JSON.stringify({'status':'success'}));
});



app.post('/training_category',function(req,resp){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
   var collection = db.collection('tranningcategory');
 //   var collection = db.collection('training_category_lesson_view');
    var collection2 = db.collection('donetraininglesson');
    var collection3 = db.collection('last_lessons');
    var cond={};
    cond={
        status:true
       /* type1: 'Rep Trainning Table'*/
    };

    collection.find(cond).sort({created_at:-1}).toArray(function(err, items){
        if (err) {
            resp.send(JSON.stringify({'res':[]}));
        } else {
            collection2.find({userid:new mongodb.ObjectID(req.body.userid)}).sort({created_at:-1}).toArray(function(err2, items2){
                if (err2) {
                    resp.send(JSON.stringify({'res':[]}));
                } else {
                    collection3.find().sort({_id:-1}).toArray(function(err3, items3){
                        if (err3) {
                            resp.send(JSON.stringify({'res':[]}));
                        } else {

                               resp.send(JSON.stringify({'res':items,'res2':items2,'res3':items3}));
                        }
                    });
                 //   resp.send(JSON.stringify({'res':items,'resc':items.length,'res2':items2,'resc2':items2.length}));
                }
            });
           // resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });
});
app.post('/contactto', function (req, resp) {
    var crypto = require('crypto');
    var added_time= new Date().getTime();
    if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
        .update('password')
        .digest('hex');
    for(var i in req.body.sourceobj){
        if(req.body.data[req.body.sourceobj[i]]!=null && req.body.data[req.body.sourceobj[i]].length>2){
            req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
        }
    }
    if(typeof(req.body.data)!='undefined' && typeof(req.body.data.confirmpassword)!='undefined')  req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
    req.body.data['created_at']=added_time;
    collection.insert([req.body.data], function (err, result) {
        if (err) {
            resp.send(JSON.stringify({'status':'failed','id':0}));
        } else {


            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });
            var mail = {
                from: "NexGen<support@nexgentesting.com>",
                to: req.body.data.email,
                subject: 'Welcome to the Nexgen Testing.',
                html: 'Thank you for your interest of joining NexGen’s Sales Rep Team! We are excited to help you in this opportunity to further your career. Please go to this page to fill out additional info that is needed to complete your application process. Once you have completed the necessary steps to apply for this position you will be notified immediately on whether or not you qualify for this position.<br/><a href="http://nexgentesting.com.s3-website-us-east-1.amazonaws.com/funnel">Click Here</a>'
            }
            smtpTransport.sendMail(mail, function (error, response) {
              //  console.log('send');
                smtpTransport.close();
            });
            resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
            /*  resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
             return;*/
        }
    });
});
/*COMMON FUNCTIONS*/
app.post('/temptoken', function (req, resp) {
    //token:createjwttoken();
    resp.send(JSON.stringify({'status':'success',token:createjwttoken()}));
});
app.post('/login', function (req, resp) {
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var collection = db.collection('users');
    collection.find({ email:req.body.email}).toArray(function(err, items){
        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Email id is invalid...'}));
            return;
        }
        if(items.length>0 && items[0].password!=hash){
            resp.send(JSON.stringify({'status':'error','msg':'Password Doesnot match'}));
            return;
        }
        if(items.length>0 && items[0].status==0){
            resp.send(JSON.stringify({'status':'error','msg':'This is Inactive User'}));
            return;
        }
        if(items.length>0 && items[0].password==hash){
            var tokenis = createjwttoken();
            if(tokenis!=null){
                resp.send(JSON.stringify({'status':'success','item':items,token:createjwttoken()}));
                return;
            }else{
                resp.send(JSON.stringify({'status':'error','msg':'Contact to site administrator for further information!'}));
                return;
            }

        }
    });
});

app.post('/datalist',function (req,resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
  //  console.log('tokenstatus');
  //  console.log(tokenstatus);
    var i=0;
    var tval;
    var bval;
    var ck;
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }

    var varr= req.body.condition;
    var bvarr=[];
    //console.log(varr.length);
    if(typeof (req.body.condition) !='undefined' ){

        Object.keys(varr).forEach(function (c) {
            // do something with obj[key]
            ck='_object';
          //  console.log(c);
         //   console.log(c.indexOf(ck));
         //   console.log(ck.indexOf(c));
            if(c.indexOf(ck)>=0){
                tavl=varr[c];
                //varr.splice(i,1);
                bval=c.replace('_object','');
                //bvarr.push({bval:tval});
                bvarr[bval]=new mongodb.ObjectID(varr[c]);
            }
            else bvarr[c]=varr[c];
            i++;
            //console.log(key);
        });

        req.body.condition=Object.assign({}, bvarr);
    }
    var sortval;
    sortval={_id:-1};
    if(req.body.source.toString()=='eventdayarr_events'){
         sortval={};
    }
    if(typeof (req.body.condition) !='undefined' && typeof (req.body.condition._id)!='undefined' ){
        req.body.condition._id=new mongodb.ObjectID(req.body.condition._id);
    }
    var cond=req.body.condition;
    var collection = db.collection(req.body.source.toString());
    collection.find(cond).sort(sortval).toArray(function(err, items) {
        if (err) {
          //  console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });

});
app.post('/datalist2',function (req,resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //verifytoken(token);
  //  console.log('tokenstatus');
  //  console.log(tokenstatus);
    var i=0;
    var tval;
    var bval;
    var ck;


    var varr= req.body.condition;
    var bvarr=[];
    //console.log(varr.length);
    if(typeof (req.body.condition) !='undefined' ){

        Object.keys(varr).forEach(function (c) {
            // do something with obj[key]
            ck='_object';
          //  console.log(c);
         //   console.log(c.indexOf(ck));
         //   console.log(ck.indexOf(c));
            if(c.indexOf(ck)>=0){
                tavl=varr[c];
                //varr.splice(i,1);
                bval=c.replace('_object','');
                //bvarr.push({bval:tval});
                bvarr[bval]=new mongodb.ObjectID(varr[c]);
            }
            else bvarr[c]=varr[c];
            i++;
            //console.log(key);
        });

        req.body.condition=Object.assign({}, bvarr);
    }
    var sortval;
    sortval={_id:-1};
    if(req.body.source.toString()=='eventdayarr_events'){
         sortval={};
    }
    if(typeof (req.body.condition) !='undefined' && typeof (req.body.condition._id)!='undefined' ){
        req.body.condition._id=new mongodb.ObjectID(req.body.condition._id);
    }
    var cond=req.body.condition;
    var collection = db.collection(req.body.source.toString());
    collection.find(cond).sort(sortval).toArray(function(err, items) {
        if (err) {
          //  console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });

});

var PDFImage = require("pdf-image").PDFImage;


app.get('/convertpdftoimage',function (req,resp) {

    var pdfImage = new PDFImage("../assets/uploads/s2.pdf",{combinedImage: true});
  //  console.log('pdfImage');
  //  console.log(pdfImage);
    pdfImage.convertFile().then(function (imagePaths) {
        // [ /tmp/slide-0.png, /tmp/slide-1.png ]
       // console.log('imagePaths');
      //  console.log(imagePaths);

        //numberOfPages

        //fs.existsSync("../assets/uploads/converted/sample-0.png")
        //resp.send(JSON.stringify({'res':'87','resc':'oi',imagePaths:imagePaths}));
    });

    pdfImage.numberOfPages().then(function (numberOfPages) {
        // [ /tmp/slide-0.png, /tmp/slide-1.png ]
       // console.log('imagePaths');
      //  console.log(numberOfPages);

        numberOfPages

        //fs.existsSync("../assets/uploads/converted/sample-0.png")
        resp.send(JSON.stringify({'res':'87','resc':'oi',numberOfPages:numberOfPages}));
    });

});


app.post('/newpassword', function (req, resp) {
    var collection = db.collection('users');
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var data = {
        password: hash
    }
    var o_id = new mongodb.ObjectID(req.body.id);
    collection.update({_id:o_id}, {$set: data}, true, true);
    resp.send(JSON.stringify({'status': 'success', 'msg':'1'}));
});
//var Converter = require('./js/convert.js');
app.get('/ppttopdf',function (req,resp) {

    //var  exec  = require('child_process');

    var exec = require('child_process').exec;
    var cmd = 'libreoffice6.2  --headless --convert-to pdf --outdir "/var/www/html/assets/uploads/converted/" "/var/www/html/assets/uploads/s4.pptx"';

    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        resp.send(JSON.stringify({'re6s':error,stdout:stdout,x:stderr}));
        return;
    });

    return;
    var x=exec('libreoffice6.2  --headless --convert-to pdf --outdir "./assets/uploads/converted/" "../assets/uploads/s3.pptx"');
    resp.send(JSON.stringify({'res':'87','resc':'oi',x:x}));
    return;
});
app.get('/doctopdf',function (req,resp) {

    //var  exec  = require('child_process');

    var exec = require('child_process').exec;
    var cmd = 'libreoffice6.2  --headless --convert-to pdf --outdir "/var/www/html/assets/uploads/converted/" "/var/www/html/assets/uploads/d4.docx"';

    exec(cmd, function(error, stdout, stderr) {
        // command output is in stdout
        resp.send(JSON.stringify({'re6s':error,stdout:stdout,x:stderr}));
        return;
    });

    return;
    var x=exec('libreoffice6.2  --headless --convert-to pdf --outdir "./assets/uploads/converted/" "../assets/uploads/s3.pptx"');
    resp.send(JSON.stringify({'res':'87','resc':'oi',x:x}));
    return;
});

app.get('/convertpdftoimage1',function (req,resp) {



    var fs      = require('fs');
    var path    = require('path');
    var pdf2img = require('pdf2img');

    var input   = "../assets/uploads/s3.pptx";

    pdf2img.setOptions({
        type: 'png',                                // png or jpg, default jpg
        size: 1024,                                 // default 1024
        density: 600,                               // default 600
        outputdir: "../assets/uploads/converted", // output folder, default null (if null given, then it will create folder name same as file name)
        outputname: 'test',                         // output file name, dafault null (if null given, then it will create image name same as input name)
        page: null                                  // convert selected page, default null (if null given, then it will convert all pages)
    });

    pdf2img.convert(input, function(err, info) {
        if (err) console.log(err)
        else console.log(info);
        resp.send(JSON.stringify({'res':'87','resc':'oi'}));
        return;
    });


    var pdfImage = new PDFImage("../assets/uploads/sample.pdf");
    console.log('pdfImage');
    console.log(pdfImage);
    pdfImage.convertPage(1).then(function (imagePaths) {
        // [ /tmp/slide-0.png, /tmp/slide-1.png ]
        console.log('imagePaths');
        console.log(imagePaths);
        //fs.existsSync("../assets/uploads/converted/sample-0.png")
        resp.send(JSON.stringify({'res':'87','resc':'oi',imagePaths:imagePaths}));
    });


});


app.get('/modifyemptyslides',function (req,resp) {


    var collection = db.collection('traininglesson');
    collection.find({"fileservername":{$ne:null},"slides":{$exists:false}}).sort({_id:1}).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            for(var v in items){
                setTimeout(function () {
                    getslides(items[v]);
                },10);

            }

            request('http://api.nexgentesting.com:7001/createappointmentslots', function (error, response, body) {

            });

            resp.send(JSON.stringify({'resc':items.length}));
        }
    });
});

function getslides(item) {

    var filetype='';

    if(item.fileservername.indexOf('.pdf')>-1){
        filetype='pdf';
    }
    if(item.fileservername.indexOf('.ppt')>-1 || item.fileservername.indexOf('.pptx')>-1 || item.fileservername.indexOf('.docx')>-1|| item.fileservername.indexOf('.doc')>-1){
        filetype='ppt';
    }

    if(filetype=='ppt'){

        //resp.send(JSON.stringify({'status':'error',slides:filetype}));
        //return;
        var exec = require('child_process').exec;
        var cmd = 'libreoffice6.2  --headless --convert-to pdf --outdir "/var/www/html/assets/uploads/converted" "/var/www/html/assets/uploads/'+item.fileservername+'"';

        exec(cmd, function(error, stdout, stderr) {
            // command output is in stdout
            //resp.send(JSON.stringify({'fname':item.fileservername.split('.').slice(0, -1).join('.'),stdout:stdout,x:stderr}));
            //return;

            var pdfImage = new PDFImage("../assets/uploads/converted/"+item.fileservername.split('.').slice(0, -1).join('.')+'.pdf');
            console.log('pdfImage');
            console.log(pdfImage);
            pdfImage.convertFile().then(function (imagePaths) {
                // [ /tmp/slide-0.png, /tmp/slide-1.png ]
                console.log('imagePaths');
                console.log(imagePaths);
                //fs.existsSync("../assets/uploads/converted/sample-0.png")
                var collection = db.collection('traininglesson');
                var o_id = new mongodb.ObjectID(item._id);     //[we use ObjectId to convert the data otherwise we could not get it]
                collection.update({_id:o_id}, {$set: {slides:imagePaths}}, true, true);
                console.log(JSON.stringify({imagePaths:imagePaths}));
                return;
            });
            //return;
        });
    }
    if(filetype=='pdf'){

        var pdfImage = new PDFImage("../assets/uploads/"+item.fileservername);
        console.log('pdfImage');
        console.log(pdfImage);
        pdfImage.convertFile().then(function (imagePaths) {
            // [ /tmp/slide-0.png, /tmp/slide-1.png ]
            console.log('imagePaths');
            console.log(imagePaths);
            //fs.existsSync("../assets/uploads/converted/sample-0.png")

            var collection = db.collection('traininglesson');
            var o_id = new mongodb.ObjectID(item._id);     //[we use ObjectId to convert the data otherwise we could not get it]
            collection.update({_id:o_id}, {$set: {slides:imagePaths}});
            console.log(JSON.stringify({imagePaths:imagePaths}));
            return;
        });


    }



}

app.get('/updateslotdata',function (req,resp) {

    var collection = db.collection('eventdayarr');
    var o_id = new mongodb.ObjectID(req.query.itemid);
    console.log('req.query.itemid');
    console.log(req.query.itemid);
    var tmp=req.query.slots.split(',');
    var vi=collection.update({_id:o_id}, {$set: {slots:tmp}},true,true);

});
app.get('/createappointmentslots',function (req,resp) {

    var collection = db.collection('eventdayarr');
    var titems;
    collection.find({slots:{$exists: false}}).sort({_id:1}).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            titems=items;
            //console.log('items');
            //console.log(items);
            for(var v in titems){
                setTimeout(function () {
                    createslots(titems[v],resp);
                    //console.log('titems[v]._id');
                    //console.log(titems[v]._id);
                    //console.log(v);

                    //resp.send(JSON.stringify({'resc':items.length}));
                    //return;
                },10);

            }

            resp.send(JSON.stringify({'resc':items.length}));
            return;
        }
    });

    //resp.send(JSON.stringify({'status':'error',slots:'ddd'}));
    //return;
});

function getTimeStops(start, end,gap,item){
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');

    if( endTime.isBefore(startTime) ){
        endTime.add(1, 'day');
    }

    var timeStops = [];
    var etime;

    while(startTime < endTime){
        //etime=startTime;
        //console.log(item);
        timeStops.push(new moment(startTime).format('HH:mm'));
        startTime.add(gap, 'minutes');
    }
    //resp.send(JSON.stringify({slots:timeStops}));
    //return;
    updateslotdata(item._id,timeStops);


    //return timeStops;
}
function updateslotdata(itemid,data){

    request('http://api.nexgentesting.com:7001/updateslotdata?itemid='+itemid+'&slots='+data, function (error, response, body) {

    });

    //return;
}

var momenttz = require('moment-timezone');
function createslots(item,resp) {
    console.log('item');
    //console.log(item);

    //item.timegap=parseInt(item.endtime-item.starttime);
   // item.st=moment(item.startdate+' '+item.starttime).format('MM/DD/YYYY HH:mm A');
   // var st=moment(item.startdate+' '+item.starttime).format();
   // item.et=moment(item.startdate+' '+item.endtime).format('MM/DD/YYYY HH :mm A');
   // var et=moment(item.startdate+' '+item.endtime).format();


    var tzval=item.timezone.split('|');
    tzval=tzval[1];
    item.tz=tzval;

    //item.sttz=momenttz(st).tz(tzval).format('MM/DD/YYYY hh:mm');
    //item.sttzk=momenttz(st).tz('Asia/Kolkata').format('MM/DD/YYYY hh:mm');
   // item.ettz=momenttz(et).tz(tzval).format('MM/DD/YYYY hh :mm');
   // item.ettzk=momenttz(et).tz('Asia/Kolkata').format('MM/DD/YYYY hh :mm');
    //item.stunix=momenttz(item.st).unix();
   // item.etunix=momenttz(item.et).unix();
    //item.gap=parseInt(item.etunix-item.stunix);
    var slots='';
   getTimeStops(momenttz(item.startdate+'T'+item.starttime.trim()+':00').format('HH.mm'), momenttz(item.startdate+'T'+item.endtime.trim()+':00').format('HH.mm'),item.timespan,item);




    /*delete item._id;
    for(var s in slots){
        item.slotstart=slots[s];
        collection.find(item).toArray(function(err, items) {
            setTimeout(function () {
                if((item._id)!='undefined' ){
                    delete item._id;
                }
                if (items.length == 0 && typeof(item._id)=='undefined' ) {
                    var tempitem=item;
                    collection.insert(item, function (err, result) {
                        if (err) {
                            console.log('error' + err);
                            //resp.send(JSON.stringify({'status':'error','id':0}));
                        }
                    });
                }
            },50);
        });
    }*/
    //var slots=getTimeStops('2.00', '5.00',30,resp);

    //var slots=getTimeStops(momenttz(item.st).format('hh:mm'),momenttz(item.et).format('hh:mm'),item.timespan,resp);

   // console.log(item);
    //resp.send(JSON.stringify({'resc':item,slots:slots,it:item._id}));
    //return;
}
app.post('/getslidevalues3',function (req,resp) {
    var filetype='';

    if(req.body.filename.indexOf('.pdf')>-1){
        filetype='pdf';
    }
    if(req.body.filename.indexOf('.ppt')>-1 || req.body.filename.indexOf('.pptx')>-1 || req.body.filename.indexOf('.docx')>-1|| req.body.filename.indexOf('.doc')>-1){
        filetype='ppt';
    }

    if(filetype=='ppt'){

        //resp.send(JSON.stringify({'status':'error',slides:filetype}));
        //return;
        var exec = require('child_process').exec;
        var cmd = 'libreoffice6.2  --headless --convert-to pdf --outdir "/var/www/html/assets/uploads/converted" "/var/www/html/assets/uploads/'+req.body.filename+'"';

        exec(cmd, function(error, stdout, stderr) {
            // command output is in stdout
            //resp.send(JSON.stringify({'fname':req.body.filename.split('.').slice(0, -1).join('.'),stdout:stdout,x:stderr}));
            //return;

            var pdfImage = new PDFImage("../assets/uploads/converted/"+req.body.filename.split('.').slice(0, -1).join('.')+'.pdf');
            console.log('pdfImage');
            console.log(pdfImage);
            pdfImage.convertFile().then(function (imagePaths) {
                // [ /tmp/slide-0.png, /tmp/slide-1.png ]
                console.log('imagePaths');
                console.log(imagePaths);
                //fs.existsSync("../assets/uploads/converted/sample-0.png")
                var collection = db.collection('traininglesson');
                var o_id = new mongodb.ObjectID(req.body.lessonid);     //[we use ObjectId to convert the data otherwise we could not get it]
                collection.update({_id:o_id}, {$set: {slides:imagePaths}}, true, true);
                resp.send(JSON.stringify({imagePaths:imagePaths}));
                return;
            });
            //return;
        });
    }
    if(filetype=='pdf'){

        var pdfImage = new PDFImage("../assets/uploads/"+req.body.filename);
        console.log('pdfImage');
        console.log(pdfImage);
        pdfImage.convertFile().then(function (imagePaths) {
            // [ /tmp/slide-0.png, /tmp/slide-1.png ]
            console.log('imagePaths');
            console.log(imagePaths);
            //fs.existsSync("../assets/uploads/converted/sample-0.png")

            var collection = db.collection('traininglesson');
            var o_id = new mongodb.ObjectID(req.body.lessonid);     //[we use ObjectId to convert the data otherwise we could not get it]
            collection.update({_id:o_id}, {$set: {slides:imagePaths}});
            resp.send(JSON.stringify({imagePaths:imagePaths}));
            return;
        });


    }

    //resp.send(JSON.stringify({'status':'error',slides:filetype}));
});



app.post('/getslidevalues',function (req,resp) {
    var filetype='';

    if(req.body.filename.indexOf('.pdf')>-1){
        filetype='pdf';
    }
    if(req.body.filename.indexOf('.ppt')>-1 || req.body.filename.indexOf('.pptx')>-1 || req.body.filename.indexOf('.docx')>-1|| req.body.filename.indexOf('.doc')>-1){
        filetype='ppt';
    }

    if(filetype=='ppt'){

        //resp.send(JSON.stringify({'status':'error',slides:filetype}));
        //return;
        var exec = require('child_process').exec;
        var cmd = 'libreoffice6.2  --headless --convert-to pdf --outdir "/var/www/html/assets/uploads/converted" "/var/www/html/assets/uploads/'+req.body.filename+'"';

        exec(cmd, function(error, stdout, stderr) {
            // command output is in stdout
            //resp.send(JSON.stringify({'fname':req.body.filename.split('.').slice(0, -1).join('.'),stdout:stdout,x:stderr}));
            //return;

            var pdfImage = new PDFImage("../assets/uploads/converted/"+req.body.filename.split('.').slice(0, -1).join('.')+'.pdf');
            console.log('pdfImage');
            console.log(pdfImage);
            pdfImage.convertFile().then(function (imagePaths) {
                // [ /tmp/slide-0.png, /tmp/slide-1.png ]
                console.log('imagePaths');
                console.log(imagePaths);
                //fs.existsSync("../assets/uploads/converted/sample-0.png")
                var collection = db.collection('traininglesson');
                var o_id = new mongodb.ObjectID(req.body.lessonid);     //[we use ObjectId to convert the data otherwise we could not get it]
                collection.update({_id:o_id}, {$set: {slides:imagePaths}}, true, true);
                resp.send(JSON.stringify({imagePaths:imagePaths}));
                return;
            });
            //return;
        });
    }
    if(filetype=='pdf'){

        var pdfImage = new PDFImage("../assets/uploads/"+req.body.filename);
        console.log('pdfImage');
        console.log(pdfImage);
        pdfImage.convertFile().then(function (imagePaths) {
            // [ /tmp/slide-0.png, /tmp/slide-1.png ]
            console.log('imagePaths');
            console.log(imagePaths);
            //fs.existsSync("../assets/uploads/converted/sample-0.png")

            var collection = db.collection('traininglesson');
            var o_id = new mongodb.ObjectID(req.body.lessonid);     //[we use ObjectId to convert the data otherwise we could not get it]
            collection.update({_id:o_id}, {$set: {slides:imagePaths}});
            resp.send(JSON.stringify({imagePaths:imagePaths}));
            return;
        });


    }

    //resp.send(JSON.stringify({'status':'error',slides:filetype}));
});


app.post('/getrecvalues',function (req,resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
 //   console.log('tokenstatus');
 //   console.log(tokenstatus);
    var i=0;
    var tval;
    var bval;
    var ck;
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }

    var collection = db.collection('rep_recruiter_view');
    var collection2 = db.collection('donetraininglesson_view');
    collection.find({_id:new mongodb.ObjectID(req.body._id)}).sort({_id:-1}).toArray(function(err, items) {
        if (err) {
        //    console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            collection2.find({userid:new mongodb.ObjectID(req.body._id)}).limit(1).toArray(function(err2, items2) {
                if (err2) {
                    console.log(err2);
                    resp.send(JSON.stringify({'res':[]}));
                } else {
                     resp.send(JSON.stringify({'res':items,'res2':items2[0]}));
                }
            });
          //  resp.send(JSON.stringify({'res':items}));
        }
    });
});

app.get('/getcontractdetailsforpdf',function(req,resp) {
    var collection = db.collection('users');
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            resp.send(JSON.stringify({'res':items[0]}));
        }
    });
});


app.post('/contactto', function (req, resp) {
    var crypto = require('crypto');
    var added_time= new Date().getTime();
    if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
        .update('password')
        .digest('hex');
    for(var i in req.body.sourceobj){
        if(req.body.data[req.body.sourceobj[i]]!=null && req.body.data[req.body.sourceobj[i]].length>2){
            req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
        }
    }
    if(typeof(req.body.data)!='undefined' && typeof(req.body.data.confirmpassword)!='undefined')  req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
        req.body.data['created_at']=added_time;
        collection.insert([req.body.data], function (err, result) {
            if (err) {
                resp.send(JSON.stringify({'status':'failed','id':0}));
            } else {


                var smtpTransport = mailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "itplcc40@gmail.com",
                        pass: "DevelP7@"
                    }
                });
                var mail = {
                    from: "NexGen<support@nexgentesting.com>",
                    to: req.body.data.email,
                    subject: 'Welcome to the Nexgen Testing.',
                    html: 'Thank you for your interest of joining NexGen’s Sales Rep Team! We are excited to help you in this opportunity to further your career. Please go to this page to fill out additional info that is needed to complete your application process. Once you have completed the necessary steps to apply for this position you will be notified immediately on whether or not you qualify for this position.<br/><a href="http://nexgentesting.com.s3-website-us-east-1.amazonaws.com/funnel">Click Here</a>'
                }
                smtpTransport.sendMail(mail, function (error, response) {
                    console.log('send');
                    smtpTransport.close();
                });
                resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id}));





              /*  resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
                return;*/
            }
        });
});
app.post('/frontendsignup',function(req,resp){
addorupdatedata(req.body.source.toString(),req.body.data,req.body.sourceobj,resp);
    /*resp.send(JSON.stringify({'status':'success','result':result}));*/
});
function addorupdatedata(source,data,sourceobj,resp){
    var crypto = require('crypto');
    var added_time= new Date().getTime();
    if(typeof(data)!='undefined' && typeof(data.password)!='undefined') data.password = crypto.createHmac('sha256', data.password)
        .update('password')
        .digest('hex');
    for(var i in sourceobj){
        if(data[sourceobj[i]]!=null && data[sourceobj[i]].length>2){
            req.body.data[sourceobj[i]] = new mongodb.ObjectID(data[sourceobj[i]]);
        }
    }
    if(typeof(data)!='undefined' && typeof(data.confirmpassword)!='undefined')  data.confirmpassword = null;
    var collection = db.collection(source);
    if(typeof(data.id)=='undefined'){
      data['created_at']=added_time;

        if(source.toString()=='users'){
            randomnogenerate('users');
        }

        setTimeout(function () {
           data['unique_id']=rnval;/*at the time of insert the data the unique_id autometically inserted into collection*/
            collection.insert([data], function (err, result) {
                if (err) {
                    resp.send(JSON.stringify({'status':'failed','id':0}));
                } else {
                    if(source.toString()=='events'){
                        createeventdayarr(result.ops[0]._id);
                    }
                    resp.send(JSON.stringify({'status':'success','res':result.ops[0]}));/*event collection's _id*/
                    return;
                }
            });
        },100);
    }

    if(typeof(data.id)!='undefined'){
       /* console.log(req.body.data);*/
       data['updated_at']=added_time;
        var o_id = new mongodb.ObjectID(data.id);
        collection.update({_id:o_id}, {$set: data});

        if(source.toString()=='events'){
            var collection2 = db.collection('eventdayarr');
            collection2.remove({eventid:o_id}, function(err, results) {
                createeventdayarr(o_id);
            });
        }

        console.log('source.toString()');
        console.log(source.toString());
        if(source.toString()=='legaldocuments'){
            //randomnogenerate('users');
            console.log('in leagaldocs');

            request('http://api.nexgentesting.com:7001/docemail?id='+data.userid+'&doctype='+data.doctype, function (error, response, body) {

            });
        }


        resp.send(JSON.stringify({'status':'success',update:1}));
        return;
    }
}
app.post('/addorupdatedata', function (req, resp) {
    var crypto = require('crypto');
    var added_time= new Date().getTime();
    if(typeof(req.body.data)!='undefined' && typeof(req.body.data.password)!='undefined')  req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
        .update('password')
        .digest('hex');
    for(var i in req.body.sourceobj){
        if(req.body.data[req.body.sourceobj[i]]!=null && req.body.data[req.body.sourceobj[i]].length>2){
        req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
    }
    }
    if(typeof(req.body.data)!='undefined' && typeof(req.body.data.confirmpassword)!='undefined')  req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
    if(typeof(req.body.data.id)=='undefined'){
        req.body.data['created_at']=added_time;

        if(req.body.source.toString()=='users'){
        randomnogenerate('users');
        }

        setTimeout(function () {
            req.body.data['unique_id']=rnval;/*at the time of insert the data the unique_id autometically inserted into collection*/
        collection.insert([req.body.data], function (err, result) {
            if (err) {
                resp.send(JSON.stringify({'status':'failed','id':0}));
            } else {
                if(req.body.source.toString()=='events'){
                createeventdayarr(result.ops[0]._id);
                }
                resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));/*event collection's _id*/
                return;
            }
        });
        },100);
    }

    if(typeof(req.body.data.id)!='undefined'){
        console.log(req.body.data);
        req.body.data['updated_at']=added_time;
        var o_id = new mongodb.ObjectID(req.body.data.id);
        collection.update({_id:o_id}, {$set: req.body.data});

        if(req.body.source.toString()=='events'){
            var collection2 = db.collection('eventdayarr');
            collection2.remove({eventid:o_id}, function(err, results) {
                createeventdayarr(o_id);
            });
        }

        console.log('req.body.source.toString()');
        console.log(req.body.source.toString());
        if(req.body.source.toString()=='legaldocuments'){
            //randomnogenerate('users');
            console.log('in leagaldocs');

            request('http://api.nexgentesting.com:7001/docemail?id='+req.body.data.userid+'&doctype='+req.body.data.doctype, function (error, response, body) {

            });
        }


        resp.send(JSON.stringify({'status':'success',update:1}));
        return;
    }
});

app.post('/deletesingledata',function(req,resp) {
    var collection = db.collection(req.body.source.toString());
    var o_id = new mongodb.ObjectID(req.body.id);
    // collection.remove({_id:o_id}, true);
    collection.remove({_id:o_id}, function(err, results) {
        if(err){
            resp.send(JSON.stringify({'status':'failed'}));
        }else{

            if(req.body.source.toString()=='events'){
                var collection = db.collection('eventdayarr');
                collection.remove({eventid:o_id}, function(err, results) {

                });
            }

            resp.send(JSON.stringify({'status':'success'}));
        }
    });
});
app.get('/sendsignupemail',function(req,resp) {

    request('http://api.nexgentesting.com/php/mail/signup.php?email='+req.query.email+'&username='+req.query.username, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.

        var collection = db.collection('users');
        var o_id = new mongodb.ObjectID(req.query.recid);
        collection.find({_id:o_id}).toArray(function(err, items) {
            if (err) {
                console.log(err);
                resp.send(JSON.stringify({'res':[]}));
            } else {
                //resp.send(JSON.stringify({'res':items[0]}));


                request('http://api.nexgentesting.com/php/mail/signup-recruiter.php?email='+items[0].email+'&firstname='+req.query.firstname+'&lastname='+req.query.lastname+'&id='+req.query.id, function (error, response, body) {
                    console.log('error:', error); // Print the error if one occurred
                    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    console.log('body:', body); // Print the HTML for the Google homepage.

                    resp.send(JSON.stringify({'status':'success',update:body}));




                });


            }
        });


    });


});



function createjwttoken(){
    var older_token = jwt.sign({ foo: 'bar', exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)}, app.get('superSecret'));
    /*const payload = {
        admin: true     };
    var token = jwt.sign(payload, app.get('superSecret'), {
        //expiresInMinutes: 1440 // expires in 24 hours
    });*/
    //resp.send(JSON.stringify({'status':'success',token:token,oldtoken:older_token}));
    return older_token;
};

function verifytoken(token){
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      //  console.log('token');
      //  console.log(token);
        if (err) {
            //resp.send(JSON.stringify({'status':'success',error:err}));
            console.log('in error');
            tokenstatus= err.message;
        }
        else{
            console.log('in success !!');
            tokenstatus= true;
        }
    });
};


//https.createServer(options, app).listen(6027);


app.get('/createtoken',function(req,resp) {
    var older_token = jwt.sign({ foo: 'bar', exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3)}, app.get('superSecret'));

    const payload = {
        admin: true     };
    var token = jwt.sign(payload, app.get('superSecret'), {
        //expiresInMinutes: 1440 // expires in 24 hours
    });
    resp.send(JSON.stringify({'status':'success',token:token,oldtoken:older_token}));
    return;
});
app.get('/checktoken',function(req,resp) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
            resp.send(JSON.stringify({'status':'success',error:err}));
            return;
        }
        else{
            resp.send(JSON.stringify({'status':'success',token:'success'}));
        }
    });

    return;
});



app.get('/getevents1',function(req,resp) {
    var collection = db.collection('events');
    var o_id = new mongodb.ObjectID('5c9082561a3a041f9079c787');
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {

             resp.send(JSON.stringify({'res':items[0]}));
        }
    });
});

var geteventsslots;

app.get('/getevents',function(req,resp) {
    var collection = db.collection('events');
    var o_id = new mongodb.ObjectID('5c9082561a3a041f9079c787');
    collection.find({_id:o_id}).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));
        } else {
            geteventsslots = items[0];
           // resp.send(JSON.stringify({'res':items[0]}));
            var startdatearr = items[0].start_date.split("T");
            var starttimearr = items[0].start_time.split("T");
            var startdatetimefull = startdatearr[0]+'T'+starttimearr[1];
            var enddatearr = items[0].end_date.split("T");
            var endtimearr = items[0].end_time.split("T");
            var enddatetimefull = enddatearr[0]+'T'+endtimearr[1];
            var startdateunix=moment(startdatetimefull).unix();
            var enddateunix=moment(enddatetimefull).unix();
            console.log('===========================================');
            console.log(moment(startdatetimefull).format('ddd'));
            var dateallst = {
                startdatetime : startdatetimefull,
                enddatetime : enddatetimefull,
                timezone : items[0].timezone,
                description : items[0].description,
                meetingwith : items[0].meetingwith,
                timespan : items[0].timespan,
                startdateunix : startdateunix,
                enddateunix : enddateunix,
                differenceinunix : parseInt(enddateunix) - parseInt(startdateunix),
                differenceinunixupdated : (parseInt(enddateunix) - parseInt(startdateunix))/(3600)
            }
           var dateallarr=[];
           dateallarr.push(dateallst);
            startslot(dateallst);
           // starttimelots(dayarr);
           /* console.log(dayarr[0].starttime);
            console.log(moment(dayarr[0].starttime).format('h:mm'));*/
          //  resp.send(JSON.stringify({'tm':dayarr[0].starttime,'dayarr':moment(dayarr[0].starttime).format('h:mm')}));

            var collection = db.collection('eventdayarr');
            collection.insert(dayarr, function (err, result) {
                if (err) {
                    console.log('error'+err);
                    resp.send(JSON.stringify({'status':'error','id':0}));
                }
            });


            resp.send(JSON.stringify({'len':dayarr.length,'dayarr':dayarr}));
           // resp.send(JSON.stringify({'len':daytimearr.length,'daytimearr':daytimearr}));
        }
    });
});
function createeventdayarr(eventid) {
    //  resp.send(JSON.stringify({'res':eventid}));
    // return;
    var collection = db.collection('events');
    var o_id = new mongodb.ObjectID(eventid);
    collection.find({_id: o_id}).toArray(function (err, items) {
        if (err) {
            console.log(err);
            //  resp.send(JSON.stringify({'res':[]}));
        } else {
          //  console.log('-----------------------');
           // console.log(eventid);
            geteventsslots = items[0];
            console.log(geteventsslots);
            // resp.send(JSON.stringify({'res':items[0]}));
         /*   var startdatearr = items[0].start_date.split("T");
            var starttimearr = items[0].start_time.split("T");
            var startdatetimefull = startdatearr[0] + 'T' + starttimearr[1];
            var enddatearr = items[0].end_date.split("T");
            var endtimearr = items[0].end_time.split("T");
            var enddatetimefull = enddatearr[0] + 'T' + endtimearr[1];*/
           // var startdateunix = moment(startdatetimefull).unix();
           // var enddateunix = moment(enddatetimefull).unix();
            var startdateunix = moment(items[0].start_date).unix();//it returns unix date
            var enddateunix = moment(items[0].end_date).unix();
          //  console.log('===========================================');
     //       console.log(moment(startdatetimefull).format('ddd'));
            var dateallst = {
                //startdatetime: startdatetimefull,
                //enddatetime: enddatetimefull,
                startdatetime: items[0].start_date,
                enddatetime: items[0].end_date,
                timezone: items[0].timezone,
                description: items[0].description,
                meetingwith: items[0].meetingwith,
                timespan: items[0].timespan,
                start_time: items[0].start_time,
                end_time: items[0].end_time,
                startdateunix: startdateunix,
                enddateunix: enddateunix,
                differenceinunix: parseInt(enddateunix) - parseInt(startdateunix),
                differenceinunixupdated: (parseInt(enddateunix) - parseInt(startdateunix)) / (3600)
            }
            var dateallarr = [];
            dateallarr.push(dateallst);
            console.log(dateallst);
           // return;
            startslot(dateallst,eventid);
            // starttimelots(dayarr);
            /* console.log(dayarr[0].starttime);
             console.log(moment(dayarr[0].starttime).format('h:mm'));*/
            //  resp.send(JSON.stringify({'tm':dayarr[0].starttime,'dayarr':moment(dayarr[0].starttime).format('h:mm')}));

          /*  var collection1 = db.collection('eventdayarr');
            collection1.insert(dayarr, function (err1, result1) {
                if (err1) {
                    console.log('error' + err1);
                   // resp.send(JSON.stringify({'status': 'error', 'id': 0}));
                }
            });
*/

          //  resp.send(JSON.stringify({'len': dayarr.length, 'dayarr': dayarr}));
            // resp.send(JSON.stringify({'len':daytimearr.length,'daytimearr':daytimearr}));
         //   return dayarr;
        }
    });
}
/*});*/



var dayarr=[];
function startslot(val,eventid){
    dayarr=[];
  /*  console.log(val);
    return;*/
    addslot(val.startdatetime,val.enddatetime,val.timezone,val.meetingwith,val.timespan,eventid,val.startdatetime,val.start_time,val.end_time);
}

function addslot(startdatetime,enddatetime,timezone,meetingwith,timespan,eventid,startdatetime1,start_time,end_time){
   // console.log('addslot');
    var tz='';
    var startdatetimeun=moment(startdatetime).unix();/*startdatetime only hold the start date */
    var enddatetimeun=moment(enddatetime).unix();
    if(startdatetimeun<enddatetimeun){
        tz=timezone.split('|');
        tz=timezone[1];
          console.log(tz);
         return;
        var valc=(moment(startdatetime).format('YYYY-MM-DD'))+' '+start_time+':00';
        console.log(start_time);
        //return;

        var obj={
            startdate:moment(startdatetime).format('YYYY-MM-DD'),
            st:valc,
          //  startdate_unix:moment(startdatetime).unix(),
            starttime:start_time,
            endtime:end_time,
            timezone:timezone,
            meetingwith:meetingwith,
            timespan:timespan,
            eventid:eventid
        };
      //  console.log(obj);
      //  console.log(moment(obj.startdate).format('ddd'));
     //   console.log(geteventsslots);


        if((moment(obj.startdate).format('ddd')=='Fri' && geteventsslots.Fri==true) || (moment(obj.startdate).format('ddd')=='Mon' && geteventsslots.Mon==true) || (moment(obj.startdate).format('ddd')=='Sat' && geteventsslots.Sat==true) || (moment(obj.startdate).format('ddd')=='Sun' && geteventsslots.Sun==true) || (moment(obj.startdate).format('ddd')=='Thu' && geteventsslots.Thurs==true) || (moment(obj.startdate).format('ddd')=='Tue' && geteventsslots.Tues==true) || (moment(obj.startdate).format('ddd')=='Wed' && geteventsslots.Wed==true)){
        //    console.log(obj);
         //   console.log('in if block');
            if(obj!=null){
             //   console.log('daysssss');
                dayarr.push(obj);
                var collection1 = db.collection('eventdayarr');
                collection1.insert([obj], function (err1, result1) {
                    if (err1) {
                        console.log('error' + err1);
                      //  console.log(obj);
                        // resp.send(JSON.stringify({'status': 'error', 'id': 0}));
                    }else{
                        console.log('inserted!');
                        console.log(obj);
                    }
                });
            }
        }else{
            console.log('in else block');
        }


        addslot(moment(startdatetime).add(1, 'days'),enddatetime,timezone,meetingwith,timespan,eventid,startdatetime1,start_time,end_time);
    }
  //  console.log('this.dayarr----------');
  //  console.log(dayarr);
}


var daytimearr=[];
function starttimelots(dayarr){
    for(var i in dayarr){
        addtimeslots(dayarr[i]);
    }
}
function addtimeslots(dayarrsingleval){
        addsingletimeslots(dayarrsingleval.startdate,dayarrsingleval.startdate_unix,dayarrsingleval.starttime,dayarrsingleval.endtime,dayarrsingleval.timezone,dayarrsingleval.meetingwith,dayarrsingleval.timespan);
}

function addsingletimeslots(startdate,startdate_unix,starttime,endtime,timezone,meetingwith,timespan) {
    if (starttime < endtime) {
        var obj = {
            startdate: startdate,
            startdate_unix: startdate_unix,
            starttime: starttime,
            starttime_val: moment(starttime).format('h:mm'),
            endtime: moment(starttime).add(30, 'minutes'),
            endtime_val:  moment(starttime).add(30, 'minutes').format('h:mm'),
            timezone: timezone,
            meetingwith: meetingwith,
            timespan: timespan
        };
        if (obj != null) {
            daytimearr.push(obj);
        }
        addsingletimeslots(startdate,startdate_unix,moment(starttime).add(30, 'minutes'),endtime, timezone, meetingwith, timespan);
    }
}

app.post('/forgetpassword', function (req, resp) {
    var collection = db.collection('users');
    collection.find({ email:req.body.email }).toArray(function(err, items) {
        if(items.length>0){
            var randomcode= randomString({length: 20, special: false});
            var data = {
                accesscode: randomcode,
            }
            collection.update({ email:req.body.email}, {$set: data}, true, true);
            var smtpTransport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "itplcc40@gmail.com",
                    pass: "DevelP7@"
                }
            });

            var mail = {
                from: "Nexgen Admin <support@nexgen.com>",
                to: req.body.email,
                subject: 'Forgotten Password on Nexgen',
                html: 'Forgotten Password on nexgen Health<br/><br/>Please follow this link to reset your password:<br/><br/><a href=https://nexgentesting.com/resetpassword/'+randomcode+'>https://nexgentesting.com/resetpassword/'+randomcode+'</a><br/><br/>This link is only valid for 24 hours. If you can not click the above url to continue please copy and paste the url into your browser.<br/><br/><br/>This email has been auto-generated and requested by you. If you feel you have received this email in error, please contact the administrator.'
            }
            smtpTransport.sendMail(mail, function (error, response) {
                console.log('send');
                smtpTransport.close();
                resp.send(JSON.stringify({'status':'success','msg':items[0],response:response,error:error}));
            });

        }
        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Emailid invalid...',response:response,error:error}));
            return;
        }
    });
});
