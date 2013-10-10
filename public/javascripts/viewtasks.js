/* Task View JS
============================= */

$(function(){

  var taskData;

  var filterResults = function() {
    var highPriorityCnt   = 0,
        mediumPriorityCnt = 0, 
        lowPriorityCnt    = 0,
        updateButtons,
        deleteButtons;

      $(taskData).each(function(i) {
        var markup            = undefined,
            highPriority      = $('#high-priority'),
            mediumPriority    = $('#medium-priority'),
            lowPriority       = $('#low-priority');

        markup =  '<div class="task-container">';
        markup += '<span class="task-date">' + this.date + ' | </span>';
        markup += '<span class="task-title">' + this.title + '</span>';
        markup += '<span class="task-description">' + this.description + '</span>';
        markup += '<button id="update-' + this._id + '" class="blue update-task">update</button>';
        markup += '<button id="delete-' + this._id + '" class="blue delete-task">delete</button></div>';
        
        if(!this.priority) {
          highPriorityCnt++;
          if(highPriorityCnt === 1) {
            highPriority.empty().append(markup); 
            return;
          }
          highPriority.append(markup);
        }

        if(this.priority === 'high') {
          highPriorityCnt++;
          if(highPriorityCnt === 1) {
            highPriority.empty().append(markup); 
            return;
          }
          highPriority.append(markup);
        }
        if(this.priority === 'medium') {
          mediumPriorityCnt++;
          if(mediumPriorityCnt === 1) {
            mediumPriority.empty().append(markup); 
            return;
          } 
          mediumPriority.append(markup);
        }
        if(this.priority === 'low') {
          lowPriorityCnt++;
          if(lowPriorityCnt === 1) {
            lowPriority.empty().append(markup); 
            return;
          }
          lowPriority.append(markup);
        }
      });

      updateButtons = $('.update-task');
      deleteButtons = $('.delete-task');

      updateButtons.on('click', function(){
        updateTask(this);
      });

      deleteButtons.on('click', function(){
        deleteTask(this);
      });

  };
 
  var updateTask = function(button) {
    var dbId            = $(button).attr('id').split('-')[1],
        formDate        = $('#update-form #date'),
        formTitle       = $('#update-form #title'),
        formDescription = $('#update-form #description'),
        formId          = $('#update-form #database-id');
        
    $(taskData).each(function() {
      if(this._id === dbId) {
        $('#faux-priority').html(this.priority);
        formTitle.val(this.title);
        formDate.val(this.date);
        formDescription.val(this.description);
        formId.val(this._id);
      }
    });
    lightBox.fadeIn(function() {
      $('#delete-task-container').hide();
      $('#update-task-container').show();
      lightBoxContent.show();
    });
    positionLightbox();
  };

  var deleteTask = function(button) {
    var dbId    = $(button).attr('id').split('-')[1],
        formId  = $('#delete-form #database-id-delete');

    $(taskData).each(function() {
       if(this._id === dbId) {
        formId.val(this._id);
       }
    });
    lightBox.fadeIn(function() {
      $('#update-task-container').hide();
      $('#delete-task-container').show();
      lightBoxContent.show();
    });
    positionLightbox();
  };

  $.ajax({
    url: '/gettasks',
    dataType: 'json',
    cache: false,
    success: function(data) {
      taskData = data;
      filterResults();
    }
  });

  $('#high-priority-head').on('click', function() {
    $('#high-priority').toggle();
    $(this).toggleClass('expanded');
  });
  $('#medium-priority-head').on('click', function() {
    $('#medium-priority').toggle();
    $(this).toggleClass('expanded');
  });
  $('#low-priority-head').on('click', function() {
    $('#low-priority').toggle();
    $(this).toggleClass('expanded');
  });

  // Lightbox
  var lightBox        = $('#lightbox'),
      lightBoxContent = $('#lb-content');

  var positionLightbox = function() {
      var veiwWidth       = $(window).width(),
          lbContentMargin = (veiwWidth / 2) - 145,
          lbContent       = $('#lb-content');

      lbContent.css({
          'left' : lbContentMargin,
          'top' : $(window).scrollTop() + 50 + 'px'
      });
  };

  $('.cancel').on('click', function() {
      lightBox.hide();
      lightBoxContent.hide();
  });

  var fauxInput = $('#faux-priority'),
      fauxUl    = $('#faux-input-ul'),
      faxuLis   = $('#faux-input-ul li'),
      realInput = $('#priority');

  fauxInput.html(this.innerHTML);
  realInput.val(this.innerHTML);

  fauxInput.on('click', function() {
    fauxInput.addClass('active');
    fauxUl.toggle();
  });

  faxuLis.each(function(){
    $(this).on('click', function(){

      fauxUl.toggle();
      fauxInput.removeClass('active');
      fauxInput.html(this.innerHTML);
      realInput.val(this.innerHTML);
    });
  });
});