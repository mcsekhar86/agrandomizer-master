var app = angular.module('newsApp', []);



app.controller('newsCtrl', ['$scope', '$window', '$log', function($scope, $window, $log) {

  function loadDefaultPrefs()
  {
    $scope.currentPrefs = {};
    $scope.currentPrefs.panels = [0,1,2];
    $scope.currentPrefs.websites = [
      {
          "id" : 0,
          "name" : "CNN",
          "url" : "http://www.cnn.com",
          "priority": 1

      },
      {
          "id" : 1,
          "name" : "BBC News",
          "url" : "http://www.bbc.com",
          "priority" : 1

      },
      {
          "id" : 2,
          "name" : "NY Times",
          "url" : "http://www.nytimes.com",
          "priority" : 1
      },
      {
          "id" : 3,
          "name" : "The Mirror",
          "url" : "http://www.mirror.co.uk",
          "priority" : 1
      },
      {
          "id" : 4,
          "name" : "NY Post",
          "url" : "http://www.nypost.com",
          "priority" : 1
      },
      {
          "id" : 5,
          "name" : "Daily Mail",
          "url" : "http://www.dailymail.co.uk",
          "priority" : 1

      }];
  }

  var prevPrefs = localStorage.getObject('bookmarkPrefs');
  if(prevPrefs !== null)
  {
    $scope.currentPrefs = prevPrefs;
  }
  else {
      loadDefaultPrefs();
    }
    $scope.panels = $scope.currentPrefs.panels;
    $scope.websites = $scope.currentPrefs.websites;

    $scope.saveBookmarks = function() {
      localStorage.setObject('bookmarkPrefs',$scope.currentPrefs);
    };

    $scope.addRow = function() {
      $scope.websites.push(  {
            "id" : $scope.websites[$scope.websites.length-1].id + 1,
            "name" : "",
            "url" : "",
            "priority" : 1
        });
        console.log(JSON.stringify($scope.websites));
    };

    $scope.deleteRow = function() {
      $scope.websites.splice($scope.selectedRow, 1);
    }

    $scope.selectedRow = "";
    $scope.setClickedRow = function(index) {
      $scope.selectedRow = index;
    };

    $scope.clearPreviousCache = function() {
      localStorage.removeItem('bookmarkPrefs');
      alert('Cached Cleared');
      location.reload();
    };
    function getRandomSite() {
      var sum = 0;
      for(var i=0; i<$scope.websites.length; i++)
      {
        sum += $scope.websites[i].priority;
      }
      var randomInt = Math.floor((Math.random() * sum));
      console.log('Random int is '+randomInt);
      var newIterator = 0;
      for(var siteId = 0; siteId < $scope.websites.length; siteId++)
      {
        newIterator += $scope.websites[siteId].priority;
        if(newIterator>randomInt)
        {
          return siteId;
        }
      }
      return $scope.websites.length - 1;

    }
    $scope.showCurrentMultipier = false;
    //TODO highest priority don't list
    //TODO renable iframe
    //TODO sort feature
    //TODO export bookmarkPrefs

    function sortItems(items, field, direction) {
        items.sort(function(x,y) {
          if(direction === "desc") {
            return y[field] - x[field];
          }
          else
            return x[field] - y[field];
        });
    };
    $scope.siteSortClass = "fa fa-fw fa-sort";

    
    $scope.navigateToSite = function(siteIndex) {
      var copyItems = angular.copy($scope.websites);
      sortItems(copyItems, 'priority','desc');
      var currentPriority = $scope.websites[siteIndex].priority;

      var currentMax = copyItems[0].priority;
      if(currentMax > currentPriority) {
        $scope.websites[siteIndex].priority += 5;
      }
      else if(currentMax === currentPriority &&
        copyItems.length > 1 && copyItems[1].priority == currentPriority)
        {
          $scope.websites[siteIndex].priority += 5;
        }

        $scope.saveBookmarks();
    }
    $scope.loadRandomSite = function() {
      var randomSiteIndex  = getRandomSite();
      var currentPriority = $scope.websites[randomSiteIndex].priority;
      $scope.websites[randomSiteIndex].priority = (currentPriority <= 5) ? 1 :   currentPriority -= 5;
       $window.open($scope.websites[randomSiteIndex].url,'_blank');

       for(var i = 0; i<$scope.websites.length; i++)
       {
         if($scope.websites[i].priority <= currentPriority
           && randomSiteIndex != i)
          $scope.websites[i].priority += 2;
       }

    };



}]);
