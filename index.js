function test () {
    //Make an ajax call to Natural Language Understanding
    var queryURL = "https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/9ca48df6-583f-4640-8ab6-95eeabacb616/v1/analyze?version=2019-07-12";
    var apikey = "yZVwYWObEmHvz8T2m1HEgGFzHX1_ztIaxUTP8G9qm6BX";

    $.ajax({
        url: "https://api.textrazor.com",
        headers: {
            "x-textrazor-key": "f68d0058a329a0f46a45f6d292de3cd1cb48cd45736fdcec88e21450",
            "Access-Control-Allow-Origin": "*",
        },
        method: "POST",
        data: {
            extractors: ["entities", "entailments"],
            text: "What did Alfred Hitchcock use as blood in the film \"Psycho\""
        }
    }).then(function (response) {
        console.log(response);
    })

    // $.ajax({
    //     // accepts: 'application/json',
    //     url: queryURL,
    //     user: {
    //         apikey: apikey
    //     },
    //     // crossDomain: true,
    //     // crossOrigin: null,
    //     method: "POST",
    //     // contentType: 'application/json',
    //     // beforeSend: function(xhr) { 
    //     //     xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    //     // },
    //     body: {
    //         "text": "What did Alfred Hitchcock use as blood in the film &quot;Psycho&quot;?",
    //         "features": {
    //             "concepts": {
    //                 "targets": [
    //                     "Person",
    //                     "Movie",
    //                     "Title",
    //                     "Noun"
    //                 ]
    //             }
    //         }
    //     },
    //     "headers": {
    //         "accept": "application/json",
    //         "Access-Control-Allow-Origin":"*"
    //     }
    //   }).then(function (response) {
    //     console.log(response);
    //   });


//     curl -X POST -u "apikey:{apikey}" \
// --header "Content-Type: application/json" \
// --data '{
//   "url": "http://newsroom.ibm.com/Guerbet-and-IBM-Watson-Health-Announce-Strategic-Partnership-for-Artificial-Intelligence-in-Medical-Imaging-Liver",
//   "features": {
//     "sentiment": {},
//     "categories": {},
//     "concepts": {},
//     "entities": {},
//     "keywords": {}
//   }
// }' \
// "{url}"

}

test();
