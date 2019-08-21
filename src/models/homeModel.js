// $(function() {
    $("button").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
      $.ajax({
        type: 'GET',
        url: '/orders',
        success: function(order) {
          var html = '';
          for (var i = 0; i< order.length; i++) {
              html += '<h2>' + order[i].name + ' ' + order[i].drink + '</h2>';
          }
          $('#target').html(html);
        }
      });
    });
//   });


(function poll() {
    setTimeout(function() {
        $.ajax({
            url: "/server/api/function",
            type: "GET",
            success: function(data) {
                console.log("polling");
            },
            dataType: "json",
            complete: poll,
            timeout: 2000
        })
    }, 5000);
})();