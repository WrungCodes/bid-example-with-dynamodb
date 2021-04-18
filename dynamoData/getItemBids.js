const AWS = require('aws-sdk')

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

const dynamo = new AWS.DynamoDB();

const { Item } = require('../entities/item')

const { bidFromItem } = require('../entities/bid')

const getItemBids = async ({ itemId }) => {

    const item = new Item({
        itemId : itemId
    })

    try {
        const param = {
            TableName: process.env.BID_TABLE_NAME,
            KeyConditionExpression: '#pk = :pk',
            ExpressionAttributeNames: {
                "#pk": "PK"
            },
            ExpressionAttributeValues: {
                ":pk": item.key().SK
            }
        }
            
        const response = await dynamo.query(param).promise()
        const data = response.Items.map(item => bidFromItem(item))

        return { bids: data }
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

module.exports = { getItemBids }