const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')
const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, arg, ctx, info){
        //check if there is a current user id 
        if(!ctx.request.userId){
            return null
        }
        return ctx.db.query.user({
            where:{id: ctx.request.userId}, 
        },
        info
        )
    },
    async users(parent, args, ctx, info){
        //check if they are logged in 
        if(!ctx.request.userId){
            throw new Error('You must be logged in')
        }
        //check if the user has permissions to query the users
        hasPermission(ctx.request.user, [ 'ADMIN', 'PERMISSIONUPDATE' ])
        //if they do then query all the users
        return ctx.db.query.users({}, info)
    },
}

module.exports = Query;
