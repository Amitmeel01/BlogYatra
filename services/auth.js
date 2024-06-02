// inhe kahi bhi access kiya ja skta hai

const JWT=require('jsonwebtoken');

const secret='superman123'


function createTokenForUser(user){
    const paylod={
         _id:user._id,
         fullName:user.fullName, // this is extra added in last
         email:user.email,
         profileImage:user.profileImage,
         role:user.role,
         
    };


    const token=JWT.sign(paylod,secret);
    return token;

}


function validateToken(token){

    const payload=JWT.verify(token,secret);
    return payload;

}

module.exports={createTokenForUser,validateToken}