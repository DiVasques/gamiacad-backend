import { User } from "@/models/User";
import { BaseRepository } from "@/repository/base/BaseRepository";
import { IUserRepository } from "@/repository/user/IUserRepository";
import mongoose, { Document, Schema } from "mongoose";
import { Service } from "typedi";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
    constructor() {
        super(mongoose.model<User & Document>('User', new Schema<User>(), 'User'))
    }
}