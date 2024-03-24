import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true
        },
        description: {
            type: String, 
            required: true
        },
        duration: {
            type: Number, 
            required: true,
            default: 0,
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    }, 
    {
        timestamps: true
    }
)
videoSchema.plugin(mongooseAggregatePaginate)
//In web development, especially in applications dealing with large datasets, displaying all results on a single page is impractical and can lead to performance issues. Pagination is a technique used to divide large sets of data into smaller, more manageable chunks or pages. Users can then navigate through these pages to view data without overwhelming the system or experiencing significant load times.

//However, Mongoose's default aggregation framework does not support pagination out of the box. The mongoose-aggregate-paginate-v2 plugin adds this functionality, allowing developers to easily implement server-side pagination on data retrieved through complex aggregation pipelines.

export const Video = mongoose.model("Video", videoSchema)