class Item 
{
    constructor({username, itemId, itemName, startTime, endTime, startPrice, status})
    {
        this.username = username;
        this.itemId = itemId;
        this.itemName = itemName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startPrice = startPrice;
        this.status = status;
    }

    key() {
        return {
            'PK' : {'S' : `ITEM`},
            'SK' : {'S' : `ITEM#${this.itemId}`}
        }
    }

    toItem() {
        return {
            ...this.key(),
            'Type' : {'S' : 'Item'},
            'Username' : {'S' : this.username},
            'ItemId' : {'S' : this.itemId},
            'ItemName' : {'S' : this.itemName},
            'StartPrice' : {'N' : this.startPrice},
            'StartTime' : {'S' : this.startTime},
            'EndTime' : {'S' : this.endTime},
            'Status' : {'S' : this.status}
        }
    }
}

const itemFromItem = ( item ) => {
    return {
        id: item.ItemId.S,
        name: item.ItemName.S,
        price: item.StartPrice.N,
        start: item.StartTime.S,
        end: item.EndTime.S,
        status: item.Status.S
    }
}

class UserItem 
{
    constructor({username, itemId, itemName, status})
    {
        this.username = username;
        this.itemId = itemId;
        this.itemName = itemName;
        this.status = status;
    }

    key() {
        return {
            'PK' : {'S' : `USER#${this.username}`},
            'SK' : {'S' : `USER#${this.username}#ITEM#${this.itemId}`}
        }
    }

    toItem() {
        return {
            ...this.key(),
            'Type' : {'S' : 'UserItem'},
            'Username' : {'S' : this.username},
            'ItemId' : {'S' : this.itemId},
            'ItemName' : {'S' : this.itemName},
            'Status' : {'S' : this.status}
        }
    }
}

const userItemFromItem = ( item ) => {
    return {
        id: item.ItemId.S,
        name: item.ItemName.S,
        status: item.Status.S
    }
}

module.exports = { Item, UserItem, userItemFromItem, itemFromItem }