const ALLOWED_HOSTNAMES = (
  process.env.TURNSTILE_ALLOWED_HOSTNAMES || "localhost"
)
  .split(",")
  .map((hostname) => hostname.trim())
  .filter(Boolean);

const verifyTurnstile = (expectedAction) => {
  return async (req, res, next) => {
    const token = req.body?.captchaToken;
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      console.error("Missing TURNSTILE_SECRET_KEY");

      return res.status(503).json({
        success: false,
        message: "Dịch vụ xác minh CAPTCHA chưa được cấu hình.",
      });
    }

    if (
      typeof token !== "string" ||
      token.length === 0 ||
      token.length > 2048
    ) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng hoàn thành CAPTCHA.",
      });
    }

    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          signal: AbortSignal.timeout(10000),
          body: new URLSearchParams({
            secret,
            response: token,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Cloudflare Siteverify returned ${response.status}`);
      }

      const result = await response.json();
      console.log("TURNSTILE DEBUG:", {
        success: result.success,
        action: result.action,
        hostname: result.hostname,
        errorCodes: result["error-codes"],
        expectedAction,
        allowedHostnames: ALLOWED_HOSTNAMES,
      });
      if (
        !result.success ||
        result.action !== expectedAction ||
        !ALLOWED_HOSTNAMES.includes(result.hostname)
      ) {
        return res.status(403).json({
          success: false,
          message: "CAPTCHA không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.",
        });
      }

      next();
    } catch (error) {
      console.error("Turnstile verification failed:", error.message);

      return res.status(503).json({
        success: false,
        message: "Không thể xác minh CAPTCHA lúc này. Vui lòng thử lại.",
      });
    }
  };
};

module.exports = verifyTurnstile;
