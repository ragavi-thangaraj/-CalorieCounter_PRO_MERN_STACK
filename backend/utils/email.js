const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'mohamedathikr.22msc@kongu.edu',
      pass: 'jydu rtbm trgs vuvo'
    },
    ...(isProduction ? {} : { tls: { rejectUnauthorized: false } })
  });
};

// Send OTP email
const sendOTP = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Calorie Counter" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Calorie Counter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Calorie Counter!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hi ${name},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for signing up! Please verify your email address by entering the following OTP code:
            </p>
            
            <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <h3 style="color: #1f2937; margin: 0; font-size: 32px; letter-spacing: 8px; font-weight: bold;">${otp}</h3>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              This code will expire in 10 minutes for security reasons.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; text-align: center;">
                If you didn't create an account, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

module.exports = { sendOTP };