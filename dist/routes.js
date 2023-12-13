"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPoll = exports.VoteInPoll = exports.addPoll = exports.listPolls = exports.advanceTimeForTesting = exports.resetForTesting = void 0;
// Map from name to poll details.
var polls = new Map();
// Map from option to vote percentage
// const percentage: Map<string, number> = new Map();
/** Testing function to remove all the added polls. */
var resetForTesting = function () {
    polls.clear();
};
exports.resetForTesting = resetForTesting;
/** Testing function to move all end times forward the given amount (of ms). */
var advanceTimeForTesting = function (ms) {
    var e_1, _a;
    try {
        for (var _b = __values(polls.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var poll = _c.value;
            poll.endTime -= ms;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
exports.advanceTimeForTesting = advanceTimeForTesting;
// Sort polls with the ones finishing soonest first, but with all those that
// are completed after those that are not and in reverse order by end time.
var comparePolls = function (a, b) {
    var now = Date.now();
    var endA = now <= a.endTime ? a.endTime : 1e15 - a.endTime;
    var endB = now <= b.endTime ? b.endTime : 1e15 - b.endTime;
    return endA - endB;
};
/**
 * Returns a list of all the polls, sorted so that the ongoing polls come
 * first, with the ones about to end listed first, and the completed ones after,
 * with the ones completed more recently
 * @param _req the request
 * @param res the response
 */
var listPolls = function (_req, res) {
    var openPolls = Array.from(polls.values());
    openPolls.sort(comparePolls);
    res.send({ polls: openPolls });
};
exports.listPolls = listPolls;
/**
 * Add the item to the list.
 * @param req the request
 * @param res the response
 */
var addPoll = function (req, res) {
    var name = req.body.name;
    if (typeof name !== 'string') {
        res.status(400).send("missing 'name' parameter");
        return;
    }
    var options = req.body.optionsArray;
    if (!Array.isArray(options)) {
        res.status(400).send('options is not an array');
        return;
    }
    var minutes = req.body.minutes;
    if (typeof minutes !== "number") {
        res.status(400).send("'minutes' is not a number: ".concat(minutes));
        return;
    }
    else if (isNaN(minutes) || minutes < 1 || Math.round(minutes) !== minutes) {
        res.status(400).send("'minutes' is not a positive integer: ".concat(minutes));
        return;
    }
    // Make sure there is no poll with this name already.
    if (polls.has(name)) {
        res.status(400).send("poll for '".concat(name, "' already exists"));
        return;
    }
    var poll = {
        name: name,
        endTime: Date.now() + minutes * 60 * 1000,
        options: options
    };
    polls.set(poll.name, poll); // add this to the map of polls
    console.log(polls);
    res.send({ polls: JSON.stringify(polls) }); // send the poll we made
};
exports.addPoll = addPoll;
/**
 * Votes in a Poll
 * @param req the request
 * @param req the response
 */
var VoteInPoll = function (req, res) {
    var voter = req.body.voter;
    if (typeof voter !== 'string') {
        res.status(400).send("missing or invalid 'voter' parameter");
        return;
    }
    var name = req.body.name;
    if (typeof name !== "string") {
        res.status(400).send("missing or invalid 'name' parameter");
        return;
    }
    var poll = polls.get(name);
    if (poll === undefined) {
        res.status(400).send("no poll with name '".concat(name, "'"));
        return;
    }
    var now = Date.now();
    if (now >= poll.endTime) {
        res.status(400).send("poll for \"".concat(poll.name, "\" has already ended"));
        return;
    }
    var option = req.body.option;
    console.log(option);
    if (typeof option !== "string") {
        res.status(400).send('option is not a string');
        return;
    }
    res.send({ poll: poll }); // send back the updated poll state
};
exports.VoteInPoll = VoteInPoll;
/**
 * Retrieves the current state of a given poll.
 * @param req the request
 * @param res the response
 */
var getPoll = function (req, res) {
    var name = req.body.name;
    if (typeof name !== "string") {
        res.status(400).send("missing or invalid 'name' parameter");
        return;
    }
    var poll = polls.get(name);
    if (poll === undefined) {
        res.status(400).send("no poll with name '".concat(name, "'"));
        return;
    }
    res.send({ poll: poll }); // send back the current poll state
};
exports.getPoll = getPoll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQWdCQSxpQ0FBaUM7QUFDakMsSUFBTSxLQUFLLEdBQXNCLElBQUksR0FBRyxFQUFFLENBQUM7QUFFM0MscUNBQXFDO0FBQ3JDLHFEQUFxRDtBQUVyRCxzREFBc0Q7QUFDL0MsSUFBTSxlQUFlLEdBQUc7SUFDN0IsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUZXLFFBQUEsZUFBZSxtQkFFMUI7QUFFRiwrRUFBK0U7QUFDeEUsSUFBTSxxQkFBcUIsR0FBRyxVQUFDLEVBQVU7OztRQUM5QyxLQUFtQixJQUFBLEtBQUEsU0FBQSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUEsZ0JBQUEsNEJBQUU7WUFBOUIsSUFBTSxJQUFJLFdBQUE7WUFDYixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztTQUNwQjs7Ozs7Ozs7O0FBQ0gsQ0FBQyxDQUFDO0FBSlcsUUFBQSxxQkFBcUIseUJBSWhDO0FBR0YsNEVBQTRFO0FBQzVFLDJFQUEyRTtBQUMzRSxJQUFNLFlBQVksR0FBRyxVQUFDLENBQU8sRUFBRSxDQUFPO0lBQ3BDLElBQU0sR0FBRyxHQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQixJQUFNLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDN0QsSUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzdELE9BQU8sSUFBSSxHQUFHLElBQUks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