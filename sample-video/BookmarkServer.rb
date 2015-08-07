require 'rubygems'
require 'rack'
require 'uri'
require "erb"

include ERB::Util

ServerPort=3002
DebugLogging=true

class PlayerPageData
  attr_accessor :bookmarkTime
  
  def get_binding
    binding
  end
end

class BookmarTracker
  
  def initialize
    @bookmarkPageTemplate = ERB.new(File.read("sample-video/bookmark.erb"), nil, ">")
    @bookmarkFile = "sample-video/bookmark"
  end
  
  def call(env)
    
    path = env["REQUEST_PATH"]
    
    if DebugLogging
      puts "REQUEST at #{Time.now} for path #{path}"
    end
    
    if path == "/read-bookmark"
      handleReadBookmark(env)
    elsif path == "/write-bookmark"
      handleWriteBookmark(env)
    else
      [404, { 'Content-Type' => 'text/plain'}, "I don't have a handler for the request path #{path}\n"]
    end
  end
  
  def handleReadBookmark(env)
    pageData = nil
    if File.exists?(@bookmarkFile)
      if DebugLogging
        puts "Reading bookmark from file"
      end
      
      File.open(@bookmarkFile, 'r') do |f|
        pageData = Marshal.load(f)
      end
    else
      pageData = PlayerPageData.new
    end
    
    [200, { 'Content-Type' => 'application/xml' }, @bookmarkPageTemplate.result(pageData.get_binding)]
  end
  
  def handleWriteBookmark(env)
    req = Rack::Request.new(env)
    bookmarkTime = req.params["bookmark-time"];
    
    # Hardcoding the threshold time after which the video is assumed to be seen.
    if bookmarkTime.to_i > 110
      if DebugLogging
        puts "Deleting bookmark file #{bookmarkTime}"
      end
      
      if File.exists?(@bookmarkFile)
        File.delete(@bookmarkFile)
      end
    else
      if DebugLogging
        puts "Writing a new bookmark #{bookmarkTime}"
      end

      pageData = PlayerPageData.new
      pageData.bookmarkTime = bookmarkTime
      File.open(@bookmarkFile, 'w') do |f|
        Marshal.dump(pageData, f)
      end
    end

    [200, { 'Content-Type' => 'text/plain' }, '']
  end
end

puts "Server listening on port #{ServerPort}"
Rack::Handler::Mongrel.run BookmarTracker.new, :Port => ServerPort
