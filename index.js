$(document).ready(() => {
    var numQuestions = 10;
    var currentCategory;
    var currentDifficulty;
    var currentQuestion = 0;

    var numQuestionsInput = $('#numQuestions');
    var currentCategorySelect = $('#category');
    var currentDifficultySelect = $('#difficulty');

    var remarksDiv = $('#remarksDiv');

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
    function startQuiz() {
        numQuestions = (numQuestionsInput.val() || numQuestions);
        currentCategory = currentCategorySelect.val();
        currentDifficulty = currentDifficultySelect.val();
        currentQuestion = 0;

        getQuizQuestions();
    }

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
    function getCompliment() {
        $.ajax({
            url: 'https://complimentr.com/api',
            method: "GET",
        }).then(function (response) {
            remarksDiv.text(response.compliment);
        })
    }

    //Get an insult
    function getInsult() {
        $.ajax({
            url: 'https://insult.mattbas.org/api/insult',
            method: "GET",
        }).then(function (response) {
            //Update add an insult to the div
            remarksDiv.text(response);
        })
    }

    //Show the currentQuestion
    function showQuestion() {

    }

    $('#startQuiz').on(click, startQuiz);
});


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
]