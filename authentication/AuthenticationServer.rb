require 'rubygems'
require 'rack'
require 'uri'
require "erb"

include ERB::Util

ValidUsername="doug"
ValidPassword="pass 12"
ServerPort=3000
DebugLogging=true

class AuthPageData
  attr_accessor :urlToLoadAfterAuth
  
  def get_binding
    binding
  end
end

class AuthRequired
  
  def initialize
    @authenticatePageTemplate = ERB.new(File.read("authentication/authenticate.erb"), nil, ">")
  end
  
  def call(env)
    
    path = env["REQUEST_PATH"]
    
    if DebugLogging
      puts "REQUEST at #{Time.now} for path #{path}"
    end
    
    if path == "/make-me-auth"
      handleMakeMeAuth(env)
    elsif path == "/authenticate"
      handleAuthenticate(env)
    elsif path == "/authonly"
      handleAuthOnly(env)
    else
      [404, { 'Content-Type' => 'text/plain'}, "I don't have a handler for the request path #{path}\n"]
    end
  end
  
  def authenticatePlist(urlToLoadAfterAuth)
    pageData = AuthPageData.new
    pageData.urlToLoadAfterAuth = urlToLoadAfterAuth
    @authenticatePageTemplate.result(pageData.get_binding)
  end
  
  def handleMakeMeAuth(env)
    req = Rack::Request.new(env)
    
    url = req.params["url"]
    
    if url.nil?
      puts "Missing query param"
      [400, { 'Content-Type' => 'text/plain' }, "Missing url query parameter\n"]
    elsif req.params["auth-token"] == "12345"
      url = URI.decode(url)
      [302, { 'Content-Type' => 'text/plain', "Location" => url }, "Redirecting to #{url}\n" ]
    else
      [200, { 'Content-Type' => 'application/xml' }, authenticatePlist(url)]
    end
    
  end
  
  def handleAuthenticate(env)
    req = Rack::Request.new(env)
    
    username = req.params["username"]
    password = req.params["password"]
    
    if DebugLogging
      puts "username is #{username}"
      puts "password is #{password}"
    end
    
    if username.nil? or password.nil?
      jsonResponse = "Missing username or password parameter"
    elsif URI.decode(username) == ValidUsername && URI.decode(password) == ValidPassword
      jsonResponse = '{ "auth-token" : "12345" }'
    else
      jsonResponse = '{ "message" : "Invalid username or password." }'
    end
      
      [200, { 'Content-Type' => 'application/json' }, jsonResponse + "\n"]
  end
  
  def handleAuthOnly(env)
    [200, { 'Content-Type' => 'application/xml' }, authenticatePlist(nil)]
  end
  
end

puts "Server listening on port #{ServerPort}"
Rack::Handler::Mongrel.run AuthRequired.new, :Port => ServerPort
