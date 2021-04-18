const AWS = require('aws-sdk')
// const https = require('https');

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

const dynamo = new AWS.DynamoDB();

const { User, userFromItem } = require('../entities/user')
const { userItemFromItem } = require('../entities/item')

const getUser = async ({username}) => {
    const user = new User({
        username: username
    })

    try {
        const param = {
            TableName: process.env.BID_TABLE_NAME,
            KeyConditionExpression: '#pk = :pk',
            ExpressionAttributeNames: {
                "#pk": "PK"
            },
            ExpressionAttributeValues: {
                ":pk": user.key().PK
            }
        }
            
        const response = await dynamo.query(param).promise()

        if(response.Count == 0)
        {
            let error = new Error('UserNotFound');
            error.code = 'UserNotFound';
            throw error;
        }

        data = {}
        data.user = userFromItem(response.Items.shift())
        data.items = response.Items.map(item => userItemFromItem(item))

        return { user: data }
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

module.exports = { getUser }