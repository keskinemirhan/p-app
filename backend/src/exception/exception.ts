
export const exceptionCodes = {
  "EMAIL_EXISTS": "An account with this email already exists",
  "ACC_ID_USED": "An account with this id already exists",
  "ACC_NOT_FOUND": "Account not found",
  "INVALID_TOKEN": "Invalid token",
  "INVALID_CREDS": "Invalid credentials",
  "VERIFICATION_FAILED": "Verification Failed",
  "VERIFICATION_NOT_FOUND": "Verification request has not been requested",
  "WRONG_VERIFICATION": "Verification type is wrong for this action",
  "INVALID_VERIFICATION_CODE": "Verification code invalid",
  "VERIFICATION_EXPIRED": "Verification expired",
  "ALREADY_VERIFIED": "Email has been verified already",
  "UNVERIFIED_ACCOUNT": "Your account should be verified",
  "UNAUTHORIZED": "Can not access this endpoint",
  "PROFILE_NOT_FOUND": "Profile not found",
  "EDUCATION_NOT_FOUND": "Education Not Found",
  "EXPERIENCE_NOT_FOUND": "Experience Not Found",
  "CAPABILITY_NOT_FOUND": "Experience Not Found",
  "PROJECT_NOT_FOUND": "Project not found",
  "REFERENCE_NOT_FOUND": "Reference not found",
  "CANNOT_REFERENCE_ITSELF": "Cannot reference same profile"
} as const;

interface ClientException {
  code: ExceptionCode;
  msg: typeof exceptionCodes[ExceptionCode]
}

export type ExceptionCode = keyof typeof exceptionCodes;

export function generateException(code: ExceptionCode): ClientException {
  return {
    code,
    msg: exceptionCodes[code]
  }
}








