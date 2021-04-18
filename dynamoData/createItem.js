const AWS = require('aws-sdk')
const crypto = require('crypto');
const KSUID = require('ksuid');

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

const dynamo = new AWS.DynamoDB();

const { Item, UserItem } = require('../entities/item')
const { User } = require('../entities/user')

const generateItemId = ( currentDate ) => {
    const payload = crypto.randomBytes(16)
    return KSUID.fromParts(currentDate.getTime(), payload).string
}

const createItem = async ({username, itemName, minutes, startPrice}) => {
    const user = new User({
        username: username
    })

    currentDate = new Date(Date.now())
    endDate = new Date()
    endDate.setTime(currentDate.getTime() + (minutes * 60 * 1000))

    itemId = generateItemId(currentDate).toString()

    const item = new Item({
        username: username,
        itemId: itemId,
        itemName: itemName,
        startTime: currentDate.toLocaleString(),
        endTime: endDate.toLocaleString(),
        startPrice: startPrice,
        status: 'pending',
    })

    const userItem = new UserItem({
        username: username,
        itemId: itemId,
        itemName: itemName,
        status: 'pending'
    })

    try {
        params = {
            TransactItems: [
                {
                    Update: {
                        'TableName': process.env.BID_TABLE_NAME,
                        'Key': user.key(),
                        'ConditionExpression': 'attribute_exists(PK)',
                        'ExpressionAttributeValues': { ":inc": { N: "1" } },
                        'UpdateExpression': "ADD itemCount :inc"
                    }
                },
                {
                    Put: {
                        'TableName': process.env.BID_TABLE_NAME,
                        'Item': item.toItem(),
                        'ConditionExpression': 'attribute_not_exists(PK)'
                    }
                },
                {
                    Put: {
                        'TableName': process.env.BID_TABLE_NAME,
                        'Item': userItem.toItem(),
                        'ConditionExpression': 'attribute_not_exists(PK)'
                    }
                }
            ]
        }

        const transactionRequest = dynamo.transactWriteItems(params)

        transactionRequest.on('extractError', (response) => {
            if (response.error) {
                const cancellationReasons = JSON.parse(response.httpResponse.body.toString()).CancellationReasons;

                let error = new Error('SomeConditionsfailed');
                error.code = 'SomeConditionsfailed';
                error.cancellationReasons = cancellationReasons;
                throw error;
            }
          });

        await transactionRequest.promise()

        return { item: item }
    } 
    catch (error) 
    {
        errorResponse = {
            status: 500,
            message: 'an error occurred'
        }

        if(error.code === 'SomeConditionsfailed')
        {
            if(error.cancellationReasons[0].Code == 'ConditionalCheckFailed')
            {
                errorResponse.status = 400
                errorResponse.message = 'invalid username'
            }

            if(error.cancellationReasons[1].Code == 'ConditionalCheckFailed' || error.cancellationReasons[2].Code == 'ConditionalCheckFailed')
            {
                errorResponse.status = 400
                errorResponse.message = 'duplicate items'
            }
        }
        
        return { error: errorResponse }
    }
}

module.exports = { createItem }