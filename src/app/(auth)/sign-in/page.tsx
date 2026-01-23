import { GLOBAL_CONFIG } from "@/global-config";
import SignInView from "@/sections/auth/sign-in/view";

export const metadata = {
  title: `Sign in | ${GLOBAL_CONFIG.appName}`,
};

export default function Page() {
  return <SignInView />;
}
