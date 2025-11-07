const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function isEmailValid(email: string) {
    return EMAIL_RE.test(email.trim());
};

export default isEmailValid;