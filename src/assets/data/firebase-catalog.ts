interface translation {
  [key: string]: string;
}

export const FirebaseErrorCatalogs: translation = {
  unknownError: "An unexpected error occurred. Please try again.",
  "invalid-session": "Invalid Session",
  "invalid-session-message": "Your session is invalid, please login again",
  "registration-error": "Registration Error",
  "user-created": "User Registered",
  "user-created-message": "New user account registered successfully",
  "change-password-email": "Password Reset Link Sent",
  "change-password-email-message":
    "We have successfully sent a password reset link to your address. Please check your email to change your password, then try to login again.",
  "change-password-email-error": "Password Reset Email Error",
  "change-password-email-error-message":
    "There was an error sending the email to reset your password. Please check the address and try again.",
  "change-password-error": "Password Reset Error",
  "change-password-successful": "Password Change Successful",
  "change-password-successful-message":
    "You have successfully changed your password.",
  "logout-error": "Logout Error",
  "login-error": "Login Error",
  "email-send": "Verification Email Sent",
  "email-send-message": "A new verification link was sent to your email",
  "email-send-error": "Error Verifying Email",
  "email-not-verified": "Email Not Verified",
  "email-not-verified-message":
    "We are sorry, your email is still not verified. Please re-send and check your email for a link",
  "email-verified": "Email Verified",
  "email-verified-message": "Your email has been verified successfully",
  "phone-link-error": "Error Linking Phone",
  "phone-verify-error": "Error Verifying Phone",
  "phone-auth-error":
    "You must enter your full number, with country and area code, for example +14155551212",
  "phone-code-sent": "SMS Code Sent",
  "phone-code-sent-message": "The SMS verification code was sent successfully",
  "phone-code-auto": "SMS Code Received",
  "phone-code-auto-message":
    "The SMS verification code was retrieved successfully",
  "phone-link-success": "Phone Verified",
  "phone-link-success-message":
    "Your phone number has been successfully verified",
  "auth/firebase-auth":
    "This application only works on devices with Google Play Services",
  "auth/captcha-check-failed":
    "The CAPTCHA check failed. Please wait a moment, then try again",
  "auth/app-not-authorized":
    "This application is not permitted to use authentication. Contact Customer Support",
  "auth/credential-already-in-use":
    "That login is in use by another account already. You should login with the other account, then link this one.",
  "auth/invalid-action-code": "Code expired, please try again",
  "auth/session-expired": "Session expired, please try again",
  "auth/code-expired": "Code expired, please try again",
  "auth/network-request-failed": "Network request failed, please try again",
  "auth/expired-action-code":
    "Code already used or malformed, please try again",
  "auth/invalid-phone-number": "Invalid phone number",
  "auth/provider-already-linked":
    "You have already connected this sign in method",
  "auth/invalid-verification-code":
    "The SMS code you entered was invalid. Please send the code again",
  "auth/invalid-verification-id":
    "The SMS code you entered was invalid. Please send the code again",
  "auth/invalid-email": "Incorrect email format",
  "auth/email-already-in-use":
    'The email you entered is already in use. Please use a different email or recover the account with that email with "forgot password"',
  "auth/quota-exceeded":
    "This application has exceeded it's SMS quota! Please contact customer support",
  "auth/user-disabled": "This account has been disabled",
  "auth/user-not-found": "Email or password incorrect",
  "auth/unknown":
    "We are sorry, there was an error on the server with your request. Usually that means try again in a few minutes",
  "auth/wrong-password": "Email or password incorrect",
  "auth/weak-password": "Password must be at least 6 characters",
  "auth/too-many-requests":
    "Too many codes requested too quickly. Please wait before trying again.",
  "auth/invalid-credential":
    "Authentication failure. Please close the app, re-open, and try again.",
};
