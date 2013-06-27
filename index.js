
var angular = require('angularjs')
  , ffapi = require('ffapi')

  , template = require('./template');

var todoTypes = ['General', 'Find Record', 'Resolve Duplicates', 'Find Children'];

angular.module('new-todo', ['ffapi'])
  .directive('newTodo', function (ffapi) {
    return {
      scope: {},
      replace: true,
      restrict: 'A',
      template: template,
      link: function (scope, element, attrs) {
        var name = attrs.newTodo
          , pidName = attrs.personId;
        scope.todoType = todoTypes[0];
        scope.todoTypes = todoTypes;
        scope.todoDescription = '';
        scope.addTodo = function () {
          var todo = {
            completed: false,
            type: scope.todoType,
            title: scope.todoDescription,
            person: scope.$parent[pidName]
          };
          scope.todoType = todoTypes[0];
          scope.todoDescription = '';
          ffapi('todos/add', todo, function (data) {
            todo._id = data.id;
            todo.watching = false;
            todo.owned = true;
            if (!scope.$parent[name]) {
              throw new Error('trying to add a todo to a nonexistant todo list');
            }
            scope.$parent[name].push(todo);
            scope.$parent.$digest();
          });
        };
      }
    };
  });
