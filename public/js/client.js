(function() {

  function updateImage(response){

    console.log(response);

    $('.src_img_link'+response.id).each(function(){

      $(this).attr('src', response.link);
    });

    $('.author_value'+response.id).each(function() {

      $(this).attr('value', response.author);
    });

    $('.description_value'+response.id).each(function() {

      $(this).attr('value', response.description);
    });

    $('.link_value'+response.id).each(function() {

      $(this).attr('value', response.link);
    });

    $('#author_tag'+response.id).html(response.author);
    $('#description_tag'+response.id).html(response.description);
  };

  function updateImages(response) {

    $('#slider_image'+response.id).remove();
    $('#imageLI'+response.id).remove();

  };

  $('.edit_list_image').click(function(event) {

    event.preventDefault();

    var form = $(this).closest('#user_submit_form');
    var author = form.find('.author_container input');
    var description = form.find('.description_container input');
    var link = form.find('.link_container input');

    if(this.innerHTML === "Edit") {

      author.attr('readonly', false).focus();
      description.attr('readonly', false);
      link.attr('readonly', false);
      this.innerHTML = "Save";

    } else {

      author.attr('contentEditable', true);
      description.attr('contentEditable', true);
      link.attr('contentEditable', true);
      this.innerHTML = "Edit";

      var data = form.serialize();

      $.post(form.attr('action'), data, function(response) {

        updateImage(response);

      }).error(function(error) {

        alert(response.statusCode);
      });
    }
  });

  $('.edit_slider_image').click(function(event) {

    event.preventDefault();

    var form = $(this).closest('form.user_submit_form');
    var author = form.find('.author_container input');
    var description = form.find('.description_container input');
    var link = form.find('.link_container input');

    if(this.innerHTML === "Edit") {

      author.attr('readonly', false).focus();
      description.attr('readonly', false);
      link.attr('readonly', false);
      this.innerHTML = "Save";

    } else {

      author.attr('contentEditable', true);
      description.attr('contentEditable', true);
      link.attr('contentEditable', true);
      this.innerHTML = "Edit";

      var data = form.serialize();

      $.post(form.attr('action'), data, function(response) {

        updateImage(response);

      }).error(function(error) {

        alert(error);
      });
    }
  });

  $('.delete_button').click(function(event) {

    event.preventDefault();

    var form = $(this).closest('form.delete_form');
    var data = form.serialize();

    console.log($(form).attr('action'));

    $.post(form.attr('action'), data, function(response) {

      updateImages(response);

    }).error(function(error) {

      alert(error);
      console.log(error);
    });
  });
})()