#!/bin/bash
# changeHostname.sh <hostname> <output_folder>
# Change the default name used in the sample site (i.e. sample-web-server) to hostname. The new sample store
# is created in output_folder.

Hostname=$1
OutputFolder=$2
DefaultHostname=sample-web-server

function usage {
	echo "Usage: scripts/changeHostname.sh <hostname> <output_folder>"
	echo "For example:"
	echo "  scripts/changeHostname.sh myhostname ~/Desktop/newsite/sample"
}

if [ ! -f bag.plist ]; then
	echo "You must run this script from the folder from the root of the sample site"
	exit 1
fi

if [ -z "$Hostname" ]; then
	echo "You must specify a hostname"
	usage;
	exit 1;
fi

if [ -z "$OutputFolder" ]; then
	echo "You must specify an output folder";
	usage;
	exit 1;
fi

if [ -e "$OutputFolder" ]; then
	echo "The output folder '$OutputFolder' already exists. Remove it before running this script."
	exit 1
fi

echo Copying sample site to $OutputFolder
ditto . "$OutputFolder" || exit 1

cd "$OutputFolder" || exit 1

echo Renaming all occurrances of $DefaultHostname in plist and JavaScript files to $Hostname
find . -type f -print0 \( -name '*.js' -or -name '*.plist' \) | xargs -0 perl -i -pe s/$DefaultHostname/$Hostname/g || exit 1

echo "Removing changeHostname script in output folder since it will no longer work."
rm ./scripts/changeHostname.sh || exit 1

echo Success
