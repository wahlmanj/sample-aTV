function handleActionButtonClicked(id) 
{
    try
    {
        var button = document.getElementById(id);
        var title = button.getElementByTagName('title');
        if ( title.textContent == "Add" )
        {
            title.textContent = "Remove";
            button.setAttribute("accessibilityLabel", "Remove from wishlist");
        } 
        else 
        {
            title.textContent = "Add";
            button.setAttribute("accessibilityLabel", "Add to wishlist");
        }
    }
    catch(error)
    {
        console.log("Caught exception trying to toggle DOM element: " + error);
    }
}

function handleRateButtonPressed()
{
    console.debug("Rate button pressed.");

    var starRatingElement = document.rootElement.getElementByTagName("starRating");
    var percentageElement = starRatingElement.getElementByTagName("percentage");

    var rate = new atv.RatingControl();
    rate.rating = percentageElement.textContent / 100; // between 0 and 1
    rate.title = document.evaluateXPath("//itemDetail/title")[0].textContent;
    rate.hasUserSetRating = starRatingElement.getAttribute("hasUserSetRating") == "true"; // select yellow or orange stars.

    rate.onRate = function(selectedRating) {
        console.log("Rating set to " + selectedRating);
        starRatingElement.setAttribute("hasUserSetRating", "true");
        percentageElement.textContent = 100 * selectedRating;

    }
    rate.onCancel = function() {
        console.debug("The user menued out.");
    }
    rate.show();
}
