(function() {

  function updateImage(response){

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

  function removeImage(response) {

    $('#slider_image'+response.removed_id).remove();
    $('#imageLI'+response.removed_id).remove();
  };

  function addImage(response) {

    $('#main_list').append('<li id="imageLI'+response.id+'" class="imageLI"><a id="list_modal_anchor'+response.id+'" data-reveal-id="list_edit_modal'+response.id+'" href="/gallery/'+response.id+'"><img id="list_image'+response.id+'" src="'+response.link+'" class="src_img_link'+response.id+'"></a><div id="list_edit_modal'+response.id+'" data-reveal="" aria-labelledby="modalTitle" aria-hidden="true" role="dialog" class="reveal-modal"><div class="row"></div><div class="large-9 columns"><div class="image_container"><img src="'+response.link+'" class="list_image src_img_link'+response.id+'"></div></div><div class="large-3 columns"><form id="user_submit_form" method="put" action="/gallery/'+response.id+'"><div class="text_container"><input type="hidden" name="method" value="put"><div class="author_container"><input readonly="" type="text" name="author" value="'+response.author+'" class="author_value'+response.id+'"></div><div class="description_container"><input readonly="" type="text" name="description" value="'+response.description+'" class="description_value'+response.id+'"></div><div class="link_container"><input readonly="" type="text" name="link" value="'+response.link+'" class="link_value'+response.id+'"></div></div><div class="button_container"><div><a href="#" class="small button edit_list_image">Edit</a></div></div></form><form method="post" action="/gallery/'+response.id+'" class="delete_form"><input type="hidden" name="method" value="delete"><input type="hidden" name="id" value="'+response.id+'"><div class="button_container"><div><a href="#" class="small button delete_button">Delete</a></div></div></form></div><a aria-label="Close" class="close-reveal-modal">×</a></div><span id="author_tag'+response.id+'">'+response.author+'</span><br><span id="description_tag'+response.id+'">'+response.description+'</span></li>');
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

    $(this).closest('.reveal-modal').find('.close-reveal-modal').click();

    var form = $(this).closest('.delete_form');
    var data = form.serialize();

    $.post(form.attr('action'), data, function(response) {

      removeImage(response);

    }).error(function(error) {

      alert(error);
    });
  });

  $('#submit_image_button').click(function(event) {

    event.preventDefault();

    $(this).closest('.reveal-modal').find('.close-reveal-modal').click();

    var form = $(this).closest('create_form');
    var data = form.serialize();

    $.post(form.attr('action'), data, function(response) {

      addImage(response);

    }).error(function(error) {

      alert(error);
    });
  });
})()