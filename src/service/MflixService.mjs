import { getError, notFoundError } from "../errors/error.mjs";
import MongoConnection from "../mongo/MongoConnection.mjs";
import { ObjectId } from "mongodb";

export default class MflixService {
    #moviesCollection;
    #commentsCollection;
    #connection;
    constructor(uri, dbName, moviesCollection, commentsCollection) {
        this.#connection = new MongoConnection(uri, dbName);
        this.#moviesCollection =
            this.#connection.getCollection(moviesCollection);
        this.#commentsCollection =
            this.#connection.getCollection(commentsCollection);
    }

    shutdown() {
        this.#connection.closeConnection();
    }

    async addComment(commentDto) {
        const movieId = ObjectId.createFromHexString(commentDto.movie_id);
        const movie = await this.#moviesCollection.findOne({ _id: movieId });
        if (!movie) {
            throw notFoundError("Movie not found");
        }
        const commentDB = { ...commentDto, movie_id: movieId }
        const result = await this.#commentsCollection.insertOne(commentDB);
        commentDB._id = result.insertedId;
        return commentDB;
    }

    async updateCommentText({ text, commentId }) {
        const commentUpdated = await this.#commentsCollection.findOneAndUpdate(
            { _id: ObjectId.createFromHexString(commentId) },
            { $set: { text } },
            { returnNewDocument: true }
        );
        if (!commentUpdated) {
            throw notFoundError("Comment not found");
        }
        return commentUpdated;
    }
    async deleteComment(id) {
        const toDeleteComment = await this.getComment(id);
        if (!toDeleteComment) {
            throw notFoundError("Comment not found");
        }
        await this.#commentsCollection.deleteOne({ _id: toDeleteComment._id });
        return toDeleteComment;
    }
    async getComment(id) {
        const mongoId = ObjectId.createFromHexString(id);
        const comment = await this.#commentsCollection.findOne({_id: mongoId});
        if (!comment) {
            throw notFoundError("Comment not found");
        }
        return comment;
    }
    async getMostRatedMovies({ genre, actor, year, amount }) {
        const filter = {
            ...(year && { year }),
            ...(actor && { cast: { $regex: actor } }),
            ...(genre && { genres: genre }),
            "imdb.rating": { $ne: "" },
        };
        const result = await this.#moviesCollection
            .find(filter)
            .sort({ "imdb.rating": -1 })
            .limit(amount)
            .toArray();
        return result;
    }

}
