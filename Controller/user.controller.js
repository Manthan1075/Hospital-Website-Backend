import { User } from "../Models/user.model.js"
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

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

            const hashPassword = await bcrypt.hash(password, 10);

            await User.create({
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

        const isPasswordMatch = await bcrypt.compare(password,user.password)

        if (!isPasswordMatch) {
             return res.status(400).json({
                success : false,
                message : "Incorrect E-mail Or Password"
            })
        }
        generateToken(res,user,`Welcome Back ${user.name}`);
    } 

    catch (error) 
        { 
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Failed to login"
            })  
       }
}



export const googleLogin = async (req, res) => {
    try {
        const { email, name, picture, token } = req.body;
        
        if (!email || !name) {
            return res.status(400).json({
                success: false,
                message: "Email and name are required"
            });
        }

        let user = await User.findOne({ email });
        
        if (!user) {
            try {
                user = await User.create({
                    name,
                    email,
                    password: token,
                    profilePicture: picture || ""
                });
            } catch (createError) {
                console.error('User creation error:', createError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to create user account"
                });
            }
        }

        try {
            return generateToken(res, user, `Welcome ${user.name}`);
        } catch (tokenError) {
            console.error('Token generation error:', tokenError);
            return res.status(500).json({
                success: false,
                message: "Authentication failed"
            });
        }
        
    } catch (error) {
        console.error('Google login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Google login failed"
        });
    }
}

export const facebookLogin = async (req, res) => {
    try {
        const { email, name, picture, accessToken, userID } = req.body;
        
        let user = await User.findOne({ email });
        
        if (!user) {
            user = await User.create({
                name,
                email,
                password: accessToken, 
                mobileno: null, 
                profilePicture: picture
            });
        }

        generateToken(res, user, `Welcome ${user.name}`);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Facebook login failed"
        });
    }
}

export async function getUserData(req,res) {
    try {
        const email = req.email;
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(404).json({
                user : null,
                message : "User Not Found"
            })
        }
        return res.status(200).json({
            user
        })

    } catch (error) {
         console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed To Fetch User Data"
        });
    }
}