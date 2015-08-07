#!/bin/bash

AUTHSERVER=authentication/AuthenticationServer.rb

if [ ! -f $AUTHSERVER ]; then
	echo This script must be run from the root of the sample site
	exit 1
fi

scripts/installRequiredGems.sh || exit 1

ruby "$AUTHSERVER"
