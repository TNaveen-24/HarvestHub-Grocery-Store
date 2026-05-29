import handlebars from "handlebars";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // For development - use Ethereal Email (fake SMTP service)
  if (process.env.NODE_ENV !== "production") {
    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME || "ethereal.user@ethereal.email",
        pass: process.env.EMAIL_PASSWORD || "ethereal.pass",
      },
    });
  }

  // For production - use your email service
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Email templates
const emailTemplates = {
  emailVerification: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; text-align: center; font-size: 28px;">Welcome to HarvestHub!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi {{name}},</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Thank you for joining HarvestHub! We're excited to have you as part of our community.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          To complete your registration and start exploring fresh groceries, please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{verificationUrl}}" 
             style="background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #0ea5e9; font-size: 14px; word-break: break-all;">
          {{verificationUrl}}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          This verification link will expire in 24 hours. If you didn't create an account with HarvestHub, please ignore this email.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>Happy Shopping!</p>
        <p><strong>The HarvestHub Team</strong></p>
      </div>
    </div>
  `,

  passwordReset: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; text-align: center; font-size: 28px;">Password Reset Request</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi {{name}},</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password for your HarvestHub account.
        </p>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          If you made this request, click the button below to reset your password:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{resetUrl}}" 
             style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          If the button doesn't work, you can copy and paste this link into your browser:
        </p>
        <p style="color: #dc2626; font-size: 14px; word-break: break-all;">
          {{resetUrl}}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          This password reset link will expire in 30 minutes. If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>Stay Safe!</p>
        <p><strong>The HarvestHub Team</strong></p>
      </div>
    </div>
  `,

  welcomeUser: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0; text-align: center; font-size: 28px;">Welcome to HarvestHub!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0;">Hi {{name}},</h2>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Your email has been successfully verified! Welcome to HarvestHub, your trusted partner for fresh groceries and quality products.
        </p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #0ea5e9; margin-top: 0;">What's next?</h3>
          <ul style="color: #475569; line-height: 1.6;">
            <li>Explore our wide range of fresh fruits and vegetables</li>
            <li>Add your favorite items to your cart</li>
            <li>Set up delivery preferences</li>
            <li>Enjoy fast and reliable delivery</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{shopUrl}}" 
             style="background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Start Shopping
          </a>
        </div>
        
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          If you have any questions, our customer support team is here to help you 24/7.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>Happy Shopping!</p>
        <p><strong>The HarvestHub Team</strong></p>
      </div>
    </div>
  `,
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    let htmlContent;

    // Check if template is provided
    if (options.template && emailTemplates[options.template]) {
      const template = handlebars.compile(emailTemplates[options.template]);
      htmlContent = template(options.context || {});
    } else {
      htmlContent = options.html || options.message;
    }

    const mailOptions = {
      from: `HarvestHub <${
        process.env.EMAIL_FROM || "noreply@harvesthub.com"
      }>`,
      to: options.email,
      subject: options.subject,
      html: htmlContent,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);

    // Log email info for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Email sent successfully!");
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Email could not be sent");
  }
};

// Send bulk emails
export const sendBulkEmail = async (recipients, options) => {
  try {
    const promises = recipients.map((recipient) =>
      sendEmail({
        ...options,
        email: recipient.email,
        context: { ...options.context, name: recipient.name },
      })
    );

    return await Promise.allSettled(promises);
  } catch (error) {
    console.error("Bulk email sending error:", error);
    throw new Error("Bulk emails could not be sent");
  }
};
