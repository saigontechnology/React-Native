/**
 * Created by NL on 07/06/2022.
 */
const timeout = (request, duration) => {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      resolve({});
    }, duration);

    request.then(
      res => {
        clearTimeout(timeout);
        timeout = null;
        resolve(res);
      },
      err => {
        clearTimeout(timeout);
        timeout = null;
        resolve({});
      },
    );
  });
};
export const getWithTimeout = (api, headers) => {
  return timeout(get(api, headers), 60000);
};

export const get = (api, headers) => {
  return fetch(api, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      ...headers,
    },
  })
    .then(response => {
      return response.json().then(data => {
        return data;
      });
    })
    .catch(err => {
      return {data: null};
    });
};
