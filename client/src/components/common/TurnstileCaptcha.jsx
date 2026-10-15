import { useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function TurnstileCaptcha({ action, onVerify }) {
  const widgetRef = useRef(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return <p role="alert">Chưa cấu hình CAPTCHA. Vui lòng thử lại sau.</p>;
  }

  return (
    <div className="turnstile-container">
      <Turnstile
        ref={widgetRef}
        siteKey={siteKey}
        options={{ action }}
        onSuccess={(token) => onVerify(token)}
        onExpire={() => onVerify("")}
        onError={() => onVerify("")}
      />
    </div>
  );
}
