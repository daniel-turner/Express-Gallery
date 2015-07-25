(function() {

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

        alert(error);
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

  function updateImage(response){

    console.log(response);

    var modal = $('#slider_edit_modal' + response.id);
    modal.find('.single_display_image').attr('src',response.link);

    var slider_image = $('#slider_image'+response.id);
    slider_image.attr('src', response.link);

    var list_image = $('#list_image' + response.id);
    list_image.attr('src', response.link);

    var slider_modal_link = $('#slider_modal_link' + response.id);
    slider_modal_link.attr('value', response.link);
    var slider_modal_author = $('#slider_modal_author' + response.id);
    slider_modal_author.attr('value', response.author);
    var slider_modal_description = $('#slider_modal_description'+ response.id);
    slider_modal_description.attr('value', response.description);

    var list_modal_link = $('#list_modal_link' + response.id);
    list_modal_link.attr('value', response.link);
    var list_modal_author = $('#list_modal_author' + response.id);
    list_modal_author.attr('value', response.author);
    var list_modal_description = $('#list_modal_description'+ response.id);
    list_modal_description.attr('value', response.description);

    var author_text = $('#author_tag'+response.id);
    author_text.innerHTML = response.author;
    var description_text = $('#description_tag'+response.id);
    description_text.innerHTML = response.description;
  };
})()