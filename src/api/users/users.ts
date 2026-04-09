import mongoose from 'mongoose';

// Owner: Sid Mallareddygari

// defines the schema for the user

export interface IUser extends Document {
    name: string;
    username: string;
    password: string;
}

// defining the schema for the user
const userSchema = new mongoose.Schema({
    // name of the user
    name: {
        type: String,
        required: true,
        unique: true
    },
    // username of the user
    username: {
        type: String,
        required: true,
        unique: true
    },
    // password of the user
    password: {
        type: String,
        required: true
    }
});

const Users = mongoose.model("Users", userSchema, "Users");

export default Users;
