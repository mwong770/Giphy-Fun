// gif topic array
var topics = ["Donald Trump", "funny animals", "1980's cartoons", "movies", "fastest cars", "football", "landmarks", "web development"];

// create topic buttons and display on screen
function renderButton() {

	// current gifs before making buttons
	$("#buttonsDiv").empty();

	//create a button for each array element
	for(var i = 0; i < topics.length; i++){

		var topicButton = $("<button class='btn btn-primary'>");

		topicButton.addClass("topicButton");
		topicButton.attr("data-name", topics[i]);
        topicButton.text(topics[i]);

        $("#buttonsDiv").append(topicButton);
	}
}

//Display topics using giphy API
function displayTopics(){

	//Get the topic from the button clicked and add to the URL
	var topicName = $(this).attr("data-name");
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topicName + "&api_key=dc6zaTOxFJmzC&limit=10";
	
	// Ajax call
	$.ajax({
		url: queryURL,
        method: "GET"
	}).done(function (topicGIF){

		// Empty section before displaying gifs
		$("#gifs").empty();

		for(var j = 0; j < topicGIF.data.length; j++){

			// Create html elements 
			var topicDiv = $("<div class='topicDiv pull-left'>");
			var p = $("<p>");
			var topicImg = $("<img>");

			// Set image attributes 
			topicImg.addClass("topicImg");
			topicImg.attr("data-state","still");
			topicImg.attr("data-still", topicGIF.data[j].images.fixed_height_still.url);
			topicImg.attr("data-animate", topicGIF.data[j].images.fixed_height.url);
			
			// Get the image url and its rating
			p.text("Rating : " + topicGIF.data[j].rating);
			topicImg.attr("src",topicGIF.data[j].images.fixed_height_still.url);

			// Append image and its rating
			topicDiv.append(topicImg);
			topicDiv.append(p);
			$("#gifs").append(topicDiv);
		}
		
	});
}

// animates and freezes gifs
function animateGifs(){

	// Get the attributes of clicked image
	var state = $(this).attr("data-state");
	var animate = $(this).attr("data-animate");
	var still = $(this).attr("data-still");

	//Change url based on state
	if(state !== 'still'){
		$(this).attr("src", still);
		$(this).attr("data-state",'still');

	}else{
		$(this).attr("src",animate);
		$(this).attr("data-state",'animate');
	}

}

// when click submitButton, add user typed topic to array
$("#submitButton").on("click", function(){

	//Get user input
	var newTopic = $("#searchTerm").val().trim();

	// If user input has a value, append to the topic array and call the renderButton function
	if(newTopic){
		topics.push(newTopic);
		renderButton();
	}	

	// Clear the input field after rendering
	$("#searchTerm").val("");
});

// When clicking on any of the button in the animal list, call displayAnimals to display animals
$(document).on("click", ".topicButton", displayTopics);

// When click on any of image displayed, call animateAnimals function to animate
$(document).on("click", ".topicImg", animateGifs);

// Render button for each animal on page load
renderButton();