const { createBid } = require('../../dynamoData/createBid')
const { getItemBids } = require('../../dynamoData/getItemBids')

class Bid 
{
    static async placeBid (req, res) {
        const bidResponse = await createBid({
            username: req.params.username,
            itemId: req.body.itemId,
            price: req.body.price
          })
        
          if(bidResponse.bid)
          {
            res.status(200).send( bidResponse.bid )
          }
          else
          {
            res.status(itemResponse.error.status).send({
              error: itemResponse.error.message
            })
        }
    }

    static async getBids (req, res) {
        const bidResponse = await getItemBids({itemId: req.params.itemId})

        if(bidResponse.bids)
        {
          res.status(200).send(bidResponse.bids)
        }
        else
        {
          res.status(bidResponse.error.status).send({
            error: bidResponse.error.message
          })
        }
    }
}

module.exports = Bid