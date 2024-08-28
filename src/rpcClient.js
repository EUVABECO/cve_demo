export const sendRpcRequest = async (method, params) => {
  const serverAddress = 'https://signer.staging.mesvaccins.pro/jsonrpc';
  const rpcRequest = {
      jsonrpc: "2.0",
      id: 1,
      method: method,
      params
  };

  const response = await fetch(serverAddress, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(rpcRequest)
  })
  return response.json();
}