#!/bin/bash

zola build
rsync -avr --rsh='ssh' --delete-after --delete-excluded ./public/* rileyshahar@blog.nihilistkitten.me:blog/
