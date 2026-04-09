// Owner: Sid Mallareddygari

import mongoose from "mongoose";
import Users, { IUser } from "./users";


// function to fetch password from the database for the given username
export const getPassword = async (username: string) => {
    return await Users.find({ username: username }, { password: 1, _id: 0 });
};

// function to fetch user from the database for the given username
export const getUserByUsername = async (username: string) => {
    console.log("username: ", )
    return Users.findOne({ username: username })
};


