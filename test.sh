#!/bin/bash
set -e

RES=$( echo d  )

if [[ "$RES" == 'error' ]] || [[ "$RES" == "" ]]; then
   echo hiba: $RES
fi
