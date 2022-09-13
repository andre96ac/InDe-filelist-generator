#!/usr/bin/env node

const yargs = require('yargs')
const{ generate } = require('./handler.js')

generate(yargs);
yargs.parse();
