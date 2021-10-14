export const getWebSockedDomain = (): string => {
  const loc = window.location;
  let wsUri = 'wss:';
  if (loc.protocol === 'http:') {
    wsUri = 'ws:';
  }
  wsUri += '//' + loc.host;
  return wsUri;
};

export const getRandomNumber = (): string => {
  const randomId = Math.random()*10000;
  return randomId.toFixed(0);
};