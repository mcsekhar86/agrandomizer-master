
var app = angular.module('newsApp', []);

app.controller('newsCtrl', function($scope) {


  $scope.currentSite = 1;

  var prevPrefs = localStorage.getObject('sitePrefs');

  if(prevPrefs !== null)
  {
    $scope.websites = prevPrefs;
  }
  else {
      $scope.websites = [

        {
            "id" : 1,
            "name" : "CNN",
            "url" : "http://www.cnn.com",
            "priority": 1

        },

        {
            "id" : 2,
            "name" : "BBC News",
            "url" : "http://www.bbc.com",
            "priority" : 1

        },
        {
            "id" : 3,
            "name" : "NY Times",
            "url" : "http://www.nytimes.com",
            "priority" : 1
        },
        {
            "id" : 4,
            "name" : "The Mirror",
            "url" : "http://www.mirror.co.uk",
            "priority" : 1
        },
        {
            "id" : 5,
            "name" : "NY Post",
            "url" : "http://www.nypost.com",
            "priority" : 1
        },
        {
            "id" : 6,
            "name" : "Daily Mail",
            "url" : "http://www.dailymail.co.uk",
            "priority" : 1

        }];
      }
 $scope.includeIframes = false;
 $scope.loadRandomSite = function() {
    var randomInt = Math.floor((Math.random() * $scope.websites.length));
    window.open($scope.websites[randomInt].url);
 };
 $scope.allowRefresh = false;
 function findSite(siteNum)
 {
   for(x = 0; x < $scope.websites.length; x++)
   {
     var curPos = $scope.websites[x].position;
     if(curPos !== undefined && curPos == siteNum)
     {
       return $scope.websites[x];
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
   }
};


 $scope.selectedSites = [];

 //sitNum



 $scope.selectedSites.push(findSite(1));
 $scope.selectedSites.push(findSite(2));
 $scope.selectedSites.push(findSite(3));

  /*document.getElementById('src'+$scope.currentSite).src = $scope.websites[$scope.currentSite].url;*/
  $scope.positionChange = function(position) {
    localStorage.setObject('sitePrefs',$scope.websites);
    $('#site'+position).html('<iframe src="'+$scope.websites[$scope.currentSite-1].url+'"> Stand By </iframe>');
  };


  $scope.changeList = function(position,siteId)
  {
    window.stop();
    $scope.websites[siteId-1].position = position;

    for(i=0; i < $scope.websites.length; i++)
    {
      if($scope.websites[i].position == position && $scope.websites[i].id != siteId)

      {
        $scope.websites[i].position = "";
      }
      else if ($scope.websites[i].id == siteId && $scope.websites[i].position != position)
      {
        $scope.selectedSites[position-1] = "";
      }

    }
    if($scope.includeIframes) {
      setLink($("#site"+position),findSite(position).id-1,false);
    }
    localStorage.setObject('sitePrefs',$scope.websites);


  }

  function setLink(obj, projectId, insert)
  {
    if(insert)
      obj.append('<iframe src="'+$scope.websites[projectId].url+'"> Stand By </iframe>');
    else {
      obj.html('<iframe src="'+$scope.websites[projectId].url+'"> Stand By </iframe>');
    }
  }

  window.onLoad = function() {
    $scope.currentSite++;
      $('#site'+$scope.currentSite).append('<iframe src="'+$scope.websites[$scope.selectedSites[$scope.currentSite-1]-1].url+'" onload="onLoad()"> Stand By </iframe>');
  };

      $scope.selectedRow = "";
      $scope.setClickedRow = function(index) {
        $scope.selectedRow = index;
      };

    

    $scope.addRow = function() {


      $scope.websites.push(  {
            "id" : $scope.websites[$scope.websites.length-1].id + 1,
            "name" : "",
            "url" : "",
            "position" : ""

        });
        console.log(JSON.stringify($scope.websites));
        localStorage.setObject('sitePrefs',$scope.websites);

    };

    $scope.deleteRow = function() {
      $scope.websites.splice($scope.selectedRow, 1);
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
          console.log('Before '+ JSON.stringify($scope.websites));
          var randomWindow = Math.floor((Math.random() * 3)+1);
           var randomInt = Math.floor((Math.random() * $scope.websites.length));
           console.log('Randomly want to change ' + randomWindow + ' to '  + $scope.websites[randomInt].name);

           for(i=0; i<$scope.websites.length;i++) {
             if($scope.websites[i].position == randomWindow)
                $scope.websites[i].position = "";
           }
           $scope.websites[randomInt].position = randomWindow;
           $scope.selectedSites[randomWindow-1] = findSite(randomWindow);
           if($scope.includeIframes)
           {
             setLink($("#site"+randomWindow), randomInt, false);
           }
           $scope.$apply();



          console.log('After ' + JSON.stringify($scope.websites));
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
