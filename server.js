/**
 * Created by InfluxIQ09 on 2/7/2019.
 */
var fs = require("fs"),
    readline = require("readline");

var express = require('express');
var app = express();
var port = process.env.PORT || 7012;
var request = require('request');
var cheerio = require('cheerio');
var mailer = require("nodemailer");
var moment = require('moment');
var randomString = require('random-string');
var http = require('http').Server(app);

/*SSL*/
var https = require('https');
var keyval=fs.readFileSync('./nodessl.key','utf8');
var certval=fs.readFileSync('./4c4389f06e6cdbf.crt','utf8');
var options = {
    key: keyval,
    cert:certval
};
/*SSL*/



/*Access token JWT Verification*/

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User   = require('./models/user'); // get our mongoose model
app.set('superSecret', config.secret); // secret variable

/*Access token JWT Verification*/



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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Authorization, Accept");
    next();
});

var mongodb = require('mongodb');
var db;
var db2;
var url = 'mongodb://localhost:27017';
var MongoClient = mongodb.MongoClient;
MongoClient.connect(url, function (err, database) {
    if(err){
        console.log(err);
    }else{
        db=database.db('sb');
        db2=database.db('sb');
        console.log("mongo db connected");
        //console.log(database);
    }
});

var tokenstatus='';
app.get('/t6',function(req,resp){
    resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
     return;
});

app.post('/test',function (req, resp) {
    var collection= db2.collection('test');
    var cond=req.body.data.username;
    collection.find(cond).sort({username:0}).limit(1).toArray(function(err, items) {
        if (err) {
            console.log(err);
            resp.send(JSON.stringify({'res':[]}));

        } else {
            resp.send(JSON.stringify({'res':items,'resc':items.length}));
        }
    });
    collection.find().toArray(function(err, items) {
        if (err) {
            resp.send(JSON.stringify({'status':'error','id':0}));
            return;
        } else {
            resp.send(JSON.stringify({'status':'success','item':items}));
            //  resp.send(JSON.stringify({'status':'success','id':result.ops[0]._id,token:createjwttoken()}));
            return;
        }
    });
});


app.get('/test1',function(req,resp){
    console.log('etgggggggggggeset');
    setTimeout(function () {
        var collection= db2.collection('r5');

        collection.insert([{

            // added_time: moment().unix(),

        }], function (err, result) {
            if (err) {
                resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
            } else {
                resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
            }
        });
        },1000);
    //resp.send(JSON.stringify({'status':'success','msg':'Database no error found. Try again!'}));
   // return;

});


//--------add Himadri-------//


