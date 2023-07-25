#!/bin/bash

set -euo pipefail

zola build
rsync -avr --rsh='ssh' --delete-after --delete-excluded ./public/* me
