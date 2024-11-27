import express from "express";
import MflixService from "./service/MflixService.mjs";

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
app.use(express.json());

app.post("/mflix/comments", async (req, res) => {
  const commentDB = await mflixService.addComment(req.body);
  res.status(201).end(JSON.stringify(commentDB));
});

app.put("/mflix/comments", async (req, res) => {
  //req.body {"commentId":<string>, "text":<string>}
  const textCommentDB = await mflixService.updateComment(req.body);
  res.status(200).end(JSON.stringify(textCommentDB));
});

app.delete("/mflix/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  const commentDB = await mflixService.deleteComment(commentId);
  res.status(200).end(JSON.stringify(commentDB));
});

app.get("/mflix/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  const commentDB = await mflixService.getComment(commentId);
  res.status(200).end(JSON.stringify(commentDB));
});

app.post("/mflix/movies/rated", async (req, res) => {
  // find most imdb rated movies
  // req.body {"year":<number>(optional), "genre":<string>(optional),
  //           "cast":<string>(optional), "amount":<number>(mandatory)}
  const mostRatedMovies = await mflixService.findMostRatedMovies(req.body);
  res.status(200).end(JSON.stringify(mostRatedMovies));
});
