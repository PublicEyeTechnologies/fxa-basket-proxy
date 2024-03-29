/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*eslint-disable camelcase */
var convict = require('convict');
var fs = require('fs');
var path = require('path');

var conf = module.exports = convict({
  env: {
    doc: 'What environment are we running in?  Note: all hosted environments are \'production\'.',
    format: ['production', 'development'],
    default: 'production',
    env: 'NODE_ENV'
  },
  log: {
    level: {
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      default: 'pretty',
      format: ['heka', 'pretty'],
      env: 'LOG_FORMAT'
    },
    app: {
      default: 'fxa-basket-proxy',
      env: 'LOG_APP_NAME'
    }
  },
  basket: {
    proxy_url: {
      doc: 'Url for the Basket proxy server',
      format: String,
      default: 'http://127.0.0.1:1114'
    },
    api_url: {
      doc: 'Url for the Basket API server',
      format: String,
      default: 'http://127.0.0.1:10140'
    },
    api_key: {
      doc: 'Basket API key',
      format: String,
      default: 'test key please change'
    },
    api_timeout: {
      doc: 'Timeout for talking to the Basket API server, in ms',
      format: 'duration',
      default: '5 seconds'
    },
    sqs: {
      region: {
        doc: 'The region where the queues live, e.g. us-east-1, us-west-2',
        format: String,
        env: 'BASKET_SQS_REGION',
        default: ''
      },
      queue_url: {
        doc: 'The basket event queue URL',
        format: String,
        env: 'BASKET_SQS_QUEUE_URL',
        default: ''
      }
    }
  },
  fxaccount_url: {
    default: 'http://127.0.0.1:9000',
    doc: 'The url of the Firefox Account auth server',
    env: 'FXA_URL',
    format: 'url'
  },
  oauth_url: {
    doc: 'The url of the Firefox Account OAuth server',
    format: 'url',
    default: 'http://127.0.0.1:9010',
    env: 'FXA_OAUTH_URL'
  },
  cors_origin: {
    doc: 'Origin to allow in CORS headers',
    default: '*',
    env: 'CORS_ORIGIN'
  }
});


var DEV_CONFIG_PATH = path.join(__dirname, '..', 'config', 'local.json');
var files;

// Handle configuration files.
// You can specify a CSV list of configuration files to process in the
// CONFIG_FILES environment variable.  They will be overlaid on the default
// config in order.
if (process.env.CONFIG_FILES && process.env.CONFIG_FILES.trim() !== '') {
  files = process.env.CONFIG_FILES.split(',');
} else if (fs.existsSync(DEV_CONFIG_PATH)) {
  files = [ DEV_CONFIG_PATH ];
}

if (files) {
  conf.loadFile(files);
}

if (! process.env.NODE_ENV) {
  process.env.NODE_ENV = conf.get('env');
}

conf.validate({
  strict: true
});
