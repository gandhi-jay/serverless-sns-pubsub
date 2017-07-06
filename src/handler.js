'use strict';

let AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.access_key,
  secretAccessKey: process.env.secret_key,
  region: process.env.aws_region
});

// Method which Publishes to SNS Topic.
module.exports.publish = (event, context, callback) => {

  console.log("HTTP END POINT Called.");

  // Initialzing response object
  const response = {
    statusCode: 200,
    body: ""
  };

  let eventText = JSON.stringify(event, null, 2);

  let sns = new AWS.SNS();
  let params = {
    Message: eventText,
    Subject: "Test SNS From Lambda",
    TopicArn: `arn:aws:sns:${process.env.region}:${process.env.aws_account}:${process.env.sns_topic}`
  };

  console.log(`Publishing to TOPIC ${process.env.sns_topic}`);
  sns.publish(params, (err,data) => {
    if(err) {
      console.log(`Failed : ${err}`)
      response.statusCode = 500
      response.body = JSON.stringify({
        message : err,
        status : "Aborted",
        input: event
      })
      callback(null,response)
    }
    console.log(`OK : ${data}`)
    response.body = JSON.stringify({
      message : data,
      status : "OK"
    })
    callback(null, response);
  });
};

// Method which is bind to SNS Topic. Check serverless.yml file.
module.exports.subscribe = (event, context, callback) => {
  console.log(`Fetching data from SNS Topic`);
  console.log(event.Records[0]['Sns']);
  console.log(`It's done.`);
}
