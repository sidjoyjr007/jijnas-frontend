export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const OTP_REGEX = /^\d{6}$/;

export const ALERT = "alert";
export const WARNING = "warning";
export const INFO = "info";
export const SUCCESS = "success";

export const copyToClipBoard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

// text constants
export const textConstants = {
  validName: "Please enter a valid name.",
  validEmail: "Please enter a valid email",
  validNameChars: "The name must be between 3 and 15 characters.",
  validPwd: "Please enter a valid password.",
  validPwdRules:
    "The password must be at least eight characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  selectCountry: "Please select your country",
  validVerificationCode: "Please Enter valid verifcation code",
  createNewAccount: "Create your new account"
};
