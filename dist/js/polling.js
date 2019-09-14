$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
});
var msgcount = '0';
function polling() {
    $.ajax({
        type: 'GET',
        url: '/getNotifications',
        success: function (data) {
            // console.log("notifications", data);
            $('#notif1').text(data + "");
        }
    });
    $.ajax({
        type: 'GET',
        url: '/getMessageCount',
        success: function (data) {
            // console.log("msgcount", data);
            if (data != msgcount) {
                Materialize.toast('You have New Messages', 4000);
                //only when there is a new message.. maybe keep track of the messages count and if theres a difference display
            }
            msgcount = data;
            $('#msg1').text(data + "");
        }
    });
}

setInterval(polling, 3000);

function dismissModal() {
    $.ajax({
        type: 'GET',
        url: '/readNotifications',
        success: function (data) {
            console.log("done");
        }
    });
}

$("#notiflnk").on("click", function () {
    $.ajax({
        type: 'GET',
        url: '/notifications',
        success: function (data) {
            $("#notif").empty();
            for (const iterator of data) {
                $("#notif").append('<li class="collection-item">' +iterator.from +' ' + iterator.type + ' on '+   new Date(iterator.timestamp * 1000) + '</li>');
            }
        }
    });
});

function allNotifications() {
    $.ajax({
        type: 'GET',
        url: '/allNotifications',
        success: function (data) {
            $("#notif").empty();
            for (const iterator of data) {
                $("#notif").append('<li class="collection-item">' +iterator.from +' ' + iterator.type + ' on '+   new Date(iterator.timestamp * 1000) + '</li>');
            }
        }
    });
}