app.post('/login',function (req, resp) {
    var crypto = require('crypto');
    var secret = req.body.password;
    var hash = crypto.createHmac('sha256', secret)
        .update('password')
        .digest('hex');
    var collection = db2.collection('users');

    collection.find({email: req.body.email}).toArray(function (err, items) {
        if(items.length==0){
            resp.send(JSON.stringify({'status':'error','msg':'Email does not exists'}));
            return;
        }

        if( items[0].password!=hash){
            resp.send(JSON.stringify({'status':'error','msg':'Password not match'}));
            return;
        } else {
            var token=createjwttoken();
            resp.send(JSON.stringify({'status': 'success', "item":items, 'msg': 'passworh match','itemlength':items.length,token:token}));
            return;
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
        cb(null, '../assets/uploads/'); //for server
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
        created_at: moment().unix(),
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
    console.log('tokenstatus');
    console.log(tokenstatus);
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
        if(typeof(req.body.data)!='undefined' && typeof(req.body.data.id)!='undefined')  req.body.data.id = null;
        collection.update({_id:o_id}, {$set: req.body.data}, true, true);
        resp.send(JSON.stringify({'status':'success',update:1}));
        return;
    }
});


app.post('/getregionalrecruiter',function (req,resp) {
   /* var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);*/
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
    if(typeof (req.body.condition) !='undefined' ){

        Object.keys(varr).forEach(function (c) {
            // do something with obj[key]
            ck='_object';
            console.log("c");
            console.log(c);
            console.log(c.indexOf(ck));
            console.log(ck.indexOf(c));
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
    if(typeof (req.body.condition) !='undefined' && typeof (req.body.condition._id)!='undefined' ){
        req.body.condition._id=new mongodb.ObjectID(req.body.condition._id);
    }
    var cond=req.body.condition;
    var collection = db.collection(req.body.source.toString());
    collection.find(cond).sort({_id:-1}).limit(1).toArray(function(err, items) {
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
    console.log('tokenstatus');
    console.log(tokenstatus);
    if(tokenstatus!=true){
        resp.send(JSON.stringify({'status':'error',token:token,errormessage:tokenstatus}));
        return;
    }
    req.query=req.body;
    var collection = db.collection(req.query.source.toString());
    var o_id = new mongodb.ObjectID(req.query.id);
    collection.update({_id:o_id}, {$set: {status:req.query.status}}, true, true);  //[_id defined that in database it is defined  _id so we used _id here to match field]

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
  var collection = db.collection('training_category_lesson_view');
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
        console.log('send');
        smtpTransport.close();
      });
      resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
      /*  resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
             return;*/
    }
  });
});
/*COMMON FUNCTIONS*/



  app.post('/datalist', function (req, resp) {
    var token = req.body.token || req.query.token || req.headers['authorization'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);
    var i = 0;
    var tval;
    var bval;
    var ck;
    if (tokenstatus != true) {
      resp.send(JSON.stringify({'status': 'error', token: req.headers['authorization'], errormessage: tokenstatus}));
      return;
    }

    var varr = req.body.condition;
    console.log("varr");
    console.log(varr);
    var bvarr = [];
    //console.log(varr.length);
    if (typeof (req.body.condition) != 'undefined') {

      Object.keys(varr).forEach(function (c) { /*c is hold categoryid_object as string see form.component.ts 's 69 line*/
        // do something with obj[key]
        ck = '_object';/*ck only hold the _object as string*/
        console.log(c);//only show categoryid_object
        console.log(c.indexOf(ck));
        console.log(ck.indexOf(c));
        if (c.indexOf(ck) >= 0) {
          tavl = varr[c];
          //varr.splice(i,1);
          bval = c.replace('_object', '');
          //bvarr.push({bval:tval});
          bvarr[bval] = new mongodb.ObjectID(varr[c]);
        } else bvarr[c] = varr[c];
        i++;
        //console.log(key);
      });

      req.body.condition = Object.assign({}, bvarr);//bvarr array is converted into a object and it assigned into the condition
    }
    if (typeof (req.body.condition) != 'undefined' && typeof (req.body.condition._id) != 'undefined') {
      req.body.condition._id = new mongodb.ObjectID(req.body.condition._id);
    }
    var cond = req.body.condition;
    var collection = db.collection(req.body.source.toString());
    collection.find(cond).sort({_id: -1}).toArray(function (err, items) {
      if (err) {
        console.log(err);
        resp.send(JSON.stringify({'res': []}));

      } else {
        resp.send(JSON.stringify({'res': items, 'resc': items.length}));
      }
    });

  });


  app.post('/getrecvalues', function (req, resp) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    verifytoken(token);
    console.log('tokenstatus');
    console.log(tokenstatus);
    var i = 0;
    var tval;
    var bval;
    var ck;
    if (tokenstatus != true) {
      resp.send(JSON.stringify({'status': 'error', token: token, errormessage: tokenstatus}));
      return;
    }

    var collection = db.collection('rep_recruiter_view');
    var collection2 = db.collection('donetraininglesson_view');
    collection.find({_id: new mongodb.ObjectID(req.body._id)}).sort({_id: -1}).toArray(function (err, items) {
      if (err) {
        console.log(err);
        resp.send(JSON.stringify({'res': []}));

      } else {
        collection2.find({userid: new mongodb.ObjectID(req.body._id)}).limit(1).toArray(function (err2, items2) {
          if (err2) {
            console.log(err2);
            resp.send(JSON.stringify({'res': []}));
          } else {
            resp.send(JSON.stringify({'res': items, 'res2': items2[0]}));
          }
        });
        //  resp.send(JSON.stringify({'res':items}));
      }
    });
  });

  app.post('/contactto', function (req, resp) {
    var crypto = require('crypto');
    var added_time = new Date().getTime();
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.password) != 'undefined') req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
      .update('password')
      .digest('hex');
    for (var i in req.body.sourceobj) {
      if (req.body.data[req.body.sourceobj[i]] != null && req.body.data[req.body.sourceobj[i]].length > 2) {
        req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
      }
    }
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.confirmpassword) != 'undefined') req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
    req.body.data['created_at'] = added_time;
    collection.insert([req.body.data], function (err, result) {
      if (err) {
        resp.send(JSON.stringify({'status': 'failed', 'id': 0}));
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
          to: req.body.email,
          subject: 'Welcome to the Nexgen Testing.',
          html: 'Thank you for your interest of joining NexGen’s Sales Rep Team! We are excited to help you in this opportunity to further your career. Please go to this page to fill out additional info that is needed to complete your application process. Once you have completed the necessary steps to apply for this position you will be notified immediately on whether or not you qualify for this position.<br/><a href="http://nexgentesting.com.s3-website-us-east-1.amazonaws.com/funnel">Click Here</a>'
        }
        smtpTransport.sendMail(mail, function (error, response) {
          console.log('send');
          smtpTransport.close();
        });
        resp.send(JSON.stringify({'status': 'success', 'id': result.ops[0]._id}));


        /*  resp.send(JSON.stringify({'status':'success','res':result.ops[0]._id}));
          return;*/
      }
    });
  });

  app.post('/addorupdatedata', function (req, resp) {
    var crypto = require('crypto');
    var added_time = moment().unix();
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.password) != 'undefined') req.body.data.password = crypto.createHmac('sha256', req.body.data.password)
      .update('password')
      .digest('hex');
    for (var i in req.body.sourceobj) {
      if (req.body.data[req.body.sourceobj[i]] != null && req.body.data[req.body.sourceobj[i]].length > 2) {
        req.body.data[req.body.sourceobj[i]] = new mongodb.ObjectID(req.body.data[req.body.sourceobj[i]]);
      }
    }
    if (typeof (req.body.data) != 'undefined' && typeof (req.body.data.confirmpassword) != 'undefined') req.body.data.confirmpassword = null;
    var collection = db.collection(req.body.source.toString());
    if (typeof (req.body.data.id) == 'undefined') {
      req.body.data['created_at'] = added_time;
      collection.insert([req.body.data], function (err, result) {
        if (err) {
          resp.send(JSON.stringify({'status': 'failed', 'id': 0}));
        } else {
          resp.send(JSON.stringify({'status': 'success', 'res': result.ops[0]._id}));
          return;
        }
      });
    }

      if(typeof(req.body.data.id)!='undefined'){
          req.body.data['updated_at']=added_time;
          var o_id = new mongodb.ObjectID(req.body.data.id);
          collection.update({_id:o_id}, {$set: req.body.data} );
          resp.send(JSON.stringify({'status':'success',update:1}));
          return;
      }
  });

  app.post('/deletesingledata', function (req, resp) {
    var collection = db.collection(req.body.source.toString());
    // collection.remove({_id:o_id}, true);
    collection.remove({_id: new mongodb.ObjectID(req.body._id)}, function (err, results) {
      if (err) {
        resp.send(JSON.stringify({'status': 'failed'}));
      } else {
        resp.send(JSON.stringify({'status': 'success','result': results}));
      }
    });
  });

  function createjwttoken() {
    var older_token = jwt.sign({
      foo: 'bar',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }, app.get('superSecret'));
    /*const payload = {
        admin: true     };
    var token = jwt.sign(payload, app.get('superSecret'), {
        //expiresInMinutes: 1440 // expires in 24 hours
    });*/
    //resp.send(JSON.stringify({'status':'success',token:token,oldtoken:older_token}));
    return older_token;
  };

  function verifytoken(token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      console.log('token');
      console.log(token);
      if (err) {
        //resp.send(JSON.stringify({'status':'success',error:err}));
        console.log('in error');
        tokenstatus = err.message;
      } else {
        console.log('in success !!');
        tokenstatus = true;
      }
    });
  };





  app.get('/createtoken', function (req, resp) {
    var older_token = jwt.sign({
      foo: 'bar',
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 3)
    }, app.get('superSecret'));

    const payload = {
      admin: true
    };
    var token = jwt.sign(payload, app.get('superSecret'), {
      //expiresInMinutes: 1440 // expires in 24 hours
    });
    resp.send(JSON.stringify({'status': 'success', token: token, oldtoken: older_token}));
    return;
  });
  app.get('/checktoken', function (req, resp) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        resp.send(JSON.stringify({'status': 'success', error: err}));
        return;
      } else {
        resp.send(JSON.stringify({'status': 'success', token: 'success'}));
      }
    });

    return;
  });



