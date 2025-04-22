$(document).ready(function() {
    buildHomeUI();
    bindHomeHandlers();
  });
  
  function buildHomeUI() {
    var $root = $('#home-root');
  
    // 1) container + padding
    var $container = $('<div>')
      .addClass('container py-5');
  
    // 2) row, vertically centered
    var $row = $('<div>')
      .addClass('row align-items-center');
  
    var $leftCol = $('<div>')
      .addClass('col-md-6 text-center mb-4 mb-md-0')
      .append(
        $('<img>')
          .attr('src', '/static/media/homeipad.png')   // swap path if needed
          .attr('alt', 'Procreate Interface')
          .addClass('img-fluid rounded ')
      );
  
    var $rightCol = $('<div>').addClass('col-md-6');
    var $headline = $('<h1>')
      .addClass('display-4 fw-bold')
      .html(
        'Welcome to your guide for learning how to use sketching brushes in ' +
        '<span class="text-info">Procreate.</span>'
      );
    var $subhead = $('<p>')
      .addClass('lead mt-4')
      .text('You’ll explore how to differentiate between brushes and when to use them.');
    var $cta = $('<a>')
      .addClass('btn btn-secondary btn-lg mt-4 px-4')
      .attr('href', 'questions.html')    
      .html('GET STARTED&nbsp;&rarr;');
  
    $rightCol.append($headline, $subhead, $cta);
  
    $row.append($leftCol, $rightCol);
    $container.append($row);
    $root.append($container);
  }
  
  function bindHomeHandlers() {
    $('#home-root').on('click', '.btn-secondary', function(e) {
      e.preventDefault();
      window.location.href = 'learn';
    });
  }
  