import MongoConnection from "../mongo/MongoConnection.mjs";
import { ObjectId } from "mongodb";

export default class MflixService {
  #moviesCollection;
  #commentsCollection;
  #connection;
  constructor(uri, dbName, moviesCollection, commentsCollection) {
    this.#connection = new MongoConnection(uri, dbName);
    this.#moviesCollection = this.#connection.getCollection(moviesCollection);
    this.#commentsCollection = this.#connection.getCollection(commentsCollection);
  }

  shutdown() {
    this.#connection.closeConnection();
  }

  async addComment(commentDto) {
    const commentDB = this.#toComment(commentDto);
    const result = await this.#commentsCollection.insertOne(commentDB);
    commentDB._id = result.insertedId;
    return commentDB;
  }

  async updateComment(textCommentDto) {
    //req.body {"commentId":<string>, "text":<string>}
    const result = await this.#commentsCollection.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(textCommentDto.commentId) },
      { $set: { text: textCommentDto.text } },
      { returnDocument: "after" }
    );
    return result;
  }

  async deleteComment(commentId) {
    const result = await this.#commentsCollection.deleteOne({
      _id: ObjectId.createFromHexString(commentId),
    });
    if (result.deletedCount === 1) console.log("Successfully deleted one document.");
    else console.log("No documents matched the query. Deleted 0 documents.");
    return result;
  }

  async getComment(commentId) {
    const result = await this.#commentsCollection.findOne({
      _id: ObjectId.createFromHexString(commentId),
    });
    return result;
  }

  async findMostRatedMovies(filter) {
    // find most imdb rated movies
    // req.body {"year":<number>(optional), "genre":<string>(optional),
    //           "cast":<string>(optional), "amount":<number>(mandatory)}
    const matchStage = {};
    if (filter.year) matchStage.year = filter.year;
    if (filter.genre) matchStage.genres = filter.genre;
    if (filter.cast) {
      matchStage.cast = {
        $elemMatch: {
          $regex: filter.cast,
          $options: "i", // case insensitive search
        },
      };
    }
    const pipeline = [
      { $match: matchStage },
      { $match: { "imdb.rating": { $gt: 0 } } },
      { $sort: { "imdb.rating": -1 } },
      { $limit: filter.amount },
    ];
    if (Object.keys(matchStage).length === 0) pipeline.shift();
    const result = await this.#moviesCollection.aggregate(pipeline).toArray();
    return result;
  }

  #toComment(commentDto) {
    const movieId = ObjectId.createFromHexString(commentDto.movie_id);
    return { ...commentDto, movie_id: movieId };
  }
}
