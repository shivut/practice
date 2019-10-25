#!/bin/bash                                                                                                                                                                              

mkdir -p /mnt/pssd/node/platform/yedvanshitechapis/scratch
while :
do
    /usr/bin/nodemon -I --exitcrash /mnt/pssd/node/platform/yedvanshitechapis/node/gobikesapi.js 2>&1 > /mnt/pssd/node/platform/yedvanshitechapis/scratch/gobikesapi.log
    sleep 5
done

