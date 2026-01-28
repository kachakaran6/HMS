import nodemailer from "nodemailer";

export const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    // secure: false,
    auth: {
      user: "kachakaran06@gmail.com",
      pass: `ketprbnpemblnefm`,
    },
  });

  await transporter.sendMail({
    from: `"HMS" kachakaran06@gmail.com`,
    to: email,
    subject: "Your OTP Code",
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>HMS A-Care OTP Verification</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table width="100%" max-width="500px" cellpadding="0" cellspacing="0"
            style="background:#ffffff; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.08); font-family:Arial, sans-serif;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:24px; background:#0f766e; color:#ffffff; border-radius:8px 8px 0 0;">
                <h1 style="margin:0; font-size:22px;">HMS A-Care</h1>
                <p style="margin:6px 0 0; font-size:14px;">Hospital Management System</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px; color:#334155;">
                <h2 style="margin-top:0;">Email Verification Code</h2>
                <p style="font-size:15px; line-height:1.6;">
                  Thank you for using <strong>HMS A-Care</strong>.  
                  Please use the One-Time Password (OTP) below to verify your email address.
                </p>

                <!-- OTP Box -->
                <div style="
                  margin:24px 0;
                  padding:16px;
                  background:#ecfeff;
                  border:1px dashed #0f766e;
                  border-radius:6px;
                  text-align:center;
                  font-size:32px;
                  font-weight:bold;
                  letter-spacing:6px;
                  color:#0f766e;">
                  ${otp}
                </div>

                <p style="font-size:14px; line-height:1.6;">
                  This OTP is valid for <strong>5 minutes</strong>.  
                  For security reasons, please do not share this code with anyone.
                </p>

                <p style="font-size:14px; color:#64748b;">
                  If you did not request this verification, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:16px; background:#f1f5f9; border-radius:0 0 8px 8px;">
                <p style="margin:0; font-size:12px; color:#64748b;">
                  © ${new Date().getFullYear()} HMS A-Care. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
  });
  console.log("📧 Sending OTP email to:", email);
};
