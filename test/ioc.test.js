var http = require('http').Server;
var io = require('..');
var ioc = require('socket.io-client');
var request = require('supertest');
var expect = require('expect.js');
require('should');

describe.only('socket.io.pre2', function(){

  it('should able to set ping interval', function(){
    var server = io(http());
    server.set('heartbeat interval', 10);
    expect(server.eio.pingInterval).to.be(10);
  });

  it('should able to set transports to engine.io', function(){
    var server = io(http());
    server.set('transports', ['websocket']);
    expect(server.eio.transports).to.be.eql(['websocket']);
  })

  it('should able to set maxHttpBufferSize', function(){
    var server = io(http());
    server.set('destroy buffer size', 10);
    expect(server.eio.maxHttpBufferSize).to.eql(10);
  })

  it('should able to set path with setting resource', function(){
    var server = io(http());
    server.set('resource', '/ramdom');
    expect(server.path()).to.be('/ramdom');
  })

  it('should able to be authorization and send error packet', function(done){
    var httpServer = http();
    var server = io(httpServer);
    server.set('authorization', function(o, f){ f(null, true); });

    // handle connection
    server.on('connection', function(s){
      s.on('angl', function(data){
        expect(data).to.be('wkrldi');
        done();
      })
    });    

    var addr = httpServer.listen().address();
    var url = 'ws://' + addr.address + ':' + addr.port;
    var socket = ioc(url);
    socket.on('connect', function(){
      socket.emit('angl', 'wkrldi')
    });
    socket.on('error', function(err){
      expect(err).to.be('Not authorized');
      done();
    });
  });

  describe('server attachment', function(){
    it('should work with #attach', function(done){
      var httpServer = http();
      var sockets = io();
      sockets.attach(httpServer);
      request(httpServer)
      .get('/socket.io/socket.io.js')
      .end(function(err, res){
        if (err) return done(err);
        expect(res.status).to.be(200);
        done();
      });

    }); 
  });

  describe('listen port', function(){
    it('should bind a port', function(done){
      var sockets = io(1987);
      request('http://localhost:1987')
      .get('/socket.io/socket.io.js')
      .expect(200, done);

    });

    it('should bind a port with listen', function(done){
      var sockets = io().listen(1988);
      request('http://localhost:1987')
      .get('/socket.io/socket.io.js')
      .expect(200, done);
    })
  })
});


