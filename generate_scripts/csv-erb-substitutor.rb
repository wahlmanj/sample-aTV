#!/usr/bin/ruby

require "erb"
require "csv"
include ERB::Util

class CSVData
  def initialize
    @hashRows=[]
  end
  
  def addHashRow hashRow
    @hashRows << hashRow
  end
  
  def get_binding
    binding
  end
end

def readCSV csvFilename
  reader = CSV.open(csvFilename, "r")
  data = CSVData.new
  
  header = reader.shift

  reader.each { |row|

    hashRow = {}

    i = 0
    while i < header.length
      hashRow[header[i]] = row[i]
      i = i + 1
    end

    data.addHashRow hashRow
  }
  
  data
end

def readTemplate templateFilename
  ERB.new(File.read(templateFilename), nil, ">")
end

if ARGV.length != 2
  puts "Usage: cvs-erb-substitutor CSVFilename TemplateFilename"
  exit 1
end

csvFilename=ARGV[0]
templateFilename=ARGV[1]

data = readCSV(csvFilename)
template = readTemplate(templateFilename)

template.run(data.get_binding)
