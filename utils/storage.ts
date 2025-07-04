const USER_EMAIL_KEY = "user_email";

export const getStoredEmail = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(USER_EMAIL_KEY);
};

export const setStoredEmail = (email: string | null) => {
  if (typeof window === "undefined") return;
  if (email) {
    sessionStorage.setItem(USER_EMAIL_KEY, email);
  } else {
    sessionStorage.removeItem(USER_EMAIL_KEY);
  }
};