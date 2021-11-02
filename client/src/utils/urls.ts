export const getWebSockedDomain = (production: string, port: string): string => {
  const loc = window.location;
  let wsUri = 'ws:';
  // if (production) {
  //   wsUri = 'wss:';
  // }
  if (loc.protocol === 'https:') {
    wsUri = 'wss:';
  }
  wsUri += '//' + loc.hostname;
  if (port) {
    wsUri += `:${port}`;
  }
  return wsUri;
};

export const getRandomNumber = (): string => {
  const randomId = Math.random()*10000;
  return randomId.toFixed(0);
};

export const uuidv4 = function() {
  return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, (c:string) => {
    const cInt = Number(c);
    return (cInt ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> cInt / 4).toString(16);
  });
};
