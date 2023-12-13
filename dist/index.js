"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var routes_1 = require("./routes");
var body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
var port = 8088;
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get("/api/list", routes_1.listPolls);
app.post("/api/add", routes_1.addPoll);
app.post("/api/vote", routes_1.VoteInPoll);
app.post("/api/get", routes_1.getPoll);
app.listen(port, function () { return console.log("Server listening on ".concat(port)); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBMkM7QUFDM0MsbUNBQW1FO0FBQ25FLDREQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsSUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDO0FBQzFCLElBQU0sR0FBRyxHQUFZLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLGtCQUFTLENBQUMsQ0FBQztBQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxnQkFBTyxDQUFDLENBQUM7QUFDOUIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsbUJBQVUsQ0FBQyxDQUFDO0FBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGdCQUFPLENBQUMsQ0FBQztBQUM5QixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBdUIsSUFBSSxDQUFFLENBQUMsRUFBMUMsQ0FBMEMsQ0FBQyxDQUFDIn0=