import express from "express";
import MflixService from "./service/MflixService.mjs";
import asyncHandler from "express-async-handler";
import { validationMiddleware, valid } from "./middleware/validation.mjs";

const app = express();
const port = process.env.PORT || 3500;
const mflixService = new MflixService(
    process.env.MONGO_URI,
    process.env.DB_NAME,
    process.env.MOVIES_COLLECTION,
    process.env.COMMENTS_COLLECTION
);
const server = app.listen(port);
server.on("listening", () =>
    console.log(`server is listening on port ${server.address().port}`)
);
app.use(express.json()); //middleware json
app.use(validationMiddleware); //custom middleware
app.use(valid);

function errorHandler(error, req, res, next) {
    const status = error.code || 500;
    const text = error.text || "Unknown server error " + error;
    res.status(status).end(text);
}

app.post(
    "/mflix/comments",
    asyncHandler(async (req, res) => {
        const commentDB = await mflixService.addComment(req.body);
        res.status(201).end(JSON.stringify(commentDB));
    })
);

app.put(
    "/mflix/comments",
    asyncHandler(async (req, res) => {
        //update comment
        //req.body {"commentId":<string>, "text":<string>}
        const commentUpdated = await mflixService.updateCommentText(req.body);
        res.status(200).end(JSON.stringify(commentUpdated));
    })
);

app.delete(
    "/mflix/comments/:id",
    asyncHandler(async (req, res) => {
        // delete comment
        // req.params.id - comment to delete
        const deletedComment = await mflixService.deleteComment(req.params.id);
        res.status(200).end(JSON.stringify(deletedComment));
    })
);

app.get(
    "/mflix/comments/:id",
    asyncHandler(async (req, res) => {
        //get comment
        // req.params.id - comment to get
        const comment = await mflixService.getComment(req.params.id);
        res.status(200).end(JSON.stringify(comment));
    })
);

app.post(
    "/mflix/movies/rated",
    asyncHandler(async (req, res) => {
        //find most imdb rated movies
        // req.body {"year":<number>(optional), "genre":<string>(optional),
        // "acter":<string-regex>(optional), "amount":<number>(mandatary)}
        const movies = await mflixService.getMostRatedMovies(req.body);
        res.status(200).end(JSON.stringify(movies));
    })
);

app.use(errorHandler);
