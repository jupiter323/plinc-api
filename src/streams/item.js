/*
[ { eventID: '8247706c8096a3e8c8e505c141480e27',
eventName: 'INSERT',
eventVersion: '1.1',
eventSource: 'aws:dynamodb',
awsRegion: 'us-east-1',
dynamodb: [Object],
eventSourceARN:
'arn:aws:dynamodb:us-east-1:927670637293:table/Plinc.PlincAPI.Items/stream/2019-08-08T20:06:26.802' } ] }
 */

/*
{
    "ApproximateCreationDateTime": 1565300172,
    "Keys": {
        "ListId": {
            "S": "238b0daa-adc0-4abd-b51e-206313cb5f3d"
        },
        "ItemId": {
            "S": "0bba557b-fb46-46f7-8343-2733a41b23b7"
        }
    },
    "NewImage": {
        "Description": {
            "S": "my item"
        },
        "ListId": {
            "S": "238b0daa-adc0-4abd-b51e-206313cb5f3d"
        },
        "ItemId": {
            "S": "0bba557b-fb46-46f7-8343-2733a41b23b7"
        }
    },
    "SequenceNumber": "1046100000000006780142661",
    "SizeBytes": 186,
    "StreamViewType": "NEW_AND_OLD_IMAGES"
}
 */

module.exports.handler = function(event, context, callback) {
  console.log('receiving event');
  console.log(event);

  event.Records.forEach((record) => {
    console.log('dynamodb');
    console.log(JSON.stringify(record.dynamodb));
  });

  callback(null, 'done');
};
