'use strict';
const AWS = require('aws-sdk');
const bucketName = require('./params').params.privateBucket;

function checkExistsImpl(bucket, key, callback) {
  const s3 = new AWS.S3();
  var params = {
    Bucket: bucket,
    Key: key
  };
  console.log(`S3 Request: Key: ${params.Key} Bucket: ${params.Bucket}`);
  s3.headObject(params, function(err) {
    if (err) {
      console.log(`S3 HeadObject request error: ${err}`);
      callback(false);
    } else {
      callback(true);
    }
  });
}

exports.handler = (event, context, callback) => {
  exports.handleEvent(event, checkExistsImpl, callback);
};

exports.handleEvent = (event, checkExists, callback) => {
  // Extract the request from the CloudFront event that is sent to Lambda@Edge
  let request = event.Records[0].cf.request;

  // Extract the URI from the request
  let olduri = request.uri;
  console.log(`Original URI: ${olduri}`);

  //If $url ends with `/` rewrite the request to get $url/index.html
  if (request.uri.endsWith('/')) {
    request.uri = `${olduri}index.html`;
    console.log(`Ends with /, rewrite to ${request.uri}`);
    return callback(null, request);
  }
  else {
    let uri = olduri.substring(1, olduri.length);
    checkExists(bucketName, `${uri}/index.html`, (exists) => {
        if (exists) {
          const response = {
            status: '302',
            statusDescription: 'Found',
            headers: {
              location: [{
                value: `${olduri}/`,
              }],
            },
          };
          console.log(`${uri}/index.html exists, 302 redirect with appended / to url: ${response.headers.location[0].value}`);
          callback(null, response);
        } else {
          console.log(`${uri}/index.html DOES NOT exists, pass through request unaltered: ${request.uri}`);
          return callback(null, request);
        }
    });
  }
};
