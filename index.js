$(document).ready(() => {
    var numQuestions = 10;
    var currentCategory;
    var currentDifficulty;
    var currentQuestion = 0;

    var numQuestionsInput = $('#numQuestions');
    var currentCategorySelect = $('#category');
    var currentDifficultySelect = $('#difficulty');

    var remarksDiv = $('#remarksDiv');
    var rightWrongDiv = $('#rightWrongDiv');

    var questionArray = [];

    initializeLandingPage();

    //When the page first loads we need to add the categories to the page
    function initializeLandingPage() {
        //Update Category select
        var categorySelect = $('#category');
        for(i in categories)
        {
            var category = categories[i];
            categorySelect.append('<option value="' + category.value + '">' + category.title + '</option>');
        }

        //Update Difficulty select
        var difficultySelect = $('#difficulty');
        for(i in difficulties)
        {
            var difficulty = difficulties[i];
            difficultySelect.append('<option value="' + difficulty.value + '">' + difficulty.title + '</option>');
        }
    }

    //Start the quiz
    function startQuiz(event) {
        event.default()
        numQuestions = (numQuestionsInput.val() || numQuestions);
        currentCategory = currentCategorySelect.val();
        currentDifficulty = currentDifficultySelect.val();
        currentQuestion = 0;

        getQuizQuestions();
    }
})

    //Retrieve the quiz questions based on the selected criteria
    function getQuizQuestions() {
        //If the option is any we don't want a value passed in
        if(category === 'any')
            category = '';
        if(difficulty === 'any')
            difficulty = '';

        //Build the query url, if there is a selected category 
        var queryURL = "https://opentdb.com/api.php?amount=" + numQuestions 
        + (category ? "&category=" + category : '')
        + (difficulty ? "&difficulty=" + difficulty : '')

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
            //Add the compliment
            remarksDiv.append($('<p>').text(response.compliment));
        })
    }

    //Get an insult
    function getInsult(text) {
        $.ajax({
            url: 'https://insult.mattbas.org/api/insult',
            method: "GET",
        }).then(function (response) {
            //Empty the remarks div
            remarksDiv.empty();
            //Add the insult
            remarksDiv.append($('<p>').text(response));
        })
    }

    //Show the currentQuestion
    function showQuestion() {
        var question = questionArray[current];
        var questionEl = $("<h1>").text(question.question);
        var answerArray = [];

        //Add the correct answer to the array
        answerArray.push($("<button class='btn btn-success answer' id='correct'>").text(question.correct_answer));

        //For each wrong answer add it to the array
        for(i in question.incorrect_answers)
        {
            answerArray.push($("<button class='btn btn-success answer' id='correct'>").text(question.incorrect_answers[i]));
        }
        
        //Append the question
        $("#questionDiv").append(questionEl);

        //Go append each answer in a random order to the dom
        var answersLength = question.incorrect_answers.length + 1;
        for(var i = 0; i < answersLength; i++)
        {
            var indexToUse = Math.floor(Math.random() * answerArray.length);
            $("#answer" + i).text(answerArray[indexToUse]);
            answerArray.splice(indexToUse);
        }
    }

    $('#startQuiz').on('click', startQuiz);
    
    $("#answerDiv").on("click", ".answer", function(){
        //Show the rightWrongDiv
        rightWrongDiv.removeClass('d-none');
        if ($(this).attr("id") === "correct"){
            getCompliment();
            rightWrongDiv.text('You got this right!');
            
        } else {
            getInsult();
            rightWrongDiv.text('You got this wrong!');
        }
    })



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

function finalGif(result){
    var apikey = "EnV8tsRNu2U90oTqFnE64rRp6II4lVDM"
    
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?api_key=" + apikey + "&q=" + result,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var gif = $("<img>").addClass("gifimage").attr("src", response.data[0].images.fixed_height.url)
        $(".gifDiv").append(gif)
    })
}   