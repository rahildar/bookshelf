// 💰 in the final version, I destructure the customConfig like this:
//   {data, token, headers: customHeaders, ...customConfig}
function client(endpoint, customConfig = {}) {
  const config = {
    // 🐨 if we were passed data, then let's default the method to 'POST' instead of a 'GET'
    method: 'GET',
    // 🐨 if we were passed data, then set the body to JSON.stringify(data), otherwise it should be undefined
    // 🐨 create a headers property
    //   🐨 the "Authorization" header should be `Bearer ${token}` if there's a token (otherwise it should be undefined)
    //   🐨 the "Content-Type" header should be 'application/json' if there's data (otherwise it should be undefined)
    //   🐨 spread the rest of the headers we were passed
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async response => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export {client}
