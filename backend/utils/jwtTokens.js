export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const roleToCookie = {
    admin: "admin_token",
    patient: "user_token",
    doctor: "doctor_token",
  };

  const cookieName = roleToCookie[user.role];

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      httpOnly: true,
      // ✅ REQUIRED FOR LIVE (Vercel + Render)
      secure: true, // HTTPS only
      sameSite: "None", // cross-site cookie
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      ),
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
