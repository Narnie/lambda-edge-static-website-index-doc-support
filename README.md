# static-webinator
This repo deploys the infrastructure to create a static website which is whitelisted to the office's IP addresses. It will deploy the following resources: 

- A private S3 Bucket for your static website content
- A cloudfront distribution 
- Lambda@edge function
- A Bucket Policy to allow cloudfront to access the S3 bucket
- An ACM certificate for your custom domain 


## Deployment 

If you do not have a bucket for your Lambda code you will need to create one. Create the bucket for the lambda code in the same aws account where your static bucket will go, for example:


`aws s3api create-bucket --bucket webinator-lambda-bucket-1234 --profile YOUR-AWS_PROFILE_NAME --region us-east-1`

#### Deploy the stack 

Set Environment variables for the following, 

```LAMBDA_BUCKET_NAME BUCKET_NAME DOMAIN_NAME AWS_USER_NAME```

*NOTE:* your s3 bucket names must be unique in the whole world - adding some numbers to the end is an easy way to make sure it is unique 

For Example:

```export LAMBDA_BUCKET_NAME=webinator-lambda-bucket-1234 BUCKET_NAME=static-site-content-bucket-1234 DOMAIN_NAME=my-domain-name.com AWS_USER_NAME=my-user-name```

Deploy your code with the deploy script in the `auto` directory 

```./auto/deploy-stack```

This deploys to `Your AWS account` and creates a bucket called `BUCKET_NAME` where the static site content of your site can be uploade and stored. 

### Custom Domain Name Validation!

You will need to create a CNAME entry to validate the *ACM certificate* as it requires DNS validation (check the cloudformation stack update logs in the AWS console for your stack). You will see an entry in your cloudformtation events tab. 

![alt text](https://git.realestate.com.au/sarah-bernard/static-webinator/blob/master/Screen%20Shot%202019-01-23%20at%2010.43.34%20am.png)

You need to add this CNAME entry to your Domain Name System (DNS) web service under the domain name you are using.

*After the stack* is deployed you need to add an entry to your custom domain name to the Domain Name System (DNS) web service that points to the cloudfront distribution. 

### Testing

```yarn test```
