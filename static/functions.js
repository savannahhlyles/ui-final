$(document).ready(function() {
  if ($('#home-root').length) {
    buildHomeUI();
    bindHomeHandlers();
  }
  else if ($('#quiz-root').length) {
    buildQuizUI();
    bindQuizHandlers();
  }else if($('#interface-root').length){
   buildInterfaceUI();
  }
});


/* ───────── HOME PAGE ───────── */

function buildHomeUI() {
  var $root = $('#home-root');

  var $container = $('<div>').addClass('container py-5');
  var $row       = $('<div>').addClass('row align-items-center');

  var $leftCol = $('<div>')
    .addClass('col-md-6 text-center mb-4 mb-md-0')
    .append(
      $('<img>')
        .attr('src', '/static/media/homeipad.png')   // or your actual home image
        .attr('alt', 'Procreate Interface')
        .addClass('img-fluid rounded')
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
    .attr('href', '/quiz')    // go to your quiz start
    .html('GET STARTED&nbsp;&rarr;');

  $rightCol.append($headline, $subhead, $cta);
  $row.append($leftCol, $rightCol);
  $container.append($row);
  $root.append($container);
}

function bindHomeHandlers() {
  // If you wanted JS interception instead of an <a> tag:
  $('#home-root').on('click', '.btn-secondary', function(e) {
    e.preventDefault();
    window.location.href = '/learn';
  });
}

/* ───────── INTERFACE PAGE ───────── */
function buildInterfaceUI(){
    var $root = $('#interface-root');
    let new_slide = "";
    if(loaded_slide.id === 1){
        new_slide = `
        <div class="row">
            <div class="big-bold bordered col-md-12">${loaded_slide.title}</div>
            <div class="col-md-12 row d-flex justify-content-center align-items-center">
                <div class="col-md-2 arrow">
                </div>
                <div class="cyan-box" style="left: ${loaded_slide.boxy}%; top: ${loaded_slide.boxx}%;"></div>
                <div class="slide col-md-8">
                    <img src="/static/media/Procreate_interface/slide${loaded_slide.id}.png" class="img-fluid">
                </div>
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id + 1}">
                        <img src="/static/media/Procreate_interface/right_arrow.png" class="img-fluid">
                    </a>
                </div>
            </div>
        </div>`;
    }else if(loaded_slide.id === 5){
        new_slide = `
        <div class="row">
            <div class="big-bold bordered col-md-12">${loaded_slide.title}</div>
            <div class="col-md-12 row d-flex justify-content-center align-items-center">
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id - 1}">
                        <img src="/static/media/Procreate_interface/left_arrow.png" class="img-fluid">
                    </a>
                </div>
                <div class="cyan-box" style="left: ${loaded_slide.boxy}%; top: ${loaded_slide.boxx}%;"></div>
                <div class="slide col-md-8">
                    <img src="/static/media/Procreate_interface/slide${loaded_slide.id}.png" class="img-fluid">
                </div>
                <div class="col-md-2 arrow">
                </div>
            </div>
        </div>`;
    }else {
        new_slide = `
        <div class="row">
            <div class="big-bold bordered col-md-12">${loaded_slide.title}</div>
            <div class="col-md-12 row d-flex justify-content-center align-items-center">
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id - 1}">
                        <img src="/static/media/Procreate_interface/left_arrow.png" class="img-fluid">
                    </a>
                </div>
                <div class="cyan-box" style="left: ${loaded_slide.boxy}%; top: ${loaded_slide.boxx}%;"></div>
                <div class="slide col-md-8">
                    <img src="/static/media/Procreate_interface/slide${loaded_slide.id}.png" class="img-fluid">
                </div>
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id + 1}">
                        <img src="/static/media/Procreate_interface/right_arrow.png" class="img-fluid">
                    </a>
                </div>
            </div>
        </div>`;
    }
    $root.append(new_slide);
}

/* ───────── QUIZ START PAGE ───────── */

function buildQuizUI() {
  var $root = $('#quiz-root');

  // iPad + Start button
  var $ipad = $('<div>').css({
    position: 'relative',
    display:  'inline-block'
  });
  $ipad.append(
    $('<img>')
      .attr('src', '/static/media/quizipad.png')
      .attr('alt','Quiz iPad')
      .css('width','800px')
  );
  $ipad.append(
    $('<button>')
      .attr('id','start-quiz')
      .text('Start Quiz')
      .css({
        position:  'absolute',
        top:       '50%',
        left:      '50%',
        transform: 'translate(-50%,-50%)',
        padding:   '1em 2em',
        fontSize:  '1.5rem',
        cursor:    'pointer'
      })
  );

  // Review button
  var $review = $('<button>')
    .attr('id','review')
    .text('Review')
    .css({
      display:  'block',
      margin:   '2em auto',
      padding:  '.75em 1.5em',
      fontSize: '1.25rem',
      cursor:   'pointer'
    });

  $root.append($ipad).append('<br><br>').append($review);
}

function bindQuizHandlers() {
  $('#quiz-root').on('click', '#start-quiz', function() {
    window.location.href = '/questions/1';
  });
  $('#quiz-root').on('click', '#review', function() {
    window.location.href = '/learn';
  });
}
