export function getUserIdFromToken(token: string) {
  const tokenParts = token.split(".");
  const payload = tokenParts[1];

  const decodedPayload = JSON.parse(window.atob(payload));

  return decodedPayload["TobitUserID"] as number;
}
