
$(document).ready(function(event) {

	// gif topic array
	var topics = ["Donald Trump", "funny animals", "1980's cartoons", "movies", "fastest cars", "football", "landmarks", "web development"];

	// Initial Ajax call
	$.ajax({
		url: "https://api.giphy.com/v1/gifs/search?q=funny&api_key=dc6zaTOxFJmzC&limit=10",
        method: "GET"
	}).done(function (topicGIF) {
		ajaxResponse(topicGIF);
	});

	//removes message until needed
	$("#playOrFreeze").hide();

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
        	topicButton.css("outline", "none"); //had to put outline: none here because does not work in css file
        	topicButton.css("text-transform", "capitalize");

        	$("#buttonsDiv").append(topicButton);
		}
	}

	//Display topics using giphy API
	function displayTopics() {

		//removes any messages
		$("#message").html("");

		//Get the topic from the button clicked and add to the URL
		var topicName = $(this).attr("data-name");
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topicName + "&api_key=dc6zaTOxFJmzC&limit=10";
	
		// Ajax call
		$.ajax({
			url: queryURL,
        	method: "GET"
		}).done(function (topicGIF) {

				// Empty section before displaying gifs
				$("#gifs").empty();

				if (topicGIF.data.length > 0 ) {

					ajaxResponse(topicGIF);
				}	
				 	
					else {

							$("#message").html("No gifs match your search. Please try another button.");
					}
		});
	}

	//handles response received from ajax call
	function ajaxResponse(response) {
		for (var j = 0; j < response.data.length; j++) {
			// Create html elements 
			var topicDiv = $("<div class='topicDiv pull-left'>");
			var p = $("<p>");
			var topicImg = $("<img>");
				
			// Set image attributes 
			topicImg.addClass("topicImg");
			topicImg.attr("data-state","still");
			topicImg.attr("data-still", response.data[j].images.fixed_height_still.url);
			topicImg.attr("data-animate", response.data[j].images.fixed_height.url);
			
			// Get the image url and its rating	
			p.text("Rating : " + response.data[j].rating);
			topicImg.attr("src",response.data[j].images.fixed_height_still.url);

			// Append image and its rating
			topicDiv.append(topicImg);
			topicDiv.append(p);
			$("#gifs").append(topicDiv);
			$("#playOrFreeze").show();
		}
	}

	// animates and freezes gifs
	function animateGifs() {

		// Get the attributes of clicked image
		var state = $(this).attr("data-state");
		var animate = $(this).attr("data-animate");
		var still = $(this).attr("data-still");

		//Change url based on state
		if(state !== 'still'){
			$(this).attr("src", still);
			$(this).attr("data-state",'still');

			}	else{
					$(this).attr("src",animate);
					$(this).attr("data-state",'animate');
				}
	}

	// Render button for each animal on page load
	renderButton();

	// when click submitButton, add user typed topic to array
	$("#submitButton").on("click", function(event) {
		event.preventDefault();
		//Get user input
		var newTopic = $("#searchInput").val().trim();
		$("#message").html("");
		// If user input has a unique value, append it to the array and call the renderButton function
		if(newTopic){
			if (!topics.includes(newTopic.toLowerCase())) {
				topics.push(newTopic.toLowerCase());
				renderButton();
			} 	else {
					$("#message").html("Oops. That button already exists.");
				}
		}

		// Clear the input field after rendering
		$("#searchInput").val("");
	});

	//clears difs and buttons
	$("#clearGifButton").on("click", function(clickEvent) {
		$("#buttonsDiv").empty();
		$("#playOrFreeze").hide();
		$("#gifs").empty();
		$("#message").html("");
		topics = [];
	});

	// When clicking on any of the button in the animal list, call displayAnimals to display animals
	$(document).on("click", ".topicButton", displayTopics);

	// When click on any of image displayed, call animateAnimals function to animate
	$(document).on("click", ".topicImg", animateGifs);

});

