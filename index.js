
$(".test").click(function () {
    quizInfo()
})

function quizInfo() {
    var category = "";
    var difficulty = "";
    var answerArray = []

    var queryUrl = "https://opentdb.com/api.php?amount=10&category=11&difficulty=medium&type=multiple";

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        for (var i = 0; i < 10; i++) {
            var question = $("<h1>").text(response.results[i].question);
            var correctAnswer = $("<button class='btn btn-success answer' id='correct'>").text(response.results[i].correct_answer);
            var wrongAnswer1 = $("<button class='btn btn-success answer' id='wrong'>").text(response.results[i].incorrect_answers[0]);
            var wrongAnswer2 = $("<button class='btn btn-success answer' id='wrong'>").text(response.results[i].incorrect_answers[1]);
            var wrongAnswer3 = $("<button class='btn btn-success answer' id='wrong'>").text(response.results[i].incorrect_answers[2]);
        }

        $("#questionDiv").append(question);
        $("#answerDiv").append(correctAnswer, wrongAnswer1, wrongAnswer2, wrongAnswer3);
    })
}

$("#answerDiv").on("click", ".answer", function(){
    if ($(this).attr("id") === "correct"){
        alert("That is correct!")
    } else {
        alert("That is wrong!")
    }
})
