# TimeCloud
The Node.JS back-end for the Timeshift project.

[![Build Status](https://travis-ci.org/RPISDD/TimeCloud.svg?branch=master)](https://travis-ci.org/RPISDD/TimeCloud)

# StaticWeb
This repo contains the StaticWeb repo as a dependency. The submodule is added
over https, however, so it is highly recommended you do not try to edit the
submodule from inside TimeCloud.

## Custom StaticWeb Directory
To set a custom StaticWeb location (e.g. for developing Polymer), set
`STATIC_WEB_DIR` to the dist directory you wish to serve. Don't forget to run
`gulp` from root of your StaticWeb directory to compile to dist.
