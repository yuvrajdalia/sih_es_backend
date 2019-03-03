var express = require('express');
var router = express.Router();

var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client({
  hosts: [
    'https://search-sih2019faq-bb7newgfkmtxmlnwtnpdc7c5vy.us-east-2.es.amazonaws.com:443'
  ]
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search-results', function(req, res) {
  search(req.body, function(data) {
    res.render('index', { title: 'Express', results: data });
  });
});

search = function(searchData, callback) {
  client.search({
    'index': 'faq-index',
    'type': 'faq-type',
    'body': {
      'query': {
        'bool': {
          'should': [
            { 'term' : {'question':searchData.searchTerm }}
          ]
        }
      }
    }}).then(function (resp) {
    callback(resp.hits.hits);
  }, function (err) {
    callback(err.message);
    console.log(err.message);
  });
};

module.exports = router;
