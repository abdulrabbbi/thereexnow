import { GLOBAL_CONFIG } from "@/global-config";
import SignUpView from "@/sections/auth/sign-up/view";

export const metadata = {
  title: `Sign up | ${GLOBAL_CONFIG.appName}`,
};

export default function Page() {
  return <SignUpView />;
}
