/**
 * Constants and static data for SignIn feature
 * Login uses email + password
 */


export const INITIAL_FORM_STATE = {
    email: "",
    password: "",
    keepLoggedIn: false,
};

export const FORM_CONFIG = {
    emailPlaceholder: "email@example.com",
    passwordPlaceholder: "Min. 8 characters",
    minPasswordLength: 8,
} as const;

export const MESSAGES = {
    invalidCredentials: {
        title: "Invalid credentials",
        description: "Please check your email and password",
    },
    userLocked: {
        title: "Account locked",
        description: "Your account is locked. Please contact support.",
    },
    roleMissing: {
        title: "No role assigned",
        description: "Your account has no role assigned. Please contact support.",
    },
    googleSignIn: {
        title: "Google Sign-In",
        description: "Google authentication is not configured in demo mode",
    },
} as const;
