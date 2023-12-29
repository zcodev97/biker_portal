import http.server
import socketserver
import os

# Set the port number you want to use
PORT = 8001

# Set the path to your React app's build directory
web_dir = os.path.join(os.path.dirname(__file__), 'build')

# Change to the build directory of your React app
os.chdir(web_dir)

# Create an HTTP server to serve the React app
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(('localhost', PORT), Handler)

print(f"Serving at http://localhost:{PORT}")
try:
    # Start the server
    httpd.serve_forever()
except KeyboardInterrupt:
    # Stop the server when the user presses Ctrl+C
    pass
finally:
    httpd.server_close()
