const AWS = require('aws-sdk')

AWS.config.update({
    region: 'eu-west-1',
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
    endpoint: new AWS.Endpoint(process.env.AWS_ENDPOINT)
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : process.env.BID_TABLE_NAME,
    KeySchema: [       
        { AttributeName: "PK", KeyType: "HASH" },
        { AttributeName: "SK", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [       
        { AttributeName: "PK", AttributeType: "S" },
        { AttributeName: "SK", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});