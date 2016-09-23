
var app = angular.module('newsApp', []);

app.controller('newsCtrl', function($scope) {


  $scope.currentSite = 1;

  var prevPrefs = localStorage.getObject('sitePrefs');

  if(prevPrefs != null)
  {
    $scope.projects = prevPrefs;
  }
  else {
      $scope.projects = [

        {
            "id" : 1,
            "name" : "CNN",
            "url" : "http://www.cnn.com",
            "position" : 1

        },

        {
            "id" : 2,
            "name" : "BBC News",
            "url" : "http://www.bbc.com",
            "position" : 2

        },
        {
            "id" : 3,
            "name" : "Fox News",
            "url" : "http://www.foxnews.com",
            "position" : 3
        },
        {
            "id" : 4,
            "name" : "The Mirror",
            "url" : "http://www.mirror.co.uk",

        },
        {
            "id" : 5,
            "name" : "NY Post",
            "url" : "http://www.nypost.com",

        },
        {
            "id" : 6,
            "name" : "Daily Mail",
            "url" : "http://www.dailymail.co.uk",

        }];
      }
 $scope.includeIframes = false;
 $scope.loadRandomSite = function() {
    var randomInt = Math.floor((Math.random() * $scope.projects.length));
    window.open($scope.projects[randomInt].url);
 };
 $scope.allowRefresh = false;
 function findSite(siteNum)
 {
   for(x = 0; x < $scope.projects.length; x++)
   {
     var curPos = $scope.projects[x].position;
     if(curPos != undefined && curPos == siteNum)
     {
       return $scope.projects[x];
     }
   }
 }
$scope.toggleIframes = function() {
   if(!$scope.includeIframes)
   {
     $(".box").height(50);
     $("#site1").html();
     $("#site2").html();
     $("#site3").html();
   }
   else
   {
     $(".box").height(800);
     setLink($("#site1"),findSite(1).id-1,false);
     setLink($("#site2"),findSite(2).id-1,false);
     setLink($("#site3"),findSite(3).id-1,false);
     setTimeout(function() {
        window.stop();
     },10000);
   }
};


 $scope.selectedSites = [];

 //sitNum



 $scope.selectedSites.push(findSite(1));
 $scope.selectedSites.push(findSite(2));
 $scope.selectedSites.push(findSite(3));

  /*document.getElementById('src'+$scope.currentSite).src = $scope.projects[$scope.currentSite].url;*/
  $scope.positionChange = function(position) {
    $('#site'+position).html('<iframe src="'+$scope.projects[$scope.currentSite-1].url+'"> Stand By </iframe>');
  };


  $scope.changeList = function(position,siteId)
  {
    window.stop();
    $scope.projects[siteId-1].position = position;

    for(i=0; i < $scope.projects.length; i++)
    {
      if($scope.projects[i].position == position && $scope.projects[i].id != siteId)

      {
        $scope.projects[i].position = "";
      }
      else if ($scope.projects[i].id == siteId && $scope.projects[i].position != position)
      {
        $scope.selectedSites[position-1] = "";
      }

    }
    if($scope.includeIframes) {
      setLink($("#site"+position),findSite(position).id-1,false);
    }
    localStorage.setObject('sitePrefs',$scope.projects);


  }

  function setLink(obj, projectId, insert)
  {
    if(insert)
      obj.append('<iframe src="'+$scope.projects[projectId].url+'"> Stand By </iframe>');
    else {
      obj.html('<iframe src="'+$scope.projects[projectId].url+'"> Stand By </iframe>');
    }
  }

  window.onLoad = function() {
    $scope.currentSite++;
      $('#site'+$scope.currentSite).append('<iframe src="'+$scope.projects[$scope.selectedSites[$scope.currentSite-1]-1].url+'" onload="onLoad()"> Stand By </iframe>');
  };

      $scope.selectedRow = "";
      $scope.setClickedRow = function(index) {
        $scope.selectedRow = index;
      };


    $scope.addRow = function() {


      $scope.projects.push(  {
            "id" : $scope.projects[$scope.projects.length-1].id + 1,
            "name" : "",
            "url" : "",
            "position" : ""

        });
        console.log(JSON.stringify($scope.projects));

    };

    $scope.deleteRow = function() {
      $scope.projects.splice($scope.selectedRow, 1);
    }

    $scope.clearPreviousCache = function() {
      localStorage.removeItem('sitePrefs');
      alert('Cached Cleared');
      location.reload();
    };

    setTimeout(function() {
        window.stop();
    }, 3000);

    $scope.currentTimer = "";
    $scope.refreshInterval = 10000;

    function setupInterval() {
      $scope.currentTimer =  setInterval(function(){
          window.stop();
          console.log('Before '+ JSON.stringify($scope.projects));
          var randomWindow = Math.floor((Math.random() * 3)+1);
           var randomInt = Math.floor((Math.random() * $scope.projects.length));
           console.log('Randomly want to change ' + randomWindow + ' to '  + $scope.projects[randomInt].name);

           for(i=0; i<$scope.projects.length;i++) {
             if($scope.projects[i].position == randomWindow)
                $scope.projects[i].position = "";
           }
           $scope.projects[randomInt].position = randomWindow;
           $scope.selectedSites[randomWindow-1] = findSite(randomWindow);
           if($scope.includeIframes)
           {
             setLink($("#site"+randomWindow), randomInt, false);
           }
           $scope.$apply();



          console.log('After ' + JSON.stringify($scope.projects));
          console.log(JSON.stringify($scope.selectedSites));


        }, $scope.refreshInterval);
    }
    $scope.changeRefresh = function() {
      clearInterval($scope.currentTimer);
      $scope.currentTimer = setupInterval();
    }


    $scope.toggleRefresh = function() {
      if($scope.allowRefresh)
      {
        setupInterval();
      }
      else {

          clearInterval($scope.currentTimer);
        }
    };

})
.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
