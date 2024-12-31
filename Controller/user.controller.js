import User from '../Model/user.model.js';
import brycpt from 'bcryptjs';

//signUp Validate 

export const userSignup = async (req, res) => {
       try {
        const { name, email, password,mobileno } = req.body;
        if (!name || !email || !password || !mobileno) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }
        const user = await User.findOne({ email });
            if(user){
                return res.status(400).json({
                    success:false,
                    message:"User already exist with this email."
                })
            }

            const hashPassword = await brycpt.hash(password, 10);

            await user.create({
                name,
                email,
                password:hashPassword,
                mobileno
            });

            return res.status(201).json({
                success:true,
                message:"Account Created successfully"
            });

       }
        catch (error) 
        { 
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Failed to create account"
            })  
       }
}

//Login Validate

export const userLogin = async (req,res)=>{
    try {   
        const {email,password} = req.body;
        if (!email || !password) {
           return res.status(400).json({
                success : false,
                message : "All Fields Are Required"
            })
        }
        const user = await User.findOne({ email });
        
        if(!user){
          return res.status(400).json({
                success : false,
                message : "Incorrect E-mail Or Password"
            })
        }

        const isPasswordMatch = await brycpt.compare(password,user.password)

        if (!isPasswordMatch) {
             return res.status(400).json({
                success : false,
                message : "Incorrect E-mail Or Password"
            })
        }
        
    } 
    catch (error) 
        { 
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Failed to create account"
            })  
       }
}