
var angular = require('angularjs')
  , ffapi = require('ffapi')

  , template = require('./template');

var todoGroups = [
  'General',
  {
    name: 'Data Cleanup',
    items: [
      'Cleanup dates and places',
      'Merge & resolve duplicates'
    ]
  }, {
    name: 'Relationships',
    items: [
      'Find spouse',
      'Find missing children',
      'Find parents',
      'Resolve duplicate / conflicting parents'
    ]
  }, {
    name: 'Sources',
    items: [
      'Find in census',
      'Find birth record',
      'Find death record',
      'Find marriage record',
      'Find gravestone'
    ]
  }
];

var todoTypes = [];
for (var i=0; i<todoGroups.length; i++) {
  if (typeof(todoGroups[i]) === 'string') {
    todoTypes.push({value: todoGroups[i]});
    continue;
  }
  for (var j=0; j<todoGroups[i].items.length; j++) {
    todoTypes.push({value: todoGroups[i].items[j], group: todoGroups[i].name});
  }
}

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
        scope.$watch('todoType', function (value, old) {
          if (value === old || !value) return;
          element.find('input')[0].focus();
        });
        scope.todoTypes = todoTypes;
        scope.todoDescription = '';
        scope.addTodo = function () {
          var todo = {
            completed: false,
            type: scope.todoType.value,
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
