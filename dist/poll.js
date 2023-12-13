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
exports.parsePoll = void 0;
var record_1 = require("./record");
/**
 * Parses unknown data into a Poll. Will log an error and return undefined
 * if it is not a valid Poll.
 * @param val unknown data to parse into an Poll
 * @return Poll if val is a valid Poll and undefined otherwise
 *
 */
var parsePoll = function (val) {
    var e_1, _a;
    if (!(0, record_1.isRecord)(val)) {
        console.error("not a poll", val);
        return undefined;
    }
    if (typeof val.name !== "string") {
        console.error("not a poll: missing 'name'", val);
        return undefined;
    }
    if (typeof val.endTime !== "number") {
        console.error("not a poll: missing 'endTime'", val);
        return undefined;
    }
    if (val.endTime < 0) {
        console.error("not a valid time value", val);
        return undefined;
    }
    if (!Array.isArray(val.options)) {
        console.error("not a poll: missing 'options'", val);
        return undefined;
    }
    try {
        // go through each value in options and make sure each thing is a string
        for (var _b = __values(val.options), _c = _b.next(); !_c.done; _c = _b.next()) {
            var option = _c.value;
            if (typeof option !== "string") {
                console.error("not a string", val);
                return undefined;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return {
        name: val.name, endTime: val.endTime, options: val.options
    };
};
exports.parsePoll = parsePoll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9sbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wb2xsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUNBQW9DO0FBVXBDOzs7Ozs7R0FNRztBQUNJLElBQU0sU0FBUyxHQUFHLFVBQUMsR0FBWTs7SUFDcEMsSUFBSSxDQUFDLElBQUEsaUJBQVEsRUFBQyxHQUFHLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNoQyxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVELElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQ2hELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsSUFBSSxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUssUUFBUSxFQUFFO1FBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDbkQsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxJQUFJLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxFQUFFO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDNUMsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUNuRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjs7UUFFRCx3RUFBd0U7UUFDeEUsS0FBcUIsSUFBQSxLQUFBLFNBQUEsR0FBRyxDQUFDLE9BQU8sQ0FBQSxnQkFBQSw0QkFBRTtZQUE3QixJQUFNLE1BQU0sV0FBQTtZQUNmLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO2dCQUM1QixPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQTtnQkFDbEMsT0FBTyxTQUFTLENBQUM7YUFDcEI7U0FDRjs7Ozs7Ozs7O0lBRUQsT0FBTztRQUNMLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTztLQUMzRCxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBckNXLFFBQUEsU0FBUyxhQXFDcEIifQ==