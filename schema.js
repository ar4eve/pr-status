const query = 
  `
  query PullRequests($organization: String!) {
    organization(login: $organization) {
      name
      repositories(first: 100) {
        totalCount
        nodes {
          name
          pullRequests(first: 100, states: OPEN, orderBy: {field: CREATED_AT, direction: ASC}) {
            totalCount
            nodes {
              createdAt
              permalink
              labels(first: 10) {
                nodes {
                  name
                }
              }
              author {
                login
              }
            }
          }
        }
      }
    }
  }
  `;

module.exports = {
  query
}