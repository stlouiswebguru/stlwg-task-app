/* Add Task View JS
============================= */

$(function(){
  var fauxInput = $('#faux-priority'),
      fauxUl    = $('#faux-input-ul'),
      faxuLis   = $('#faux-input-ul li'),
      realInput = $('#priority');


  fauxInput.on('click', function() {
    fauxInput.addClass('active');
    fauxUl.toggle();
  });

  faxuLis.each(function(){
    $(this).on('click', function(){

      fauxUl.toggle();
      fauxInput.removeClass('active');
      fauxInput.html(this.innerHTML);
      realInput.val(this.innerHTML)

    });
  });

});