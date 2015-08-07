require 'rubygems'
require 'rack'

ServerPort=3001

class HTTPLogCollector
  
  def call(env)
    
    path = env["REQUEST_PATH"]
    
    if path == "/log"
      log(env)
    else
      [404, { 'Content-Type' => 'text/plain'}, "I don't have a handler for the request path #{path}\n"]
    end
  end
  
  def log(env)
    req = Rack::Request.new(env)
    
    message = req.body().read()
    
    if message.nil?
      puts "LOGGING ERROR: Missing POST data"
      [400, { 'Content-Type' => 'text/plain' }, "Missing message query parameter\n"]
    else
      puts message
      [200, { 'Content-Type' => 'text/plain' }, "OK"]
    end
    
  end
  
end

puts "Log Collector listening on port #{ServerPort}"

#Rack::Handler::Mongrel.run HTTPLogCollector.new, :Port => ServerPort
Rack::Server.start :app => HTTPLogCollector.new, :server => 'webrick', :Port => ServerPort, :AccessLog => [] 