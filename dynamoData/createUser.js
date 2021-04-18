const AWS = require('aws-sdk')
// const https = require('https');

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

const dynamo = new AWS.DynamoDB();

const { User } = require('./../entities/user')

const createUser = async ({username}) => {
    const user = new User({
        username: username,
        balance: '0.50',
        itemCount: '0',
        createdAt: new Date(Date.now()).toLocaleString()
    })

    try {
        await dynamo.putItem({
            Item: user.toItem(),
            TableName: process.env.BID_TABLE_NAME,
            ConditionExpression: "attribute_not_exists(PK)"
        }).promise()

        return { user: user }
    } 
    catch (error) 
    {
        errorResponse = {
            status: 500,
            message: 'an error occurred'
        }

        if(error.code == 'ConditionalCheckFailedException')
        {
            errorResponse.status = 400
            errorResponse.message = 'username already in use'
        }
        
        return { error: errorResponse }
    }
}

module.exports = { createUser }