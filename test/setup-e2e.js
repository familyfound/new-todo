
var angular = require('angularjs')
  , newTodo = require('new-todo')

  , log = require('domlog');

log.init();

angular.module('test', ['new-todo'])
  .factory('ffapi', function () {
    return function (name, params, next) {
      log('call made', name, params, next);
      if (name == 'todos/add') {
        setTimeout(function () {
          next({id: '234tre'});
        }, 0);
      }
    };
  });

function Test($scope) {
  $scope.todos = [];
}
