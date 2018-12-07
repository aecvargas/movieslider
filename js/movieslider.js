var mood_app = angular.module('movie_app', ['ngAnimate', 'ui.bootstrap']);

//================================================================//
// MoodSliderController which is called in the body of index.html //
//================================================================//
mood_app.controller('MovieSliderController',  ['$scope', '$http', '$uibModal', function($scope, $http, $uibModal)
{
    //==================================================//
    // Create an array to hold the films and attributes //
    //==================================================//
    $scope.films = []; 

    //=========================//
    // Set to false as default //
    //=========================//
    $scope.content_loaded = false;

    //=================================================//
    // When there's no content loaded, disable sliders //
    //=================================================//
    $scope.disable_slider = true;

    //=================================================//
    // To begin with they're set to no content values, //
    //  this is because nothing has been loaded yet    //
    //=================================================//
    $scope.films[0] =   {   image_path  : "images/no_content.png",
                            title       : "No Content"
                        };

    $scope.films[1] =   {   image_path  : "images/no_content.png",
                            title       : "No Content"
                        };

    $scope.films[2] =   {   image_path  : "images/no_content.png",
                            title       : "No Content"
                        };

    $scope.films[3] =   {   image_path  : "images/no_content.png",
                            title       : "No Content"
                        };

    $scope.films[4] =   {   image_path  : "images/no_content.png",
                            title       : "No Content"
                        };

    //=========================================//
    // Mood variables set to the default value //
    //=========================================//
    $scope.agitated_calm    = 2;   // agitated <2    | calm       >2
    $scope.happy_sad        = 2;   // happy    <2    | sad        >2
    $scope.tired_awake      = 2;;  // tired    <2    | awake      >2
    $scope.scared_fearless  = 2;   // scared   <2    | fearless   >2

    //==========================================//
    // This is called when the page first loads //
    //==========================================//
    $scope.initialize = function()
    {
        //=======================//
        // Nothing to initialize //
        //=======================//
    }

    //===============================================================//
    // This function handles the uploading of the data from the file //
    //===============================================================//
    $scope.upload_content = function()
    {
        //====================================================================//
        // This opens a modal instance which calls a template from index.html //
        //====================================================================//
        var modalInstance = $uibModal.open    ({    animation: false,
                                                    ariaLabelledBy: 'modal-title',
                                                    ariaDescribedBy: 'modal-body',
                                                    templateUrl: 'upload.html',
                                                    controller: 'UploadContentController',
                                                    controllerAs: '$controller',
                                                    size: 'lg',
                                                    backdrop: 'static',
                                                    keyboard: false
                                            });
        
        //===============================================================//
        // The result of the modal controller continues here when closed //
        //===============================================================//
        modalInstance.result.then(function (action) 
        {
            //===================================================//
            // Process the uploading of data from the file given //
            //===================================================//
            if(action == "upload")
            {
                //==========================================//
                // Retrieve file path from the input field //
                //=========================================//
                var file_path = document.getElementById('file_path').value;

                //================================================================================//
                // Browsers tend to add a fakepath when it's local so replace it with my own path //
                //================================================================================//
                file_path = "json/" + file_path.match(/[^\\/]*$/)[0];

                //====================================================//
                // This reads the file and retrieves the data from it //
                //====================================================//
                $http({
                    method: 'GET',
                    url: file_path
                })
                .then(function(success) {

                    //====================================//
                    // Enable sliders when content loaded //
                    //====================================//
                    $scope.disable_slider = false;

                    //===================================================//
                    // It resets the sliders everytime content is loaded //
                    //===================================================//
                    $scope.reset_sliders();

                    //====================================================//
                    // Replaces the no content array with the loaded data //
                    //====================================================//
                    $scope.films = success.data;

                    //==========================================================================//
                    // Upon uploading the whole array it shuffles it so the order is randomised //
                    //==========================================================================//
                    $scope.shuffleSelection();

                    //===========================//
                    // If a success, set to true //
                    //===========================//
                    $scope.content_loaded = true;

                }, function(error) {
                    console.log("Error: " + error);
                });
            }
        }, 
        function () {
            //==================================================================//
            // The result of the modal controller continues here when dismissed //
            //==================================================================//
        });
    }

    //====================================================================//
    // Shuffles the film selection so that they are in a randomised order //
    //====================================================================//
    $scope.shuffleSelection = function()
    {
        //=================================================================//
        // This function is always called everytime a slider changes value //
        //=================================================================//
        var index = $scope.films.length, tempvalue, randomindex;

        while(0 !== index)
        {
            randomindex = Math.floor(Math.random() * index);
            index -= 1;

            tempvalue = $scope.films[index];
            $scope.films[index] = $scope.films[randomindex];
            $scope.films[randomindex] = tempvalue;
        }

        return $scope.films;
    }

    //=========================================================//
    // This processes the film sections depending on mood values //
    //=========================================================//
    $scope.filmSelection = function(element)
    {
        //======================================//
        // Only run once the content has loaded //
        //======================================//
        if($scope.content_loaded)
        {
            //============================================================================================================================//
            // If mood value is not the neutral value then set the appropriate mood string depending on the value, otherwise set to blank //
            //============================================================================================================================//
            var mood1 = ($scope.agitated_calm   != 2) ? ($scope.agitated_calm     < 2)    ? "agitated"    : "calm"          : "";
            var mood2 = ($scope.happy_sad       != 2) ? ($scope.happy_sad         < 2)    ? "happy"       : "sad"           : "";
            var mood3 = ($scope.tired_awake     != 2) ? ($scope.tired_awake       < 2)    ? "tired"       : "wide awake"    : "";
            var mood4 = ($scope.scared_fearless != 2) ? ($scope.scared_fearless   < 2)    ? "scared"      : "fearless"      : "";
            
            //=========================================================================//
            // If all moods are set to default values then return a selection of films //
            //=========================================================================//
            if(($scope.agitated_calm    == 2)   && ($scope.happy_sad        == 2)
            && ($scope.tired_awake      == 2)   && ($scope.scared_fearless  == 2))
            {
                return true;
            }
            else
            {
                //=======================================================//
                //  If the array element mood matches the selected moods //
                // then return to display the array element in the table //
                //=======================================================//
                return  element.mood.toLowerCase() == mood1 ||
                        element.mood.toLowerCase() == mood2 ||
                        element.mood.toLowerCase() == mood3 ||
                        element.mood.toLowerCase() == mood4;
            }
        }
        else
        {
            //==========================================//
            // Return true to show a set film selection //
            //==========================================//
            return true;
        }
    }

    //=========================================//
    // Resets the slider to the default values //
    //=========================================//
    $scope.reset_sliders = function()
    {
        //====================================================//
        // Everytime the sliders are reset, shuffle selection //
        //====================================================//
        $scope.shuffleSelection();

        //================================//
        // Set back to the default values //
        //================================//
        $scope.agitated_calm    = 2;
        $scope.happy_sad        = 2;
        $scope.tired_awake      = 2;
        $scope.scared_fearless  = 2;
    }
}]);

//======================================================================//
// This is the upload content modal controller which handles the events //
//======================================================================//
angular.module('ui.bootstrap').controller('UploadContentController', function ($uibModalInstance) 
{
    var $controller = this;

    //=======================================================================//
    // Called when upload button is clicked, it closes and passes the action //
    //=======================================================================//
    $controller.upload = function()
    {
        //=======================================================================================================//
        // Validates that the path is not actually empty so it doesn't allow an upload unless a file is selected //
        //=======================================================================================================//
        if((document.getElementById('file_path').value != "") && (document.getElementById('file_path').value != null))
        {
            $uibModalInstance.close("upload");
        }
    }

    //==============================================================//
    // When cancelled is clicked, the modal is completely dismissed //
    //==============================================================//
    $controller.cancel = function()
    {
        $uibModalInstance.dismiss();
    }
});