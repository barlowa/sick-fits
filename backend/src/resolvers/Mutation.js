const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {randomBytes} = require('crypto')
const {promisify} = require('util')
const { transport, makeANiceEmail } = require('../mail')

const Mutations = {
    async createItem(parent, args, ctx, info){   
        //check if they are logged in

        const item = await ctx.db.mutation.createItem({
            data:{
                ...args
            }
        }, info);
        
        return item
    }, 
    updateItem(parent, args, ctx, info){
        //take a copy of the updates
        const updates = {...args}
        //remove the id from the updates
        delete updates.id
        //run the update method 
        return ctx.db.mutation.updateItem({
            data: updates,
            where:{
                id: args.id,
            }
        }, 
        info
        )
    }, 
    async deleteItem(parent, args, ctx, info){
        const where = {id: args.id}
        //find the item
        const item = await ctx.db.query.item({ where },`{ id title }`)
        //check if they own the item/have permissions
        //TODO
        //then delete the item 
        return ctx.db.mutation.deleteItem({ where },info)
    },
    async signup(parent, args, ctx, info){
        //lowercase the email 
        args.email = args.email.toLowerCase()
        //hash their password 
        const password = await bcrypt.hash(args.password, 10)
        //create the user in the database
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions:{ 
                    set: ['USER'] 
                },
            },
        }, info)
    //create the JWT Token for them
    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
    //set a JWT as a cookie on the response
    ctx.response.cookie('token', token,{
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
    });
    //finally return the user to the browser 
    return user 
    },
    async signin(parent, {email, password}, ctx, info){
        //check if there is a user with that email
        const user = await ctx.db.query.user({where:{ email: email }})
        if(!user){
            throw new Error (`No such user found for email ${email}`)
        }
        //check if their password is correct
        const valid = await bcrypt.compare(password, user.password)
        if(!valid){
            throw new Error('Invalid password')
        }
        //generatae the jwt token 
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET)
        //set the cookie with the token 
        ctx.response.cookie('token', token,{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, //1 year
        });
        //return the user object
        return user 
    },
    signout(parent, args, ctx, info){
        ctx.response.clearCookie('token')
        return{message: 'Goodbye!'}
    },
    async requestReset(parent, args, ctx, info){
        //check if this is a real user 
        const user = await ctx.db.query.user({where:{email:args.email}})
        if(!user){
            throw new Error (`No such user found for email ${args.email}`)
        }
        //set reset token and expiry 
        const randomBytesPromisified = promisify(randomBytes)
        const resetToken = (await randomBytesPromisified(20)).toString('hex')
        const resetTokenExpiry = Date.now() + 3600000//1 hour from now
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: { resetToken,  resetTokenExpiry}
        })
        //email a reset token to the user
        const mailRes = await transport.sendMail({
            from:'alex@sickfits.com',
            to:user.email,
            subject: 'SickFits Password Reset Token',
            html: makeANiceEmail(`
                Your Password Reset Token is here! 
                \n\n
                <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
                Click Here to Reset Your Password
                </a>
            `)
        })
        //return the message
        return {message: 'thanks'}
    },
    async resetPassword(parent, args, ctx, info){
        //check if the passwords match
        if (args.password !== args.confirmPassword){
            throw new Error ("Your passwords don't match")
        }
        //check if the token is real
        //check if it has expired
        const [user] = await ctx.db.query.users({
            where:{ 
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000,
            },
        })
        if(!user){
            throw new Error('This token is either invalid or expired')
        }
        //hash their new password
        const password = await bcrypt.hash(args.password, 10)
        //save the new password to the user andremove old reset token fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {email: user.email},
            data:{
                password,
                resetToken: null, 
                resetTokenExpiry:null,
            }
        })
        //generate jwt
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
        //set the jwt cookie
        ctx.response.cookie('token', token,{
            httpOnly:true,
            maxAge: 1000 * 60 * 60 *24 * 365
        })
        //return the new user
        return updatedUser
    }
};

module.exports = Mutations;
