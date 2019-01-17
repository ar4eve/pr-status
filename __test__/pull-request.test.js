const PullRequest = require('../pull-request');

describe('Check environment variables', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('Return object with credentials if present', () => {
    process.env.PR_STATUS_ORG = 'myOrganization';
    process.env.PR_STATUS_TOKEN = 'myPersonalAccessToken';

    const envs = {
      org: process.env.PR_STATUS_ORG,
      token: process.env.PR_STATUS_TOKEN
    };

    expect(PullRequest.checkEnvs(envs)).toMatchObject({
      org: expect.stringContaining('myOrganization'),
      token: expect.stringContaining('myPersonalAccessToken')
    });
  });

  test('Return error value otherwise', () => {
    const envs = {
      org: process.env.PR_STATUS_ORG,
      token: process.env.PR_STATUS_TOKEN
    };

    const errorValues = [
      'Please set PR_STATUS_ORG and PR_STATUS_TOKEN environment or pass --org and --token flag with values.',
      'PR_STATUS_ORG environment variable not found.',
      'PR_STATUS_TOKEN environment variable not found'
    ];

    expect(errorValues).toContain(PullRequest.checkEnvs(envs));
  });
});
