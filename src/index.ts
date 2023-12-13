import express, { Express } from "express";
import { listPolls, addPoll, VoteInPoll, getPoll } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/list", listPolls);
app.post("/api/add", addPoll);
app.post("/api/vote", VoteInPoll);
app.post("/api/get", getPoll);
app.listen(port, () => console.log(`Server listening on ${port}`));
