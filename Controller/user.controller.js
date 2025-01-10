import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/Tokens.js";

//signUp Validate

export const userSignup = async (req, res) => {
  try {
    const { name, email, password, mobileno } = req.body;
    console.log(req.body);
    
    if (!(name || email || password || mobileno)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const response = await User.create({
      name,
      email,
      password: hashPassword,
      mobileno,
    });

    const payload = {
      id: response.id,
      email: response.email,
    };

    const token = generateToken(payload);

    //Genrate Cookies 

    res.cookie('token',token,{
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    return res.status(201).json({
      success: true,
      message: "Account Created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
};

//Login Validate

export const userLogin = async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect E-mail Or Password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect E-mail Or Password",
      });
    }

    const payload = {
      id: user.id,
      email : user.email,
      name : user.name
    };

    const token = generateToken(payload);

    //Genrate Cookies 

    res.cookie('token',token,{
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      message : "Login Successful",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

//Google Login

export const googleLogin = async (req, res) => {
  try {
    const { email, name, picture, token } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      try {
        user = await User.create({
          name,
          email,
          password: token,
          profilePicture: picture || "",
        });
      } catch (createError) {
        console.error("User creation error:", createError);
        return res.status(500).json({
          success: false,
          message: "Failed to create user account",
        });
      }
    }

    try {
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
  
      const token = generateToken(payload);
  
      //Genrate Cookies 
  
      res.cookie('token',token,{
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000,
      })
    } catch (tokenError) {
      console.error("Token generation error:", tokenError);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Google login failed",
    });
  }
};

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
        profilePicture: picture,
      });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = generateToken(payload);

    //Genrate Cookies 

    res.cookie('token',token,{
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Facebook login failed",
    });
  }
};


export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
