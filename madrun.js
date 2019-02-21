'use strict';

const {
    run,
    parallel
} = require('madrun');

const {version} = require('./package');

const dirs = [
    'bin/cloudcmd.js',
    'common',
    'server',
].join(' ');

const dirsTest = [
    'test',
    'bin/release.js',
    'webpack.config.js',
    'cssnano.config.js',
    '.webpack',
    'madrun.js',
    '{client,server,common}/**/*.spec.js',
].join(' ');

module.exports = {
    'start': () => 'node bin/cloudcmd.js',
    'start:dev': () => `NODE_ENV=development ${run('start')}`,
    'build:start': () => run(['build:client', 'start']),
    'build:start:dev': () => run(['build:client:dev', 'start:dev']),
    'lint': () => run(['putout', 'lint:*', 'spell']),
    'lint:server': () => `eslint -c .eslintrc.server ${dirs} --ignore-pattern *.spec.js`,
    'lint:test': () => `eslint --ignore-pattern '!.*' ${dirsTest}`,
    'lint:client': () => 'eslint --env browser client',
    'lint:css': () => 'stylelint css/*.css',
    'spell': () => 'yaspeller .',
    'fix:lint': () => run(['putout', 'lint:*'], '--fix'),
    'test': () => `tape 'test/**/*.js' '{client,common,server}/**/*.spec.js'`,
    'test:client': () => `tape 'test/client/**/*.js`,
    'test:server': () => `tape 'test/**/*.js' 'server/**/*.spec.js' 'common/**/*.spec.js'`,
    'wisdom': () => run(['lint', 'build', 'test']),
    'wisdom:type': () => 'bin/release.js',
    'docker:pull:node': () => 'docker pull node',
    'docker:pull:alpine': () => 'docker pull mhart/alpine-node',
    'docker:push': () => `docker push coderaiser/cloudcmd:${version}`,
    'docker:push:latest': () => 'docker push coderaiser/cloudcmd:latest',
    'docker:push:alpine': () => `docker push coderaiser/cloudcmd:${version}-alpine`,
    'docker:push:alpine:latest': () => 'docker push coderaiser/cloudcmd:latest-alpine',
    'docker:build': () => `docker build -t coderaiser/cloudcmd:${version} .`,
    'docker:build:alpine': () => `docker build -f Dockerfile.alpine -t coderaiser/cloudcmd:${version}-alpine .`,
    'docker': () => run(['docker:pull*', 'docker:build*', 'docker:tag*', 'docker:push*']),
    'docker-ci': () => run(['build', 'docker-login', 'docker']),
    'docker-login': () => 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD',
    'docker:alpine': () => run([
        'docker:pull:alpine',
        'docker:build:alpine',
        'docker:tag:alpine',
        'docker:push:alpine',
        'docker:push:alpine:latest',
    ]),
    'docker:tag': () => `docker tag coderaiser/cloudcmd:${version} coderaiser/cloudcmd:latest`,
    'docker:tag:alpine': () => `docker tag coderaiser/cloudcmd:${version}-alpine coderaiser/cloudcmd:latest-alpine`,
    'docker:rm:version': () => `docker rmi -f coderaiser/cloudcmd:${version}`,
    'docker:rm:latest': () => 'docker rmi -f coderaiser/cloudcmd:latest',
    'docker:rm:alpine': () => `docker rmi -f coderaiser/cloudcmd:${version}-alpine`,
    'docker:rm:latest-alpine': () => 'docker rmi -f coderaiser/cloudcmd:latest-alpine',
    'docker:rm-old': () => `${parallel('docker:rm:*')} || true`,
    'coverage': () => `nyc ${run('test')}`,
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    '6to5': () => 'webpack --progress',
    '6to5:client': () => run('6to5', '--mode production'),
    '6to5:client:dev': () => `NODE_ENV=development ${run('6to5', '--progress --mode development')}`,
    'pre6to5:client': () => 'rimraf dist',
    'pre6to5:client:dev': () => 'rimraf dist-dev',
    'watch:client': () => run('6to5:client','--watch'),
    'watch:client:dev': () => run('6to5:client:dev', '--watch'),
    'watch:server': () => 'nodemon bin/cloudcmd.js',
    'watch:lint': () => `nodemon -w client -w server -w webpack.config.js -x ${run(['lint:client', 'lint:server'])}`,
    'watch:lint:client': () => `nodemon -w client -w webpack.config.js -x ${run('lint:client')}`,
    'watch:lint:server': () => `nodemon -w server -w common -x ${run('lint:server')}`,
    'watch:test': () => `nodemon -w client -w server -w test -w common -x ${run('test')}`,
    'watch:test:client': () => `nodemon -w client -w test/client -x ${run('test:client')}`,
    'watch:test:server': () => `nodemon -w client -w test/client -x ${run('test:server')}`,
    'watch:coverage': () => `nodemon -w server -w test -w common -x ${run('coverage')}`,
    'build': () => run('6to5:*'),
    'build:client': () => run('6to5:client'),
    'build:client:dev': () => run('6to5:client:dev'),
    'heroku-postbuild': () => run('6to5:client'),
    'putout': () => 'putout bin client server common test',
};

