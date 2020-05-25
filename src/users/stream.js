const Lists = require('../lists/lists');
const DownVotes = require('../downVotes/downVotes');

const lists = new Lists(process.env.LISTS_TABLE_NAME);
const downVotes = new DownVotes(process.env.DOWNVOTES_TABLE_NAME);

module.exports.handler = (event, context, callback) => {
  try {
    event.Records.forEach(async (record) => {
      if (record.eventName === 'REMOVE' && record.eventSource === 'aws:dynamodb') {
        const possessor = record.dynamodb.OldImage.Possessor.S;
        const listsToDelete = await lists.getAll({ possessor });
        const downVotesToDelete = await downVotes.getAll({ possessor });

        listsToDelete.forEach(async (list) => {
          const { listId } = list;
          await lists.delete({ possessor, id: listId });
        });

        downVotesToDelete.forEach(async (downVote) => {
          const { downVoteId } = downVote;
          await downVotes.delete({ possessor, id: downVoteId });
        });
      }
    });
    callback(null, 'done');
  } catch (err) {
    callback(err, 'done');
  }
};
