const { createUser } = require('../../dynamoData/createUser')
const { getUser } = require('../../dynamoData/getUser')

class User 
{
    static async createUser (req, res) {
        const userReq = await createUser({username: req.body.username})

        if(userReq.user)
        {
          res.status(200).send(userReq.user)
        }
        else
        {
          res.status(userReq.error.status).send({
            error: userReq.error.message
          })
        }
    }

    static async getUser (req, res) {
        const userReq = await getUser({username: req.params.username})

        if(userReq.user)
        {
          res.status(200).send(userReq.user)
        }
        else
        {
          res.status(userReq.error.status).send({
            error: userReq.error.message
          })
        }
    }
}

module.exports = User