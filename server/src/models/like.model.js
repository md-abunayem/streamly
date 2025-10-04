import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        comment: {      //comment like
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        video: {        //video like
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy: {      //who(user) liked
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        tweet: {        //tweet like
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    }
    ,{timestamps:true}
)

export const Like = mongoose.model("Like", likeSchema )