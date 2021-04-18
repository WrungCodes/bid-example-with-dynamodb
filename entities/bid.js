class Bid 
{
    constructor({username, itemId, bidId, time, price, status})
    {
        this.username = username;
        this.itemId = itemId;
        this.bidId = bidId;
        this.time = time;
        this.price = price;
        this.status = status;
    }

    key() {
        return {
            'PK' : {'S' : `ITEM#${this.itemId}`},
            'SK' : {'S' : `ITEM#${this.itemId}#BID#${this.bidId}`}
        }
    }

    toItem() {
        return {
            ...this.key(),
            'Type' : {'S' : 'Bid'},
            'Username' : {'S' : this.username},
            'ItemId' : {'S' : this.itemId},
            'BidId' : {'S' : this.bidId},
            'Time' : {'S' : this.time},
            'Price' : {'N' : this.price},
            'Status' : {'S' : this.status}
        }
    }
}

const bidFromItem = ( item ) => {
    return {
        id: item.BidId.S,
        itemId: item.ItemId.S,
        username: item.Username.N,
        price: item.Price.N,
        time: item.Time.S,
        status: item.Status.S
    }
}

module.exports = { Bid, bidFromItem }