import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true , unique: true},
});

const User = mongoose.model("Publisher", userSchema);

export default User;