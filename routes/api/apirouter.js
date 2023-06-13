var params = require("./params/params");

async function generateAccessTokenFetch(req,res,next){

    
    const response = await fetch(params.INFOARCHIVE_URL+"/oauth/token",{

        method : "post",
        body : {
            "grant_type" : "password",
            "username" : "sx@iacustomer.com",
            "password" : "password"
        },
        headers : {
            Authorization : "Basic "+ Buffer.from(params.USERNAME+":"+params.PASSWORD).toString("base64"),

        },

    });
    const data = await response.json();
    return data;
}