function createjwttoken() {
  var older_token = jwt.sign({
    foo: 'bar',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }, app.get('superSecret'));
  /*const payload = {
      admin: true     };
  var token = jwt.sign(payload, app.get('superSecret'), {
      //expiresInMinutes: 1440 // expires in 24 hours
  });*/
  //resp.send(JSON.stringify({'status':'success',token:token,oldtoken:older_token}));
  return older_token;
};

/*app.get('/test11', function (req, resp){
  resp.send(JSON.stringify({'status': 'dafd'}));
});*/



app.get('/temptoken', function (req, resp) {
  token:createjwttoken();
  resp.send(JSON.stringify({'status': 'success', token: createjwttoken()}));
});

https.createServer(options, app).listen(6012);






app.get('/te', function (req, resp) {
  resp.send(JSON.stringify({'status': 'success'}));
});


app.post('/sendforgotpasswordemail', function (req,resp){
    var collection=db.collection('users');
    var collection1=db.collection('apikey');
    var link;
    var datetime= moment().unix();
    /*    var _id = new mongodb.ObjectID(req.body._id);*/
    collection.find({email:req.body.email}).toArray(function(err, items) {
        if (items.length==0) {
            resp.send(JSON.stringify({'status':'error1', 'msg':'Email does not exists'}));
            return;
        } else {
            /*  resp.send(JSON.stringify({'status': 'success', 'item': items}));*/
            collection1.find().toArray(function(error , result){
                if(items.length==0){
                    resp.send(JSON.stringify({'status': 'error2', 'msg':'Email does not exists2'}));
                    return;
                } else{
                    /*  resp.send(JSON.stringify({'status': 'success', 'item':items,'result': result}));*/
                    const sgMail = require('@sendgrid/mail');
                    var api=result[0].apikey;
                    sgMail.setApiKey(api);/*result[0].apikey*/
                    /* resp.send(JSON.stringify({'status': 'success', 'item':items,'result': api}));*/
                    /*items[0].email,'debasiskar007@gmail.com',*/
                    var email = req.body.email;
                    // resp.send(JSON.stringify({'status': 'success4','email':email,'x':x}));
                    if(typeof (req.body.email) != 'undefined' && typeof (req.body.email) != '') {
                        params = email.match(/^([^@]*)@/)[1];
                        /*  resp.send(JSON.stringify({'status': 'success4','username':username}));*/
                        params = params.substring(0, 4) + makeid(4) + moment().unix();
                        /*  resp.send(JSON.stringify({'status': 'success4','username':username,'time': moment().unix(),'string': username.substring(0, 4) ,'abc': makeid(4)}));*/
                        params = params.toLowerCase();
                        /*   resp.send(JSON.stringify({'status': 'success4','params':params,'x':x}));*/
                        link=params;
                        collection.update({email:req.body.email},{$set:{temp_forgetpass_key:params}},function(err, results) {
                            if (err) {
                                resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
                            } else {
                                /*  resp.send(JSON.stringify({'status': 'success','results':results}));*/
                            }
                        });
                    }
                    resp.send(JSON.stringify({'status': 'success','link':link}));
                    var msg={
                        to:items[0].email,
                        from:'support@audiodeadline.com',
                        subject:'You have a forget password msg on Shatterproof.com',
                        text:'and easy to do anywhere, even with Node.js',
                        html: ' <div style="max-width: 600px; margin: 0 auto; background: #141220;  font-family: Arial; text-align: center;">\
           \ <div style="width: auto;  padding: 10px;">\
            \<div style=" font-family: Arial; text-align: center;   background: #111;">\
             \<div style=" border: solid 10px #333; padding: 5px;">\
        \<img src="http://shatterblock.influxiq.com/assets/images/shaterblockLogo.png"  style="width: 260px; display: block; margin: 20px auto; max-width: 80%;">\
        \<span style="display: block;  font-size: 20px; text-transform: uppercase;   color: #e23584; font-weight: bold;">\
         \<span style="display: inline-block; font-size: 20px;">Date:'+unixtodatetimeConverter(0,datetime)+'</span>\
         \<span style="display: inline-block; font-size: 20px;">Time:'+unixtodatetimeConverter(1,datetime)+'</span>\
       \<span style="display: inline-block; font-size: 20px;">Forgotten Password on Shop shatterblock</span>\
               </span>\
        \  <span style="display: block;  font-size: 16px; text-transform: capitalize; color: #dcdcdc; font-weight: bold; line-height: 29px;">\
		 \  <span style="display: inline-block; width:100%;">UserID:'+items[0]._id+'</span>\
             \  <span style="display: inline-block; width:100%;">username:'+items[0].username+'</span>\
               \</span>\
                \ <a  href="https://sol.apogeehost.com/~zufelt/password_reset?'+link+'" style="display: block; text-decoration: none; background:#faa318 ;  color: #fff; width: 80%; padding: 10px 2px; display: block; margin: 0 auto; margin-top: 10px; font-weight: bold; font-size: 18px;">Please follow this link to reset your password:<span style="text-align: center; font-size: 12px; width: 100%; display: inline-block; color: #111111; word-break: normal; word-wrap: normal; overflow: hidden;margin-top: 4px;">https://sol.apogeehost.com/~zufelt/password_reset?'+link+'</span>\</a>\
              \ <span style="font-size: 18px; color: #fff; padding: 15px 65px; display: block;">\
                This link is only valid for 24 hours. If you can not click the above url to continue please copy and paste the url into your browser.This email has been auto-generated and requested by you. If you feel you have received this email in error, please contact the administrator (edited)\ </span>\
               \</div>\
               \</div>\
               \</div>\
               \</div>'};
                    /*   resp.send(JSON.stringify({'status': 'success', 'item': items,'result':result,'result1': result[0].apikey,'x':x,'msg':msg}));*/
                    var x=sgMail.send(msg);
                    return;
                }

            });
        }
    });
});


