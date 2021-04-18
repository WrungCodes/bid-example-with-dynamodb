const AWS = require('aws-sdk')
// const https = require('https');

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

const dynamo = new AWS.DynamoDB();

const { Item, itemFromItem } = require('../entities/item')

const getItem = async ({ itemId }) => {
    const item = new Item({
        itemId: itemId
    })
    try {
        const param = {
            TableName: process.env.BID_TABLE_NAME,
            KeyConditionExpression: '#pk = :pk AND #sk = :sk',
            ExpressionAttributeNames: {
                "#sk": "SK",
                "#pk": "PK"
            },
            ExpressionAttributeValues: {
                ":sk": item.key().SK,
                ":pk": item.key().PK
            }
        }
            
        const response = await dynamo.query(param).promise()

        if(response.Count == 0)
        {
            let error = new Error('ItemNotFound');
            error.code = 'ItemNotFound';
            throw error;
        }

        const data = itemFromItem(response.Items[0])

        return { item: data }
    } 
    catch (error) 
    {
        errorResponse = {
            status: 500,
            message: 'an error occurred'
        }

        if(error.code == 'ItemNotFound')
        {
            errorResponse.status = 404
            errorResponse.message = 'no item found'
        }

        if(error.code == 'ConditionalCheckFailedException')
        {
            errorResponse.status = 400
            errorResponse.message = 'username already in use'
        }
        
        return { error: errorResponse }
    }
}

module.exports = { getItem }