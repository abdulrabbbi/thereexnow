import { GLOBAL_CONFIG } from "@/global-config";
import EmailVerifiedView from "@/sections/auth/email-verified/view";

export const metadata = {
  title: `Email verified successfully | ${GLOBAL_CONFIG.appName}`,
};

export default function Page() {
  return <EmailVerifiedView />;
}
