const AWS = require('aws-sdk')
// const https = require('https');

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

const dynamo = new AWS.DynamoDB();

const { itemFromItem } = require('../entities/item')

const getItems = async () => {
    try {
        const param = {
            TableName: process.env.BID_TABLE_NAME,
            KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :sk)',
            ExpressionAttributeNames: {
                "#sk": "SK",
                "#pk": "PK",
            },
            ExpressionAttributeValues: {
                ":sk": { S : 'ITEM#' },
                ":pk": { S : 'ITEM' },
            }
        }
            
        const response = await dynamo.query(param).promise()
        const data = response.Items.map(item => itemFromItem(item))

        return { items: data }
    } 
    catch (error) 
    {
        errorResponse = {
            status: 500,
            message: 'an error occurred'
        }

        if(error.code == 'UserNotFound')
        {
            errorResponse.status = 404
            errorResponse.message = 'no user found'
        }

        if(error.code == 'ConditionalCheckFailedException')
        {
            errorResponse.status = 400
            errorResponse.message = 'username already in use'
        }
        
        return { error: errorResponse }
    }
}

module.exports = { getItems }