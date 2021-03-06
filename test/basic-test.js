var tap = require("tap"),
    test = tap.test,
    plan = tap.plan,
    mschema;


// readable / writable stream classes used for testing input / output to services
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

// a few example / test services to use as testing fixtures
var helloService = require('../examples/services/hello');
var echoStringService = require('../examples/services/echoString');


test("attempt to load run-service module", function (t) {
  rs = require('../');
  t.end();
});

test("attempt to run hello service", function (t) {
  
  var input = new Readable;
  var output = Writable();

  t.plan(1);

  output._write = function (chunk, enc, next) {
    t.equal(chunk.toString(), "Hello!");
    // console.log(chunk.toString());
    next();
  };

  output.on('error', function(err){
    console.log('err', err)
  });

  output.on('end', function end () {
    console.log('output ended')
  });

  rs({
    service: helloService,
    env: { 
      params: "testing",
      req: input,
      res: output
    },
    vm: {
      require: require,
      console: console
    },
   })(function(err){
    if(err) throw err;
  });

});


test("attempt to run echoString service", function (t) {

  var input = new Readable;
  var output = Writable();

  t.plan(1);

  output._write = function (chunk, enc, next) {
    t.equal(chunk.toString(), "testing 123");
    // console.log(chunk.toString());
    next();
  };

  output.on('error', function(err){
    console.log('err', err)
  });

  output.on('end', function end () {
    console.log('output ended')
  });

  rs({ 
    service: echoStringService,
    env: { 
      params: "testing 123",
      req: input,
      res: output
    },
    vm: {
      require: require,
      console: console
    },
   })(function(err){
    if(err) throw err;
  });
});
