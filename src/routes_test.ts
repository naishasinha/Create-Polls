import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addPoll, resetForTesting, VoteInPoll, getPoll, listPolls, advanceTimeForTesting} from './routes';

describe('routes', function() {

  it('add', function() {
    // Separate domain for each branch:
    // 1. Missing name
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {}});
    const res1 = httpMocks.createResponse();
    addPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        "missing 'name' parameter");

    // 2. Missing options
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "couch"}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        "options is not an array");

    // 3. Missing minutes
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "dinner", optionsArray: ["steak", "chicken"]}});
    const res7 = httpMocks.createResponse();
    addPoll(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
        "'minutes' is not a number: undefined");

    // 4. Invalid minutes
    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "dinner", optionsArray: ["steak", "chicken"], minutes: "hi"}});
    const res8 = httpMocks.createResponse();
    addPoll(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);
    assert.deepStrictEqual(res8._getData(),
        "'minutes' is not a number: hi");

    const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "couch", optionsArray: ["steak", "chicken"], minutes: 3.5}});
    const res9 = httpMocks.createResponse();
    addPoll(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
        "'minutes' is not a positive integer: 3.5");

    // 6. Correctly added
    const req10 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
        body: {name: "couch", optionsArray: ["steak", "chicken"], minutes: 4}});
    const res10 = httpMocks.createResponse();
    addPoll(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 200);

    resetForTesting();
  });

  it('vote', function() {

    // Separate domain for each branch:
    // 1. Missing voter
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/bid', body: {}});
    const res2 = httpMocks.createResponse();
    VoteInPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        "missing or invalid 'voter' parameter");

    // 2. Missing name
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/bid', body: {voter: "Barney"}});
    const res3 = httpMocks.createResponse();
    VoteInPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        "missing or invalid 'name' parameter");

    // 4. Missing option
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/bid',
         body: {voter: "Barney", name: "couch"}});
    const res6 = httpMocks.createResponse();
    VoteInPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
        "no poll with name 'couch'");


    resetForTesting();
  });

  it('get', function() {

    // Separate domain for each branch:
    // 1. Missing name
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get', body: {voter: "Barney"}});
    const res3 = httpMocks.createResponse();
    getPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        "missing or invalid 'name' parameter");

    // 2. Invalid name
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get',
         body: {bidder: "Barney", name: "fridge"}});
    const res4 = httpMocks.createResponse();
    getPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), "no poll with name 'fridge'");

    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get',
         body: {bidder: "Barney", name: "stool"}});
    const res5 = httpMocks.createResponse();
    getPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(), "no poll with name 'stool'");

    resetForTesting();
  });

  it('list', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
    const res1 = httpMocks.createResponse();
    listPolls(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {polls: []});

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "couch", seller: "Fred", description: "a couch",
                minBid: 10, minutes: 10}});
    const res2 = httpMocks.createResponse();
    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "chair", seller: "Barney", description: "comfy couch",
                minBid: 5, minutes: 5}});
    const res3 = httpMocks.createResponse();
    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "stool", seller: "Kevin", description: "correctness stool",
                minBid: 15, minutes: 15}});
    const res4 = httpMocks.createResponse();
    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);

    // NOTE: chair goes first because it finishes sooner
    const req5 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
    const res5 = httpMocks.createResponse();
    listPolls(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);

   // Push time forward by over 5 minutes
   advanceTimeForTesting(5 * 60 * 1000 + 50); 
         
   // NOTE: chair goes after because it has finished
   const req6 = httpMocks.createRequest(
       {method: 'GET', url: '/api/list', query: {}});
   const res6 = httpMocks.createResponse();
   listPolls(req6, res6);
   assert.strictEqual(res6._getStatusCode(), 200);

    resetForTesting();
  });

});