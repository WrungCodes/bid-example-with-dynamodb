const { createItem } = require('../../dynamoData/createItem')
const { getItems } = require('../../dynamoData/getItems')
const { getItem } = require('../../dynamoData/getItem')

class Item 
{
    static async createItem (req, res) {
        const itemResponse = await createItem({
            username: req.params.username,
            itemName: req.body.name,
            minutes: req.body.duration,
            startPrice: req.body.price
          })
        
          if(itemResponse.item)
          {
            res.status(200).send( itemResponse.item )
          }
          else
          {
            res.status(itemResponse.error.status).send({
              error: itemResponse.error.message
            })
          }
    }

    static async getItem (req, res) {
        const itemsResponse = await getItem({itemId: req.params.itemId})

        if(itemsResponse.item)
        {
          res.status(200).send(itemsResponse.item)
        }
        else
        {
          res.status(itemsResponse.error.status).send({
            error: itemsResponse.error.message
          })
        }
    }

    static async getItems (req, res) {
        const itemsResponse = await getItems()

        if(itemsResponse.items)
        {
          res.status(200).send(itemsResponse.items)
        }
        else
        {
          res.status(itemsResponse.error.status).send({
            error: itemsResponse.error.message
          })
        }
    }
}

module.exports = Item