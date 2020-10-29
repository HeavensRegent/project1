$(document).ready(() => {
    var numQuestions = JSON.parse(localStorage.getItem("triviaQuestions")) || 10;
    var currentCategory = JSON.parse(localStorage.getItem("triviaCategory")) || '';
    var currentDifficulty = localStorage.getItem("triviaDifficulty") || '';
    var currentQuestion = 0;
    var currentScore = 0;
    var numQuestionsInput = $('#numQuestions');
    var currentCategorySelect = $('#category');
    var currentDifficultySelect = $('#difficulty');
    var players = JSON.parse(localStorage.getItem("players")) || [];

    var remarksDiv = $('#remarksDiv');
    var rightWrongDiv = $('#rightWrongDiv');
    var questionDiv = $('#questionDiv');
    var quizReviewDiv = $('#quizReview');
    var highScoreDiv = $('.highScoreDiv');

    var page1 = $('#page1');
    var page2 = $('#page2');
    var page3 = $('#page3');
    var page4 = $('#page4');

    var questionArray = [];
    var chosenAnswerArray = [];

    initializeLandingPage();

    //When the page first loads we need to add the categories to the page
    function initializeLandingPage() {
        //Update Category select
        var categorySelect = $('#category');
        
        //Go through each category and add it to the select, if it is the currently selected one (local storage) mark it as selected
        for(i in categories)
        {
            var category = categories[i];
            categorySelect.append('<option value="' + category.value + '"' + (currentCategory === category.value ? 'selected' : '') + '>' + category.title + '</option>');
        }

        //Update Difficulty select
        var difficultySelect = $('#difficulty');
        //Go through each difficulty and add it to the select, if it is the currently selected one (local storage) mark it as selected
        for(i in difficulties)
        {
            var difficulty = difficulties[i];
            difficultySelect.append('<option value="' + difficulty.value + '"' + (currentDifficulty === difficulty.value ? 'selected' : '') + '>' + difficulty.title + '</option>');
        }

        numQuestionsInput.val(numQuestions);

    }

    //Start the quiz
    function startQuiz(event) {
        event.preventDefault();
        currentScore = 0;
        //Get the values and set the current question to 0
        numQuestions = (parseInt(numQuestionsInput.val()) || numQuestions);
        currentCategory = currentCategorySelect.val();
        currentDifficulty = currentDifficultySelect.val();
        currentQuestion = 0;
        chosenAnswerArray = [];

        //If the option is any we don't want a value passed in
        if(currentCategory === 'any')
            currentCategory = '';
        if(currentDifficulty === 'any')
            currentDifficulty = '';

        //Save the chosen settings to local storage
        if(numQuestions)
            localStorage.setItem("triviaQuestions", numQuestions);
        else
            localStorage.removeItem("triviaQuestions");
        if(currentCategory)
            localStorage.setItem("triviaCategory", currentCategory);
        else
            localStorage.removeItem("triviaCategory");
        if(currentDifficulty)
            localStorage.setItem("triviaDifficulty", currentDifficulty);
        else
            localStorage.removeItem("triviaDifficulty");

        page1.addClass('d-none');
        page2.removeClass('d-none');

        getQuizQuestions();
    }


    //Retrieve the quiz questions based on the selected criteria
    function getQuizQuestions() {
        //Build the query url, if there is a selected currentCategory 
        var queryURL = "https://opentdb.com/api.php?amount=" + numQuestions 
        + (currentCategory ? "&category=" + currentCategory : '')
        + (currentDifficulty ? "&difficulty=" + currentDifficulty : '')

        //Actual ajax call
        $.ajax({
            url: queryURL,
            method: "GET",
        }).then(function (response) {
            //Send the results to the questionArray
            questionArray = response.results;
            //Show the question
            showQuestion();
        })
    }

    //Get a compliment
    function getCompliment(text) {
        $.ajax({
            url: 'https://complimentr.com/api',
            method: "GET",
        }).then(function (response) {
            //Empty the remarks div
            remarksDiv.empty();
            //Unhide the remarks div
            remarksDiv.removeClass('d-none');
            //Add the compliment
            remarksDiv.append($('<p>').text(response.compliment));
        })
    }

    //Get an insult
    function getInsult(text) {
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/https://insult.mattbas.org/api/insult',
            method: "GET",
        }).then(function (response) {
            //Empty the remarks div
            remarksDiv.empty();
            //Unhide the remarks div
            remarksDiv.removeClass('d-none');
            //Add the insult
            remarksDiv.append($('<p>').text(response));
        })
    }

    //Show the currentQuestion
    function showQuestion() {
        updateScore();
        questionDiv.empty();

        var question = questionArray[currentQuestion];
        var questionEl = $("<h1>").html(question.question);
        var answerArray = [];

        //Add the correct answer to the array
        answerArray.push($("<button class='btn answer' id='correct'>").html(question.correct_answer));

        //For each wrong answer add it to the array
        for(i in question.incorrect_answers)
        {
            answerArray.push($("<button class='btn answer'>").html(question.incorrect_answers[i]));
        }

        if(question.incorrect_answers.length < 2)
            $('.second-row').addClass('d-none');
        else
            $('.second-row').removeClass('d-none');
        
        //Append the question
        questionDiv.append(questionEl);

        //Go append each answer in a random order to the dom
        var answersLength = question.incorrect_answers.length + 1;
        for(var i = 0; i < answersLength; i++)
        {
            var indexToUse = Math.floor(Math.random() * answerArray.length);
            $("#answer" + (i+1)).html(answerArray[indexToUse]);
            answerArray.splice(indexToUse, 1);
        }
    }

    //Update the score on the screen
    function updateScore() {
        $('.currentScore').text(currentScore);
    }

    //Show everything needed for page 3
    function showPage3() {
        quizResults();
        renderUsers();
        finalGif()
    }

    //Show each question, their answer, and the correct answer
    function quizResults() {
        quizReviewDiv.empty();

        //Iterate through the questionArray and get their chosen answer and display it next to the correct answer
        for(i in questionArray)
        {
            var questionDiv = $('<div>').html('<h6>Question ' + (parseInt(i) + 1) + ': ' + questionArray[i].question + '</h6>');

            if(chosenAnswerArray[i] === questionArray[i].correct_answer)
                questionDiv.append($('<p>').html('Your answer &quot;' + chosenAnswerArray[i] + '&quot; was <span class="text-success">Correct!</span>'));
            else
                questionDiv.append($('<p>').html('Your answer &quot;' + chosenAnswerArray[i] + '&quot; was <span class="text-danger">Wrong!</span> The correct answer was &quot;' + questionArray[i].correct_answer + '&quot;'));
            
            quizReviewDiv.append(questionDiv);
        }
    }

    //When they click on the start quiz button
    $('#startQuiz').on('click', startQuiz);
    
    //When the click on an answer
    $("#answerDiv").on("click", ".answer", function(){
        //Show the rightWrongDiv
        rightWrongDiv.removeClass('d-none');

        //Store their chosen answer for review later
        chosenAnswerArray.push($(this).text());

        //If they are right let them know and give them a compliment
        if ($(this).attr("id") === "correct"){
            getCompliment();
            rightWrongDiv.text('You got this right!');
            currentScore += 10;
        }
        //Else let them know and insult them 
        else {
            getInsult();
            rightWrongDiv.html('You got this wrong! - The correct answer was ' + questionArray[currentQuestion].correct_answer);
        }
        //Disable the answers so they can't click again
        $('.answer').prop('disabled', true);
        //Show the div with the button to go to the next question
        $('.nextDiv').removeClass('d-none');

        updateScore();
    });

    //When the click on the next button
    $('#nextQuestion').on('click', function(event) {
        event.preventDefault();

        //Increment the current question
        currentQuestion++;
        //Hide the div with the next button
        $('.nextDiv').addClass('d-none');
        remarksDiv.addClass('d-none');
        rightWrongDiv.addClass('d-none');
        //If we are at the end go to the results page
        if(currentQuestion === numQuestions)
        {
            page2.addClass('d-none');
            page3.removeClass('d-none');
            showPage3();
        }
        //Else go to the next question
        else
        {
            showQuestion();
        }
    });

    //When they click on show Highscores
    $('#showHighscores').on('click', function(event) {
        event.preventDefault();

        //Hide all other divs
        page1.addClass('d-none');
        page2.addClass('d-none');
        page3.addClass('d-none');

        //Show the highscore div
        page4.removeClass('d-none');
        renderUsers();
    });

    //When they click on the go home button
    $('#goHome').on('click', function(event) {
        event.preventDefault();

        //Hide pa
        page4.addClass('d-none');
        page1.removeClass('d-none');
    })

    //Submit the highscore
    $('.submitBtn').on("click", function (event) {
        event.preventDefault();
        
        var input = $(".inputName").val();

        //If there is no input, don't do anything else
        if(!input)
            return;
        
        var user = {
            Name: input,
            Score: currentScore
        };
        players.push(user)
        
        //Sort the player array by highscore in reverse order
        players.sort((a, b) => b.Score - a.Score);
        
        //Don't let the array be larger than 10
        if(players.length > 10)
        {
            players.splice(10);
        }

        //Save the highscore to local storage
        localStorage.setItem("players", JSON.stringify(players));
        $(".inputName").val('');
        renderUsers();
    });

    //Display the highscores
    function renderUsers() {
        highScoreDiv.empty()
        for (let i = 0; i < players.length; i++) {
            var user = players[i];
            var newUser = $("<li>");
            newUser.text(user.Name + "    :    " + user.Score);
            newUser.attr("data-index", i);
            newUser.attr("class", "nameTxt");
            highScoreDiv.append(newUser);
        }
    }
})

