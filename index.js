#!/usr/bin/env node

const PullRequest = require('./pull-request');
const [,, ...args] = process.argv;
const envs = {
  org: process.env.PR_STATUS_ORG,
  token: process.env.PR_STATUS_TOKEN
}

const [...credentials] = PullRequest.checkCredentials(args, envs);
const credential = credentials[(credentials.indexOf(null) == 0) ? 1 : 0];

let pullRequest = null;
if(typeof credential === 'string') {
  console.log(credential);
} else if(typeof credential === 'object') {
  pullRequest = new PullRequest(credential);
  pullRequest.sendRequest();
}