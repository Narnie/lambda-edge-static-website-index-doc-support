'use strict';
const index = require('../src/index');
test('When there is a / at the end of request uri, append index.html to uri: uri/index.html', done => {

  const uri = "/demo/";
  const originRequest = {  "Records": [
      {
        "cf": {
          "request": {
            "uri": uri
          }
        }
      }
    ]
  };

  const expectedResponse = {"uri": `${uri}index.html`};

  function callback(dummy, response) {
    expect(response).toEqual(expectedResponse);
    done();
  }

  index.handler(originRequest, null, callback);
});

test('When there is no slash at the end of the uri and index.html exists in uri/ directory, the response should be a 302 redirect with appended /', done => {

  const uri = "/demo";
  const originRequest = {  "Records": [
      {
        "cf": {
          "request": {
            "uri": uri
          }
        }
      }
    ]
  };

  const expectedResponse = {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [{
        value: `${uri}/`,
      }],
    },
  };

  function callback(dummy, response) {
    expect(response).toEqual(expectedResponse);
    done();
  }

  function testCheckExists(bucket, key, callback) {
    callback(true);
  }

  index.handleEvent(originRequest, testCheckExists, callback);
});

test('When there is no slash at the end of the uri and index.html DOES NOT exists in uri/ directory, the response should be the original request', done => {

  const uri = "/demo";
  const originRequest = {  "Records": [
      {
        "cf": {
          "request": {
            "uri": uri
          }
        }
      }
    ]
  };

  function callback(dummy, response) {
    expect(response).toEqual(originRequest.Records[0].cf.request);
    done();
  }

  function testCheckExists(bucket, key, callback) {
    callback(false);
  }

  index.handler(originRequest, testCheckExists, callback);
});