// Gets random gif to display on results screen 
function finalGif(){
    var apikey = "EnV8tsRNu2U90oTqFnE64rRp6II4lVDM";
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?api_key=" + apikey + "&q=congratulations",
        method: "GET"
    }).then(function (response) {
        var randomIndex = Math.floor(Math.random() * response.data.length - 1);
        var gif = $("<img>").addClass("gifimage").attr("src", response.data[randomIndex].images.fixed_height.url)
        $(".gifDiv").append(gif);
    })
}
var categories = [
    { title: 'Any Category', value: 'any'},
    { title: 'General Knowledge', value: 9},
    { title: 'Entertainment: Books', value: 10},
    { title: 'Entertainment: Film', value: 11},
    { title: 'Entertainment: Music', value: 12},
    { title: 'Entertainment: Musicals & Theatres', value: 13},
    { title: 'Entertainment: Television', value: 14},
    { title: 'Entertainment: Video Games', value: 15},
    { title: 'Entertainment: Board Games', value: 16},
    { title: 'Entertainment: Japanese Anime & Manga', value: 31},
    { title: 'Entertainment: Cartoon & Animations', value: 32},
    { title: 'Entertainment: Comics', value: 29},
    { title: 'Science & Nature', value: 17},
    { title: 'Science: Computers', value: 18},
    { title: 'Science: Mathematics', value: 19},
    { title: 'Science: Gadgets', value: 30},
    { title: 'Mythology', value: 20},
    { title: 'Sports', value: 21},
    { title: 'Geography', value: 22},
    { title: 'History', value: 23},
    { title: 'Politics', value: 24},
    { title: 'Art', value: 25},
    { title: 'Celebrities', value: 26},
    { title: 'Animals', value: 27},
    { title: 'Vehicles', value: 28},
];

var difficulties = [
    { title: 'Any Difficulty', value: 'any'},
    { title: 'Easy', value: 'easy'},
    { title: 'Medium', value: 'medium'},
    { title: 'Hard', value: 'hard'},
];

   