app.post('/sendforgotpasswordemail1', function (req,resp){
    var collection=db.collection('users');
    var collection1=db.collection('apikey');
    var link;
    var datetime= moment().unix();
    /*    var _id = new mongodb.ObjectID(req.body._id);*/
    collection.find({email:req.body.email}).toArray(function(err, items) {
        if (items.length==0) {
            resp.send(JSON.stringify({'status':'error1', 'msg':'Email does not exists'}));
            return;
        } else {
            /*  resp.send(JSON.stringify({'status': 'success', 'item': items}));*/
            collection1.find().toArray(function(error , result){
                if(items.length==0){
                    resp.send(JSON.stringify({'status': 'error2', 'msg':'Email does not exists2'}));
                    return;
                } else{
                    /*  resp.send(JSON.stringify({'status': 'success', 'item':items,'result': result}));*/
                    const sgMail = require('@sendgrid/mail');
                    var api=result[0].apikey;
                    sgMail.setApiKey(api);/*result[0].apikey*/
                    /* resp.send(JSON.stringify({'status': 'success', 'item':items,'result': api}));*/
                    /*items[0].email,'debasiskar007@gmail.com',*/
                    var email = req.body.email;
                    // resp.send(JSON.stringify({'status': 'success4','email':email,'x':x}));
                    if(typeof (req.body.email) != 'undefined' && typeof (req.body.email) != '') {
                        params = email.match(/^([^@]*)@/)[1];
                        /*  resp.send(JSON.stringify({'status': 'success4','username':username}));*/
                        params = params.substring(0, 4) + makeid(4) + moment().unix();
                        /*  resp.send(JSON.stringify({'status': 'success4','username':username,'time': moment().unix(),'string': username.substring(0, 4) ,'abc': makeid(4)}));*/
                        params = params.toLowerCase();
                        /*   resp.send(JSON.stringify({'status': 'success4','params':params,'x':x}));*/
                         link=params;
                        collection.update({email:req.body.email},{$set:{temp_forgetpass_key:params}},function(err, results) {
                            if (err) {
                                resp.send(JSON.stringify({'status':'error','msg':'Database error occured. Try again!'}));
                            } else {
                              /*  resp.send(JSON.stringify({'status': 'success','results':results}));*/
                            }
                        });
                    }
                    resp.send(JSON.stringify({'status': 'success','link':link}));
                    var msg={
                        to:items[0].email,
                        from:'support@audiodeadline.com',
                        subject:'You have a forget password msg on Shatterproof.com',
                        text:'and easy to do anywhere, even with Node.js',
                        html: ' <div style="max-width: 600px; margin: 0 auto; background: #141220;  font-family: Arial; text-align: center;">\
           \ <div style="width: auto;  padding: 10px;">\
            \<div style=" font-family: Arial; text-align: center;   background: #111;">\
             \<div style=" border: solid 10px #333; padding: 5px;">\
        \<img src="http://shatterblock.influxiq.com/assets/images/shaterblockLogo.png"  style="width: 260px; display: block; margin: 20px auto; max-width: 80%;">\
        \<span style="display: block;  font-size: 20px; text-transform: uppercase;   color: #e23584; font-weight: bold;">\
         \<span style="display: inline-block; font-size: 20px;">Date:'+unixtodatetimeConverter(0,datetime)+'</span>\
         \<span style="display: inline-block; font-size: 20px;">Time:'+unixtodatetimeConverter(1,datetime)+'</span>\
       \<span style="display: inline-block; font-size: 20px;">Forgotten Password on Shop shatterblock</span>\
               </span>\
        \  <span style="display: block;  font-size: 16px; text-transform: capitalize; color: #dcdcdc; font-weight: bold; line-height: 29px;">\
		 \  <span style="display: inline-block; width:100%;">UserID:'+items[0]._id+'</span>\
             \  <span style="display: inline-block; width:100%;">username:'+items[0].username+'</span>\
               \</span>\
                \ <a  href="https://sol.apogeehost.com/~zufelt/password_reset?'+link+'" style="display: block; text-decoration: none; background:#faa318 ;  color: #fff; width: 80%; padding: 10px 2px; display: block; margin: 0 auto; margin-top: 10px; font-weight: bold; font-size: 18px;">Please follow this link to reset your password:<span style="text-align: center; font-size: 12px; width: 100%; display: inline-block; color: #111111; word-break: normal; word-wrap: normal; overflow: hidden;margin-top: 4px;">https://sol.apogeehost.com/~zufelt/password_reset?'+link+'</span>\</a>\
              \ <span style="font-size: 18px; color: #fff; padding: 15px 65px; display: block;">\
                This link is only valid for 24 hours. If you can not click the above url to continue please copy and paste the url into your browser.This email has been auto-generated and requested by you. If you feel you have received this email in error, please contact the administrator (edited)\ </span>\
               \</div>\
               \</div>\
               \</div>\
               \</div>'};
                    /*   resp.send(JSON.stringify({'status': 'success', 'item': items,'result':result,'result1': result[0].apikey,'x':x,'msg':msg}));*/
                    var x=sgMail.send(msg);
                    return;
                }

            });
        }
    });
});
function makeid( ln) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < ln; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function unixtodatetimeConverter(flag,UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = (months[a.getMonth()]);
    if(month.toString().length==1) month='0'+month;
    var date = (a.getDate());
    if(date<10) var dates='0'+date.toString();
    else var dates=date.toString();
    var hours = (a.getHours());
    if(hours<10) var hour='0'+hours;
    else var hour=hours.toString();
    var min = (a.getMinutes());
    if(min.toString().length==1) var mins='0'+min;
    else var mins=min.toString();
    var sec = (a.getSeconds());
    if(sec.toString().length==1) var secs='0'+sec;
    else var secs=sec.toString();
    var ampm = ((hours) >= 12) ? "PM" : "AM";
    if( flag==0)var time = month + '-' + dates + '-'+year ;
    if( flag==1) var time  =  hour + ':' + mins + ':' + secs+ " "+ampm ;
    return time;
  /*  var datetime=[];
    datetime.push(date);
    datetime.push(time);
    return datetime;*/
}


