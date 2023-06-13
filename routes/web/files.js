var express = require("express");
var fetch = require("node-fetch");
var dotenv = require("dotenv/config");
var fs = require('fs');
//var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var params = require("../../params/params");
const { response } = require("express");
//const {CLIENT_ID,APP_SECRET} = proces.env;

var router = express.Router();

//router.use(ensureAuthenticated);

router.get("/", async(req, res)=>{
    const data = await generateAccessTokenFetch();
    console.log(data.access_token);
    //res.json(data);

    const filedata = await getListofFiles(data);
    
    res.render("files/viewfiles",{filedata:filedata});
    
 });


 router.post("/view", async(req, res)=>{
    
    var url = req.body.url;
    

    console.log("fileId "+req.body.url);
    
    const token = await generateAccessTokenFetch();
    var xmlbody = '<data><criterion> '+
                  '<name>customerAccountID</name>'+
                  '<operator>EQUAL</operator>'+
                  '<value>111111111</value>'+
                  '</criterion></data>';
    console.log(params.USERNAME+":"+params.PASSWORD);
    var url = req.body.url;
    var length = url.length;
    var refUrl = url.substring(1,url.length);
    //const response = await fetch(params.INFOARCHIVE_URL+"restapi/systemdata/search-results/"+req.params.fileId+"/ci?"+req.params.refId,{
      const response = await fetch(refUrl,{
        method : "get",
        headers : {
            'Content-Type' : 'application/xml',
            'Authorization' : 'Bearer '+ token.access_token,

        },

    }).then((response) => {
       /// response = {  headers: response.headers };
        if (response.ok) {
            console.log(response.headers);
            for(const header of response.headers){
                console.log(`Name : ${header[0]}, Value : ${header[1]}`);
            }
            //const blob = response.blob()
            console.log("Response "+JSON.stringify(response));
            //console.log(blob)
            res.setHeader("Headers",response.headers);
            res.contentType("application/pdf");
            //response.('hashalgorithm',response.headers.)
            res.header("content-disposition",response.headers["content-disposition"]);
            //res.header("content-type",response.headers["content-type"]);
            
            res.header(response.headers);
            //res.write(200,response);
            //res.end();
            res.header("hash",response.headers["hash"]);
            res.header("hashalgorithm",response.headers["hashalgorithm"]);
            res.header("hashencoding",response.headers["hashencoding"]);
            res.header("content-lenght",response.headers["content-length"]);
            res.header("requestid",response.headers["requestid"]);
            res.header("x-content-type-options",response.headers["x-content-type-options"]);
            res.header("x-frame-options",response.headers["x-frame-options"]);
            res.header("x-xss-protection",response.headers["x-xss-protection"]);
            //res.send(200,response.body);
            res.send(200);
            //res.set({
            //    'cache-control': response.headers['cache-control'],
            //    'content-type': response.headers['content-type'],
             //   'content-length': response.headers['content-length'],
             //   'content-disposition': `attachment; filename="PDF_output.pdf"`,
             //   'etag': response.headers['etag'],
             //   'request-id' : response.headers['request-id'],

              //});

              //res.setHeader("Headers",response.headers);
           // res.write(response);
            //res.end();
            //res.render("files/viewpdf",{response:response});
        } else {
            throw new Error(`Got response.status: ${response.status}`);
        }
    });
    //res.render("files/viewfiles",{filedata:filedata});
    
    
 });

 router.post("/add", function(req, res){

    var newPost = new Post({
        title:req.body.title,
        content:req.body.content,
        userID:req.user._id
    });

    newPost.save(function(err,post){
        if(err){console.log(err);}
        res.redirect("/posts");
    });

 });

 //: means a route parameter it could be anything and it's often an ID
 // localhost:3000/posts/12345 --> fetch the post with id 12345
router.get("/:postId", function(req,res){
    Post.findById(req.params.postId).exec(function(err, post){
        res.render("post/detailpost",{post:post});
    });
});

router.get("/edit/:postId", function(req,res){
    Post.findById(req.params.postId).exec(function(err, post){
        res.render("post/editpost",{post:post});
    });
});

router.post("/update", async function(req, res){
     const post = await Post.findById(req.body.postid);
     
     post.title = req.body.title;
     post.content = req.body.content;

     // post.save()

     try {
         let savePost = await post.save();
         console.log("savepost", savePost);
         res.redirect("/posts/" + req.body.postid);

     } catch (err) {
         console.log("error happened");
         res.status(500).send(err);
     }

});
async function generateAccessTokenFetch(req,res,next){

    
    console.log(params.USERNAME+":"+params.PASSWORD);
    const response = await fetch(params.INFOARCHIVE_URL+"oauth/token",{

        method : "post",
        body: "grant_type=password&username=sx@iacustomer.com&password=password",
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic '+ Buffer.from('infoarchive.cli:MREsxWUdI').toString("base64"),

        },

    });
    const data = await response.json();
    return data;
}

async function getListofFiles(req,res,next){

    var xmlbody = '<data><criterion> '+
                  '<name>customerAccountID</name>'+
                  '<operator>EQUAL</operator>'+
                  '<value>111111111</value>'+
                  '</criterion></data>';
    console.log(params.USERNAME+":"+params.PASSWORD);
    const response = await fetch(params.INFOARCHIVE_URL+"restapi/systemdata/search-compositions/fce6e066-c639-4adc-b687-6e03aa297f17",{

        method : "post",
        body: xmlbody,
        headers : {
            'Content-Type' : 'application/xml',
            'Authorization' : 'Bearer '+ req.access_token,

        },

    });
    const data = await response.json();
    console.log("response from infoarchive "+JSON.stringify(data));             
    return data;
}

async function downloadfiles(req,res,next){
    const token = await generateAccessTokenFetch();
    var xmlbody = '<data><criterion> '+
                  '<name>customerAccountID</name>'+
                  '<operator>EQUAL</operator>'+
                  '<value>111111111</value>'+
                  '</criterion></data>';
    console.log(params.USERNAME+":"+params.PASSWORD);
    var url = req.body.url;
    var length = url.length;
    var refUrl = url.substring(1,url.length);
    //const response = await fetch(params.INFOARCHIVE_URL+"restapi/systemdata/search-results/"+req.params.fileId+"/ci?"+req.params.refId,{
      const response = await fetch(refUrl,{
        method : "get",
        headers : {
            'Content-Type' : 'application/xml',
            'Authorization' : 'Bearer '+ token.access_token,

        },

    }).then((response) => {
        if (response.ok) {
            console.log(response.headers);
            //const blob = response.blob()
            console.log("Response "+response)
            //console.log(blob)
            res.render("files/viewpdf",{response:response});
        } else {
            throw new Error(`Got response.status: ${response.status}`);
        }
    }).then(response => {
        return "Success";
    
    }).catch(e => {
        console.log(e);
    });
   // const data = await response.json();
    console.log("response from infoarchive ");             
    //return data;
}
module.exports = router;        
