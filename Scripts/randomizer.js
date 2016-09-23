function setDropdownWidth()
{
$("#selectList").css({'width':($("#maintable").width()+'px')});
}
$(document).ready(function() {
  setDropdownWidth();
  $(window).resize(function() {
      setDropdownWidth();
  });
});
var app = angular.module('randomApp', []);


app.controller('randomCtrl', function($scope, $timeout) {

  $scope.isIos = false;
  var p = navigator.platform;
  if( p === 'iPad' || p === 'iPhone' || p === 'iPod' ) {
     $scope.isIos = true;
  }


  function cloneArray(originalArray)
  {
    var clonedArray = $.map(originalArray, function (obj) {
                      return $.extend(true, {}, obj);
                  });
    return clonedArray;
  }

  var defaultItems = [{id: 1, name: 'First', priority: 2}, {id: 2, name: 'Second', priority: 1}];


  $scope.lists = localStorage.getObject('savedLists');


  $scope.lists = JSON.parse(JSON.stringify($scope.lists).split('"position":').join('"id":'));


  if($scope.lists == null || $scope.lists.length == 0) {
    $scope.lists = [];
    $scope.lists.push({listId: '0', listName: 'Default List', items: cloneArray(defaultItems)});
  }


  $scope.turnOnAdd = false;
  var mode = '';
  $scope.toggleAdd = function() {
    $scope.turnOnAdd = true;
    mode = 'Add';
    $scope.newListName = 'New List';
  };
  $scope.toggleRename = function() {
    $scope.turnOnAdd = true;
    mode = 'Rename';
    $scope.newListName = $scope.lists[$scope.selectedListId].listName;
  };
  $scope.selectedListId = '0';
  var currentItems = $scope.lists[0].items;

  $scope.maxTime = 60;
  $scope.hideButtons = true;
  $scope.numOfItems = 1;



 $scope.selectedIndex = null;
 $scope.selectedRow = null;  // initialize our variable to null
 $scope.setClickedRow = function(index){  //function that sets the value of selectedRow to current index

    $scope.selectedRow = index;

    $scope.hideButtons = false;
 };


 $scope.showReloadTextArea = false;

 $scope.toggleCachedList = function(){
   $scope.showReloadTextArea = !$scope.showReloadTextArea;
 }

 $scope.reloadJson = function() {
   localStorage.setObject('savedLists', JSON.parse($scope.previousJson));
   location.reload(true);
 };

 $scope.changeList = function() {


     currentItems = $scope.lists[$scope.selectedListId].items;

 };
 $scope.copyClipboard = function() {
   var pastedText = JSON.stringify($scope.lists);
   var $temp = $("<input type='textbox' class='reloadTextArea'>");
   $("#tempholder").append($temp);
   $scope.previousJson = pastedText;
   $(".reloadTextArea").select();
   document.execCommand("copy");


   $scope.showReloadTextArea = true;
   $temp.remove();


   $scope.pasteText = 'Copied';
 };


  $scope.addList = function() {
      if(mode=='Add')
      {
        $scope.lists.push({listId: $scope.lists.length, listName: $scope.newListName, items: cloneArray(defaultItems)});
        $scope.selectedListId = ($scope.lists.length -1).toString();
        $scope.changeList();

      }
      else
      {
        $scope.lists[$scope.selectedListId].listName = $scope.newListName;
      }
      $scope.turnOnAdd = false;
      $scope.lastSaved = 'Click Save list to save Changes';
  };

  $scope.deleteList = function() {
     var confirmAnswer = confirm('Are you sure you want to remove this list?');
     if(!confirmAnswer)
        return;

      $scope.lastSaved = 'Click Save list to confirm delete';
      $scope.lists.splice($scope.selectedListId, 1);
      var id =0 ;
      angular.forEach($scope.lists, function(value, key) {
        value.listId = id;
        id++;
      });

      $scope.selectedListId = '0';
      $scope.changeList();
  };

  $scope.deleteAllLists = function() {
    localStorage.removeItem('savedLists');
    location.reload();
  };

  $scope.saveItems = function() {

      localStorage.setObject('savedLists', $scope.lists);
      var currentdate = new Date();
      $scope.lastSaved = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

  };
  $scope.undoChanges = function() {
    location.reload();
  };

  $scope.reorderPriorities = function()
  {
    var item = [];
    var currentPriority = currentItems.length;

    angular.forEach(currentItems, function(value, key) {
      //value.priority = currentPriority;
      //currentPriority--;

    }, item);
  };

  $scope.removeItem = function() {
    debugger;
    currentItems.splice($scope.selectedRow, 1);
    $scope.reorderPriorities();
  }

  $scope.moveUp = function() {
    if($scope.selectedRow-1 >= 0) {
      var previtemRow = currentItems[$scope.selectedRow-1];
      currentItems[$scope.selectedRow-1] = currentItems[$scope.selectedRow];
      currentItems[$scope.selectedRow] = previtemRow;
      $scope.selectedRow--;
      $scope.reorderPriorities();
    }
  };

  $scope.moveDown = function() {
      if($scope.selectedRow+1 < currentItems.length) {
      var nextitemRow = currentItems[$scope.selectedRow+1];
      currentItems[$scope.selectedRow+1] = currentItems[$scope.selectedRow];
      currentItems[$scope.selectedRow] = nextitemRow;
      $scope.selectedRow++;
      $scope.reorderPriorities();
    }
  };

  $scope.moveToBottom = function() {
      currentItems[$scope.selectedRow].priority = 0;
      $scope.chosenSort = "D";
      $scope.sortItems();
      $scope.selectedRow = currentItems.length-1;
  }
  $scope.moveToTop = function() {
      maxpriority = currentItems.length;
      for(i=0;i<currentItems.length;i++)
      {
        if(currentItems[i].priority > maxpriority)
          maxpriority = currentItems[i].priority;
      }
      currentItems[$scope.selectedRow].priority = maxpriority+1;
      $scope.chosenSort = "D";
      $scope.sortItems();
      $scope.selectedRow = 0;
  }

  $scope.singleClickUp = function() {
    if ($scope.clicked) {
        $scope.cancelClick = true;
        return;
    }

    $scope.clicked = true;

    $timeout(function () {
        if ($scope.cancelClick) {
            $scope.cancelClick = false;
            $scope.clicked = false;
            return;
        }

        $scope.moveUp();

        //clean up
        $scope.cancelClick = false;
        $scope.clicked = false;
    }, 500);
  }

  $scope.singleClickDown = function() {
    if ($scope.clicked) {
        $scope.cancelClick = true;
        return;
    }

    $scope.clicked = true;

    $timeout(function () {
        if ($scope.cancelClick) {
            $scope.cancelClick = false;
            $scope.clicked = false;
            return;
        }

        $scope.moveDown();

        //clean up
        $scope.cancelClick = false;
        $scope.clicked = false;
    }, 500);
  }

  $scope.addRow = function() {
    currentItems.push({ 'id':currentItems.length+1, 'name': $scope.newRecord, 'priority': 1});
    $scope.reorderPriorities();
    $scope.saveItems();
    $scope.newRecord = '';
  };
  $scope.chosenWeight = "D";


  $scope.setWeight = function() {
    if($scope.chosenWeight == "E")
    {
      for(i = 0; i < currentItems.length; i++)
      {
        currentItems[i].priority = 1;
      }
    }
    else if($scope.chosenWeight=="I")
    {

      for(i = 0; i < currentItems.length; i++)
      {
        currentItems[i].priority = i+1;
      }
    }
    else
    {
      for(i = 0; i < currentItems.length; i++)
      {
        currentItems[i].priority = currentItems.length - i;
      }
    }

  }


  $scope.sortItems = function() {
    currentItems = currentItems.sort(function(x,y) {
        if($scope.chosenSort=="A")
          return x.priority - y.priority;
        else
          return y.priority - x.priority;
    });
  };

  $scope.generateRandomItems = function() {


      $scope.randomlyGeneratedItems = [];

      var copyItems = currentItems.slice();

      for(x=0; x< $scope.numOfItems; x++)
      {
        debugger;
        var numItems = 0;
        for(i = 0; i< copyItems.length; i++)
        {
          numItems += copyItems[i].priority;
        }
        var randomInt = Math.floor((Math.random() * numItems ) + 1);
        //$scope.randomitem = currentItems[randomInt-1].name;
        var currentIterator = 0;
        for(i = 0; i < copyItems.length; i++)
        {
          currentIterator += copyItems[i].priority;
          if(currentIterator >= randomInt)
            break;
        }
        $scope.randomlyGeneratedItems.push({'name': copyItems[i].name, 'priority': copyItems[i].priority, 'time': 0});
        copyItems.splice(i,1);
      }

      //Ensure full time is used
      var total = 0;
      angular.forEach($scope.randomlyGeneratedItems, function(value, key) {
        total += value.priority;
      });

      angular.forEach($scope.randomlyGeneratedItems, function(value, key) {
        value.time = Math.floor(value.priority / total * $scope.maxTime);
      });


  };



});
