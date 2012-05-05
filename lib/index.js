var config = require('../config')
  , redis = config.redisClient
  , myconsole = require('myconsole')
  , crypto = require('crypto')
  , async = require('async');
