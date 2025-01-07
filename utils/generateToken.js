import jwt from "jsonwebtoken"

const generateToken = (res, user, message) => {
    if (!process.env.SECRET_KEY_JWT) {
        throw new Error('SECRET_KEY_JWT is not configured');
    }

    try {
        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY_JWT,
            { expiresIn: "30d" }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, 
        });

        return res.status(200).json({
            success: true,
            message,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Token generation error:', error);
        throw error;
    }
}

export default generateToken; 