import nodemailer from "nodemailer";


console.log(process.env.email);


async function sendOtp(req, res) {
  const { email } = req.body; 

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required to send OTP.",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.email, 
        pass: process.env.email_pass, 
      },
    });

    const info = await transport.sendMail({
      from: '"Well Care" <manthanbhai67@gmail.com>', 
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for Sign-Up is: ${otp}`,
    });
    console.log(otp);
    
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      otp
    });

  } catch (error) {
    console.error("Error sending OTP:", error);

    res.status(500).json({
      success: false,
      message: "Error sending OTP. Please try again.",
    });
  }
}

export default sendOtp;
