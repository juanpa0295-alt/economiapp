import http.server,functools,socketserver,sys
h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=sys.argv[1])
socketserver.TCPServer.allow_reuse_address=True
with socketserver.TCPServer(("",8767),h) as s:s.serve_forever()
