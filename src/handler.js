'use strict';

let AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.access_key,
  secretAccessKey: process.env.secret_key,
  region: process.env.aws_region
});

// Method which Publishes to SNS Topic.
module.exports.publish = (event, context, callback) => {
  let eventText = JSON.stringify(event, null, 2);
  console.log("Received event:", eventText);
  let sns = new AWS.SNS();
  let params = {
    Message: eventText,
    Subject: "Test SNS From Lambda",
    TopicArn: `arn:aws:sns:${process.env.region}:${process.env.aws_account}:${process.env.sns_topic}`
  };
  sns.publish(params, (err,data) => {
    if(err) callback(null, err)
    callback(null, data);
  });
};

// Method which is bind to SNS Topic. Check serverless.yml file.
module.exports.subscribe = (event, context, callback) => {
  console.log(`Fetching data from SNS Topic`);
  console.log(event);
  console.log(`It's done.`);
}
