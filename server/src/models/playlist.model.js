import mongoose, {Schema} from "mongoose";

const playListSchema = new Schema(
    {
        name: {         //playlist name
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        owner: {     //owner of the playlist
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

export const Playlist = mongoose.model("Playlist", playListSchema);