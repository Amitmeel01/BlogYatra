//user register h ki nahi

const { validateToken } = require("../services/auth");

function checkAuthenticationCookie(cookiename){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookiename];

        if(!tokenCookieValue){
           return next();
        }


        try{
            const userPayload=validateToken(tokenCookieValue);
            req.user=userPayload
        }catch(err){}


       return next()
      
    }
}

module.exports=checkAuthenticationCookie