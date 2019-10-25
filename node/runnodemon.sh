#!/bin/bash                                                                                                                                                                              

mkdir -p /mnt/pssd/node/platform/yedvanshitechapis/scratch
while :
do
    /usr/bin/nodemon -I --exitcrash /mnt/pssd/node/platform/yedvanshitechapis/node/yedvanshitech.js 2>&1 > /mnt/pssd/node/platform/yedvanshitechapis/scratch/yedvanshitech.log
    sleep 5
done

