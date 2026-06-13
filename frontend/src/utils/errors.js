export function getErrorMessage(message, fallback) {
  const messages = {
    INVALID_CREDENTIALS: 'Incorrect username or password',
    USERNAME_AND_PASSWORD_REQUIRED: 'Enter username and password',
    LOGIN_ERROR: 'Error signing in',
  }

  return messages[message] || message || fallback
}
