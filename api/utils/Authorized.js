import jwt from 'jsonwebtoken'

export const isAuthorized=async(req,res,next)=>{
   
        const token = req.cookies.access_token;
       // console.log(token);
      
        if (!token) return res.status(401).send({success:false,message:"Unauthorized"})
      
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
          if (err) return res.status(403).send({success:false,message:"Forbidden"})
      
          req.user = user;
          next();
        });
      };

