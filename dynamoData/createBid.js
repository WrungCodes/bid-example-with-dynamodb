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

const { Bid } = require('../entities/bid')

const generateItemId = ( currentDate ) => {
    const payload = crypto.randomBytes(16)
    return KSUID.fromParts(currentDate.getTime(), payload).string
}

const createBid = async ({username, itemId, price}) => {

    currentDate = new Date(Date.now())
    bidId = generateItemId(currentDate).toString()

    const bid = new Bid({
        username: username,
        itemId: itemId,
        bidId: bidId,
        time: currentDate.toLocaleString(),
        price: price,
        status: 'pending',
    })

    try {
        params = {
            TransactItems: [
                {
                    Put: {
                        'TableName': process.env.BID_TABLE_NAME,
                        'Item': bid.toItem()
                        // 'ConditionExpression': 'attribute_not_exists(PK)'
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

        return { bid: bid }
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

module.exports = { createBid }