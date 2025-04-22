$(document).ready(function() {
    buildQuizUI();
    bindQuizHandlers();
  });
  
  function buildQuizUI() {
    // root container
    var $root = $('#quiz-root');
    var $center = $('<center>');
  
    var $ipadContainer = $('<div>')
      .attr('id', 'ipad-container')
      .css({
        position: 'relative',
        display: 'inline-block'
      });
  
    var $ipadImg = $('<img>')
      .attr('src', '/static/media/quizipad.png')
      .attr('alt', 'iPad')
      .attr('width', 1000);    // ← 800px wide
  
    $ipadContainer.append($ipadImg);
  
    var $startBtn = $('<button>')
      .attr('id', 'start-quiz')
      .text('Start Quiz')
      .css({
        position:  'absolute',
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%, -50%)'
      });
  
    $ipadContainer.append($startBtn);
  
    var $reviewBtn = $('<button>')
      .attr('id', 'review')
      .text('Review');
  
    // assemble
    $center
      .append($ipadContainer)
      .append('<br><br>')
      .append($reviewBtn);
  
    $root.append($center);
  }
  
  function bindQuizHandlers() {
    $('#start-quiz').on('click', function() {
      console.log('Start Quiz clicked');
      window.location.href = 'questions';
    });
  
    $('#review').on('click', function() {
      console.log('Review clicked');
      window.location.href = 'learn';
    });
  }
  