
$(document).ready(function(event) {

	// saves topics in array
	var topics = ["donald trump", "funny animals", "1980's cartoons", "movies", "fastest cars", "football", "landmarks", "web development"];

	// makes initial AJAX call
	$.ajax({
		url: "https://api.giphy.com/v1/gifs/search?q=funny&api_key=dc6zaTOxFJmzC&limit=10",
        method: "GET"
	}).done(function (topicGIF) {
		ajaxResponse(topicGIF);
	});

	// removes message until needed
	$("#playOrFreeze").hide();

	// creates topic buttons and displays them on screen
	function renderButton() {

		// empties current gifs before making buttons
		$("#buttonsDiv").empty();

		// creates a button for each array element
		for(var i = 0; i < topics.length; i++){

			var topicButton = $("<button class='btn btn-primary'>");

			topicButton.addClass("topicButton");
			topicButton.attr("data-name", topics[i]);
        	topicButton.text(topics[i]);
        	topicButton.css("outline", "none"); 
        	topicButton.css("text-transform", "capitalize");

        	$("#buttonsDiv").append(topicButton);
		}
	}

	// displays topics using giphy API
	function displayTopics() {

		// removes any messages
		$("#message").html("");

		// gets the topic from the button clicked and adds it to the URL
		var topicName = $(this).attr("data-name");
		var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topicName + "&api_key=dc6zaTOxFJmzC&limit=10";
	
		// makes an AJAX call
		$.ajax({
			url: queryURL,
        	method: "GET"
		}).done(function (topicGIF) {

				// empties section before displaying gifs
				$("#gifs").empty();

				if (topicGIF.data.length > 0 ) {

					ajaxResponse(topicGIF);
				}	
				 	
					else {

							$("#message").html("No gifs match your search. Please try again.");
							$("#playOrFreeze").hide();
					}
		});
	}

	// handles response received from AJAX call
	function ajaxResponse(response) {
		for (var j = 0; j < response.data.length; j++) {
			// creates html elements 
			var topicDiv = $("<div class='topicDiv pull-left'>");
			var p = $("<p>");
			var topicImg = $("<img>");
				
			// sets image attributes 
			topicImg.addClass("topicImg");
			topicImg.attr("data-state","still");
			topicImg.attr("data-still", response.data[j].images.fixed_height_still.url);
			topicImg.attr("data-animate", response.data[j].images.fixed_height.url);
			
			// gets the image url and it's rating	
			p.text("Rating : " + response.data[j].rating);
			topicImg.attr("src",response.data[j].images.fixed_height_still.url);

			// appends image and it's rating
			topicDiv.append(topicImg);
			topicDiv.append(p);
			$("#gifs").append(topicDiv);
			$("#playOrFreeze").show();
		}
	}

	// animates and freezes gifs
	function animateGifs() {

		// gets the attributes of clicked image
		var state = $(this).attr("data-state");
		var animate = $(this).attr("data-animate");
		var still = $(this).attr("data-still");

		// changes url based on state
		if(state !== "still"){
			$(this).attr("src", still);
			$(this).attr("data-state","still");

			}	else{
					$(this).attr("src", animate);
					$(this).attr("data-state", "animate");
				}
	}

	// renders button for each animal on page load
	renderButton();

	// when click submitButton, adds user typed topic to array
	$("#submitButton").on("click", function(event) {
		event.preventDefault();
		// gets user input
		var newTopic = $("#searchInput").val().trim();
		$("#message").html("");
		// if user input has a unique value, appends it to the array and calls the renderButton function
		if(newTopic){
			if (!topics.includes(newTopic.toLowerCase())) {
				topics.push(newTopic.toLowerCase());
				renderButton();
			} 	else {
					$("#message").html("Oops. That button already exists.");
				}
		}

		// clears the input field after rendering
		$("#searchInput").val("");
	});

	// clears difs and buttons
	$("#clearGifButton").on("click", function(clickEvent) {
		$("#buttonsDiv").empty();
		$("#playOrFreeze").hide();
		$("#gifs").empty();
		$("#message").html("");
		topics = [];
	});

	// when clicking on any of the button in the animal list, calls displayAnimals to display animals
	$(document).on("click", ".topicButton", displayTopics);

	// when clicking on any of image displayed, calls animateAnimals function to animate
	$(document).on("click", ".topicImg", animateGifs);

});

