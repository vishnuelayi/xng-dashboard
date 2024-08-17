const sonarqubeScanner = require('sonarqube-scanner');
const token = process.env.Token;
sonarqubeScanner({
  serverUrl: 'https://sonarcloud.io',
  options : {
    'sonar.token': token,
    'sonar.projectKey': 'msb-xng_frontend',
    'sonar.organization': 'msb-xng',
    'sonar.sources': '.',
    'sonar.inclusions': 'src/**' // Entry point of your code
  },
}, () => {});
