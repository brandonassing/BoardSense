  $(document).ready(function () {

      $('.modal').modal({
          ready: function (modal, trigger) {

              $('#name-rider').focus();
              $("#name-rider").val($("#search-rider").val());
              $('#name-comp').focus();
              $("#name-comp").val($("#search-comp").val());
              $("#name-comp-update").val($("#search-comp").val());
              $('#name-comp-update').focus();

              $("#create-year-btn").html("Competition Year");
              $("#update-year-btn").html("Competition Year");
              $("#board-year-btn").html("Year Made");
          }
      });

      $('.mtn-input').autocomplete({
          data: {
              "neque": null,
              "ante": null,
              "ornare": null,
              "ipsum": null,
              "nec": null,
              "lacinia": null
          }
      });

      $('.comp-input').autocomplete({
          data: {
              "montes,": null,
              "vitae diam.": null,
              "amet": null,
              "mattis velit justo": null,
              "dictum mi": null,
              "nibh": null
          }
      });

      $('#search-rider-btn').click(function () {
          $("#rider-search-table tr").remove();
          var nameRiderVal = $('#search-rider').val();
          var tableData = null;
          $.ajax({
              'url': '/findboarder',
              'type': 'POST',
              'data': {
                  'name': nameRiderVal
              },
              success: function (data) {
                  $.each(data, function (i, item) {
                      var $tr = $('<tr>').append(
                          $('<td>').text(item.competitionName),
                          $('<td>').text(item.competitionYear),
                          $('<td>').text(item.categoryName),
                          $('<td>').text(item.result),
                          $('<td>').text(item.brand),
                          $('<td>').text(item.model),
                          $('<td>').text(item.yearMade)
                      ).appendTo('#rider-search-table');
                  });
              }
          });

      });

      $('#show-participants').click(function () {
          $("#show-participants-table tr").remove();
          var nameCompVal = $('#search-comp').val();
          var yearCompVal = $('#comp-search-year').val();
          var tableData = null;
          $.ajax({
              'url': '/findpart',
              'type': 'POST',
              'data': {
                  'competitionName': nameCompVal,
                  'competitionYear': yearCompVal
              },
              success: function (data) {
                  $.each(data, function (i, item) {
                      var $tr = $('<tr>').append(
                          $('<td>').text(item.snowboarderID),
                          $('<td>').text(item.name),
                          $('<td>').text(item.result),
                          $('<td>').text(item.categoryName),
                          $('<td>').text(item.result),
                          $('<td>').text(item.brand),
                          $('<td>').text(item.model),
                          $('<td>').text(item.yearMade)
                      ).appendTo('#show-participants-table');
                  });
              }
          });

      });


      $('#num-participants').click(function () {

          var nameCompVal = $('#search-comp').val();
          var yearCompVal = $('#comp-search-year').val();
          $.ajax({
              'url': '/partino',
              'type': 'POST',
              'data': {
                  'competitionName': nameCompVal,
                  'competitionYear': yearCompVal
              },
              success: function (data) {
                  Materialize.toast(data[0].participantCOUNT, 4000);
              }
          });

      });
      $('#id-btn').click(function () {

          var nameRiderVal = $('#search-rider').val();
          $.ajax({
              'url': '/getid',
              'type': 'POST',
              'data': {
                  'name': nameRiderVal
              },
              success: function (data) {
                  $.each(data, function (i, item) {
                      Materialize.toast("Rider ID: " + item.snowboarderID, 4000);
                  });
              }
          });

      });

      $('#quit-btn').click(function () {
          $.ajax({
              'url': '/quit',
              'type': 'GET'
          });
      });

  });
