export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === "admin" ? "admin_token" : "user_token";

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
      user,
    });
};
