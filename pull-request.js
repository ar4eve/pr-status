const https = require('https');
const schema = require('./schema');

class PullRequest {
  constructor({org, token}) {
    this.org = org;
    this.token = token;
  }

  static checkCredentials(args, envs) {
    let argsStatus = null;
    let envsStatus = null;
    if(args.length != 0) {
      argsStatus = this.checkArgs(args);
    } else {
      envsStatus = this.checkEnvs(envs);
    }
    
    return [argsStatus, envsStatus];
  }

  static checkEnvs(envs) {
    if (typeof envs.org === 'undefined' && typeof envs.token === 'undefined') {
      return 'Please set PR_STATUS_ORG and PR_STATUS_TOKEN environment or pass --org and --token flag with values.';
    } else if(typeof envs.org === 'undefined') {
      return 'PR_STATUS_ORG environment variable not found.';
    } else if(typeof envs.token === 'undefined') {
      return 'PR_STATUS_TOKEN environment variable not found';
    } else {
      return envs;
    }
  }

  static checkArgs(args) {
    const orgFlag = '--org';
    const tokenFlag = '--token';
    const orgIndex = args.findIndex(v => v == orgFlag);
    const tokenIndex = args.findIndex(v => v == tokenFlag);
    if(orgIndex == -1 && tokenIndex == -1) {
      return 'Incorrect flags. Please pass --org and --token flag with values.';
    } else if(orgIndex == -1 && tokenIndex != -1) {
      return 'Please also pass --org flag with value.';
    } else if(orgIndex != -1 && tokenIndex == -1) {
      return 'Please also pass --token flag with value.';
    } else if(orgIndex != -1 && tokenIndex != -1) {
      const orgValue = args[orgIndex + 1];
      const tokenValue = args[tokenIndex + 1];
      if(typeof orgValue !== 'undefined' && typeof tokenValue !== 'undefined') {
        return {
          org: orgValue,
          token: tokenValue
        };
      } else {
        return 'Please pass flags with correct values.';
      }
    } else {
      return 'Something went wrong!';
    }
  }

  sendRequest() {
    const variables = {
      'organization': this.org
    };
    schema.variables = variables;
    const data = JSON.stringify(schema);

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'user-agent': 'pr-status',
        'Authorization': `Bearer ${this.token}`
      }
    };

    const req = https.request(options, (res) => {
      let result = '';

      res.on('data', (chunk) => {
        result += chunk;
      });

      res.on('end', () => {
        let repos = JSON.parse(result).data.organization.repositories.nodes;
        let prs = [];
        repos.forEach(repo => {
          let pullRequests = repo.pullRequests.nodes;
          pullRequests.forEach(pullRequest => {
            let labels = [];
            if(pullRequest.labels.nodes.length == 0) {
              labels.push(' needs review');
            } else {
              pullRequest.labels.nodes.forEach(label => labels.push(` ${label.name}`));
            }
            prs.push({
              author: pullRequest.author.login,
              url: pullRequest.permalink,
              labels: labels,
              createdAt: pullRequest.createdAt
            });
          })
        });
        this.displayPrs(prs);
      });
    });

    req.on('error', (error) => {
      console.error(error)
    });

    req.write(data);
    req.end();
  }

  sortByCreatedAt(prs) {
    return prs.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  formatCreatedAt(createdAt) {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const calc = Math.ceil((Math.abs(createdDate.getTime() - currentDate.getTime())) / (1000 * 3600 * 24));
    if(typeof calc === 'number' && calc === 0 || calc === 1) {
      return calc + ' day ago';
    } else {
      return calc + ' days ago';
    }
  }

  displayPrs(prs) {
    let authorSize = null;
    let urlSize = null;
    let labelsSize = null;
    let createdSize = null;
    let sizes = [];
    this.sortByCreatedAt(prs).forEach(pr => {
      authorSize = pr.author.length;
      urlSize = pr.url.length;
      if(pr.labels.length === 1) {
        labelsSize = pr.labels[0].length;
      } else {
        labelsSize = pr.labels.reduce((a, c) => a.length + c.length);
      }
      createdSize = this.formatCreatedAt(pr.createdAt).length;
      sizes.push([authorSize, urlSize, labelsSize, createdSize]);
    });

    let reverseSizes = [];
    for(let i = 0; i < sizes[0].length; i++) {
      let reverse = [];
      sizes.forEach(size => {
        reverse.push(size[i]);
      });
      reverseSizes.push(reverse);
    }

    const maxValues = [];
    reverseSizes.forEach(reverseSize => {
      maxValues.push(Math.max(...reverseSize));
    });
    ['Author', 'PR', 'Labels', 'Created'].forEach((title, index, arr) => {
      if (Object.is(arr.length - 1, index)) {
        this.formatSpace(title, maxValues[index], true);
      } else {
        this.formatSpace(title, maxValues[index]);
      }
    });
    process.stdout.write('\n');
    prs.forEach((pr, prsIndex, prsArray) => {
      [pr.author, pr.url.replace('https://', ''), pr.labels, this.formatCreatedAt(pr.createdAt)].forEach((title, index, prArray) => {
        if (Object.is(prArray.length - 1, index)) {
          this.formatSpace(title, maxValues[index], true);
        } else {
          this.formatSpace(title, maxValues[index]);
        }
      });
      process.stdout.write('\n');
    });
    process.stdout.write('\n');
  }

  formatSpace(title, size, lastIndex = false) {
    let spacing = null;
    let show = null;
    if(typeof title === 'object') {
      if(title.length === 1) {
        spacing = size - title[0].length;
        show = title[0].trim() + ' ';
      } else {
        spacing = size - title.reduce((a, c) => a.length + c.length);
        show = title.reduce((a, c) => a.trim() + ', ' + c.trim());
      }
    } else {
      spacing = size - title.length
      show = title;
    }
    process.stdout.write(`${show}`);
    for(let s = 0; s < spacing; s++) {
      process.stdout.write(' ');
    }
    if(!lastIndex) {
      process.stdout.write(' | ');
    }
  }
}

module.exports = PullRequest;