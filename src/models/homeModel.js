var MongoClient = require('mongodb').MongoClient;
// // $(function() {
//     $("button").on("click", function (event) {
//         event.preventDefault();
//         event.stopPropagation();
//       $.ajax({
//         type: 'GET',
//         url: '/orders',
//         success: function(order) {
//           var html = '';
//           for (var i = 0; i< order.length; i++) {
//               html += '<h2>' + order[i].name + ' ' + order[i].drink + '</h2>';
//           }
//           $('#target').html(html);
//         }
//       });
//     });
// //   });


// (function poll() {
//     setTimeout(function() {
//         $.ajax({
//             url: "/server/api/function",
//             type: "GET",
//             success: function(data) {
//                 console.log("polling");
//             },
//             dataType: "json",
//             complete: poll,
//             timeout: 2000
//         })
//     }, 5000);
// })();

exports.notifcount = (req, res) => {
    MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function (err, db) {
        // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("matcha");
        var query = { username: "bngweny69" };
        dbo.collection("notification").find(query).toArray(function (err, result) {
            if (err) throw err;
            if (result.length == 0) {
                console.log("USERNAME IS DOESN'T EXIST", result);
                res.send("0");
            }
            else {
                console.log(result);
                res.send("" + result.length);
            }
            db.close();
        });
    });
}
// $(document).ready(function () {
//     setTimeout(function () {
//         var MongoClient = require('mongodb').MongoClient;
//         MongoClient.connect('mongodb://bngweny:1am!w2k@ds117334.mlab.com:17334/matcha', { useNewUrlParser: true }, function (err, db) {
//             // MongoClient.connect('mongodb://localhost:27017/matcha', { useNewUrlParser: true }, function (err, db) {
//             if (err) throw err;
//             var dbo = db.db("matcha");
//             var query = { username: "bngweny69" };
//             dbo.collection("notification").find(query).toArray(function (err, result) {
//                 if (err) { throw err; }
//                 if (result.length == 0) {
//                     console.log("USERNAME IS DOESN'T EXIST");
//                 }
//                 else {
//                     console.log(result);
//                     $('#notif1 span').text("" + result.length);
//                 }
//                 db.close();
//             });
//         });
//     }, 3000);
// });