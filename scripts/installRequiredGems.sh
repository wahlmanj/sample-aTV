#!/bin/bash

function InstallRubyGemIfNeeded {	
	gem list --local|grep "$1" > /dev/null
	if [ $? != 0 ]; then
		echo "Need to install Ruby gem for $1. You may be prompted for your sudo password."
		sudo gem install --no-rdoc --no-ri "$1"
		if [ $? != 0 ]; then
			echo "Error installing required GEM $1"
			echo "Make sure you installed Xcode with UNIX Tools selected."
			exit 1
		fi
	fi
}

InstallRubyGemIfNeeded rack
# InstallRubyGemIfNeeded mongrel
InstallRubyGemIfNeeded json
