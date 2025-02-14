import { User } from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/Tokens.js";

//signUp Validate

export const userSignup = async (req, res) => {
  try {
    const { name, email, password, mobileno } = req.body;

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

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      success: true,
      message: "Account Created successfully",
      user: {
        id: response.id,
        name: response.name,
        email: response.email,
      },
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
      email: user.email,
      name: user.name,
    };

    const token = generateToken(payload);

    //Genrate Cookies

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
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
    const { email, name, profilePicture } = req.body;

    if (!email || !name ) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    const user = await User.findOne({ email });


    if (!user) {
      try {
        const response = await User.create({
          name,
          email,
          profilePicture: profilePicture || "",
        });

        const token = generateToken({
          id : response.id,
          name: response.name,
          email: response.email,
          profilePicture: response.profilePicture,
        });

        console.log("User Controller Response SignUp google",response);
        

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
          success: true,
          message: "Google Login Successfully",
          token,
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
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      
      console.log("Success : Google log",token);
    } catch (error) {
      console.error("Google login error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Google login failed",
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
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
    const { email, name, picture } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
      
    }
    
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log(email ,"FB",name);
      try {
        const response = await User.create({
          name,
          email,
          profilePicture: picture || "", 
        });

        const token = generateToken({
          name: response.name,
          email: response.email,
          profilePicture: response.profilePicture,
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 3 * 24 * 60 * 60 * 1000, 
        });

        console.log("FB Sign",response,token);
        

        return res.status(201).json({
          success: true,
          message: "Facebook login successful, user created",
          token,
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
      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      });

      console.log("Generating token",token);
      

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000, 
      });

      return res.status(200).json({
        success: true,
        message: "Facebook login successful",
        token,
      });
    } catch (error) {
      console.error("Facebook login error:", error);
      return res.status(500).json({
        success: false,
        message: "Facebook login failed",
      });
    }

  } catch (error) {
    console.error("Facebook login error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Facebook login failed",
    });
  }
};

//Get User Data

export const getUserData = async (req,res) => {
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

//Update User...

export const updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const updates = req.body;
    const allowedUpdates = [
      "name",
      "email",
      "mobileno",
      "city",
      "dob",
      "profilePicture",
      "gender",
    ]; 
    const updateFields = Object.keys(updates);
    const isValidUpdate = updateFields.every((field) =>
      allowedUpdates.includes(field)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid fields. You can only update name, email, mobileno, city, dob, profilePicture, or gender.",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    updateFields.forEach((field) => {
      user[field] = updates[field];
    });

    await user.save();

    const newToken = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileno: user.mobileno,
        city: user.city,
        dob: user.dob,
        gender: user.gender,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};
