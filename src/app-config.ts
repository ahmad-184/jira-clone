export const appConfig: {
  mode: "comingSoon" | "maintenance" | "live";
} = {
  mode: "live",
};

export const protectedRoutes = ["/dashboard(.*)", "/callback(.*)"];
export const applicationName = "TaskHive";
export const companyName = "TaskHive";

export const MAX_UPLOAD_IMAGE_SIZE_IN_MB = 1;
export const MAX_UPLOAD_IMAGE_SIZE = 1024 * 1024 * MAX_UPLOAD_IMAGE_SIZE_IN_MB; // 1 mb

export const TOKEN_LENGTH = 32;
export const TOKEN_TTL = 1000 * 60 * 5; // 5 min
export const OTP_LENGTH = 6;
export const OTP_TTL = 1000 * 60 * 10; // 10 min
export const VERIFY_EMAIL_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
export const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2;

export const MAX_TRIGGER_LIMIT = 10;
export const MAX_TRIGGER_PRO_LIMIT = 50;

export const afterLoginUrl = "/dashboard";

export const ACCEPTED_IMAGE_FILE_TYPE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg",
];
