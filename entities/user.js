class User 
{
    constructor({username, balance, itemCount, createdAt})
    {
        this.username = username;
        this.balance = balance;
        this.itemCount = itemCount;
        this.createdAt = createdAt;
    }

    key() {
        return {
            'PK' : {'S' : `USER#${this.username}`},
            'SK' : {'S' : `USER#${this.username}`}
        }
    }

    toItem() {
        return {
            ...this.key(),
            'Type' : {'S' : 'User'},
            'Username' : {'S' : this.username},
            'Balance' : {'N' : this.balance},
            'ItemCount' : {'N' : this.itemCount},
            'CreatedAt' : {'S' : this.createdAt}
        }
    }
}

const userFromItem = ( item ) => {
    return {
        username: item.Username.S,
        balance: item.Balance.N,
        itemCount: item.ItemCount.N,
        createdAt: item.CreatedAt.S,
    }
}

module.exports = { User, userFromItem }