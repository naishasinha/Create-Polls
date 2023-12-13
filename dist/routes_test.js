"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var httpMocks = __importStar(require("node-mocks-http"));
var routes_1 = require("./routes");
describe('routes', function () {
    it('add', function () {
        // Separate domain for each branch:
        // 1. Missing name
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/add', body: {} });
        var res1 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), "missing 'name' parameter");
        // 2. Missing options
        var req2 = httpMocks.createRequest({ method: 'POST', url: '/api/add', body: { name: "couch" } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), "options is not an array");
        // 3. Missing minutes
        var req7 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "dinner", optionsArray: ["steak", "chicken"] } });
        var res7 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req7, res7);
        assert.strictEqual(res7._getStatusCode(), 400);
        assert.deepStrictEqual(res7._getData(), "'minutes' is not a number: undefined");
        // 4. Invalid minutes
        var req8 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "dinner", optionsArray: ["steak", "chicken"], minutes: "hi" } });
        var res8 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req8, res8);
        assert.strictEqual(res8._getStatusCode(), 400);
        assert.deepStrictEqual(res8._getData(), "'minutes' is not a number: hi");
        var req9 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "couch", optionsArray: ["steak", "chicken"], minutes: 3.5 } });
        var res9 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req9, res9);
        assert.strictEqual(res9._getStatusCode(), 400);
        assert.deepStrictEqual(res9._getData(), "'minutes' is not a positive integer: 3.5");
        // 6. Correctly added
        var req10 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "couch", optionsArray: ["steak", "chicken"], minutes: 4 } });
        var res10 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req10, res10);
        assert.strictEqual(res10._getStatusCode(), 200);
        (0, routes_1.resetForTesting)();
    });
    it('vote', function () {
        // Separate domain for each branch:
        // 1. Missing voter
        var req2 = httpMocks.createRequest({ method: 'POST', url: '/api/bid', body: {} });
        var res2 = httpMocks.createResponse();
        (0, routes_1.VoteInPoll)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), "missing or invalid 'voter' parameter");
        // 2. Missing name
        var req3 = httpMocks.createRequest({ method: 'POST', url: '/api/bid', body: { voter: "Barney" } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.VoteInPoll)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        assert.deepStrictEqual(res3._getData(), "missing or invalid 'name' parameter");
        // 4. Missing option
        var req6 = httpMocks.createRequest({ method: 'POST', url: '/api/bid',
            body: { voter: "Barney", name: "couch" } });
        var res6 = httpMocks.createResponse();
        (0, routes_1.VoteInPoll)(req6, res6);
        assert.strictEqual(res6._getStatusCode(), 400);
        assert.deepStrictEqual(res6._getData(), "no poll with name 'couch'");
        (0, routes_1.resetForTesting)();
    });
    it('get', function () {
        // Separate domain for each branch:
        // 1. Missing name
        var req3 = httpMocks.createRequest({ method: 'POST', url: '/api/get', body: { voter: "Barney" } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.getPoll)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        assert.deepStrictEqual(res3._getData(), "missing or invalid 'name' parameter");
        // 2. Invalid name
        var req4 = httpMocks.createRequest({ method: 'POST', url: '/api/get',
            body: { bidder: "Barney", name: "fridge" } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.getPoll)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 400);
        assert.deepStrictEqual(res4._getData(), "no poll with name 'fridge'");
        var req5 = httpMocks.createRequest({ method: 'POST', url: '/api/get',
            body: { bidder: "Barney", name: "stool" } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.getPoll)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 400);
        assert.deepStrictEqual(res5._getData(), "no poll with name 'stool'");
        (0, routes_1.resetForTesting)();
    });
    it('list', function () {
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: {} });
        var res1 = httpMocks.createResponse();
        (0, routes_1.listPolls)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getData(), { polls: [] });
        var req2 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "couch", seller: "Fred", description: "a couch",
                minBid: 10, minutes: 10 } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        var req3 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "chair", seller: "Barney", description: "comfy couch",
                minBid: 5, minutes: 5 } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        var req4 = httpMocks.createRequest({ method: 'POST', url: '/api/add',
            body: { name: "stool", seller: "Kevin", description: "correctness stool",
                minBid: 15, minutes: 15 } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.addPoll)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 400);
        // NOTE: chair goes first because it finishes sooner
        var req5 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: {} });
        var res5 = httpMocks.createResponse();
        (0, routes_1.listPolls)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 200);
        // Push time forward by over 5 minutes
        (0, routes_1.advanceTimeForTesting)(5 * 60 * 1000 + 50);
        // NOTE: chair goes after because it has finished
        var req6 = httpMocks.createRequest({ method: 'GET', url: '/api/list', query: {} });
        var res6 = httpMocks.createResponse();
        (0, routes_1.listPolls)(req6, res6);
        assert.strictEqual(res6._getStatusCode(), 200);
        (0, routes_1.resetForTesting)();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUNqQyx5REFBNkM7QUFDN0MsbUNBQTBHO0FBRTFHLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsRUFBRSxDQUFDLEtBQUssRUFBRTtRQUNSLG1DQUFtQztRQUNuQyxrQkFBa0I7UUFDbEIsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FDaEMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDakQsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLElBQUEsZ0JBQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQ2xDLDBCQUEwQixDQUFDLENBQUM7UUFFaEMscUJBQXFCO1FBQ3JCLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ2hDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDOUQsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLElBQUEsZ0JBQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFD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