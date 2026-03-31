/**
 * Cloudflare Turnstile server-side verification.
 * Validates tokens against the Siteverify API.
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResult {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<{ valid: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Skip verification if no secret key configured (dev mode)
  if (!secret) {
    return { valid: true };
  }

  if (!token || token.length > 2048) {
    return { valid: false, error: "Invalid token" };
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ip,
      }),
    });

    const result: TurnstileVerifyResult = await res.json();

    if (result.success) {
      return { valid: true };
    }

    return {
      valid: false,
      error: result["error-codes"]?.join(", ") || "Verification failed",
    };
  } catch {
    // Fail open on network errors to not block legitimate users
    console.error("Turnstile verification failed — allowing request");
    return { valid: true };
  }
}
