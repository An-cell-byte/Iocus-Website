import dbLocal from "db-local";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from "./config.js";

const { Schema } = new dbLocal({path: './db'})

const User = Schema('User', {
    _id: { type: 'string', required: true },
    username: { type: 'string', required: true},
    password: { type: 'string', required: true },
})

export class UserRepository {
    static async create ({username, password}){
        //validate username and password 
        Validation.username(username)
        Validation.password(password)

        //check if user exists
        const user = User.findOne({ username }) 
        if (user) {
            throw new Error('user already exists')
        }
        const id = crypto.randomUUID()

        //hash password
        const hashedPassword = await bcrypt.hashSync(password, SALT_ROUNDS) //hashsync bloquea el thread principal

        //create user
        User.create({
            _id: id,
            username,
            password: hashedPassword
        }).save()
        
        return id
    }
    //login method
    static async login ({username, password}){
        Validation.username(username)
        Validation.password(password)

        const user = User.findOne({ username })
        if (!user) {
            throw new Error('user not found')
        }
        const isValid = await bcrypt.compare(password /*password del usuario*/, user.password/*password hasheado*/)
        if (!isValid) throw new Error('invalid password')


        const {password: _, ...publicUser} = user //para no devolver la password del objeto user

        return publicUser
    }
}

class Validation {
    //validate username 
    static username (username){
        if (typeof username !== 'string') {
            throw new Error('username must be a string')
        }
        if (username.length < 3) {
            throw new Error('username must be at least 3 characters long')
        }
    }
    //validate password
    static password (password){
        if (typeof password !== 'string') {
            throw new Error('password must be a string')
        }
        if (password.length < 6) {
            throw new Error('password must be at least 6 characters long')
        }
    }
}