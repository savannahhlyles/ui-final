$(document).ready(function() {
  // HOME or QUIZ start
  if ($('#home-root').length) {
    buildHomeUI(); bindHomeHandlers();
  }
  else if ($('#quiz-root').length) {
    localStorage.removeItem('userAnswers');  // clear old state
    buildQuizUI(); bindQuizHandlers();
  }
});

/* HOME */
function buildHomeUI() {
  $('#home-root').html(`
    <div class="container py-5">
      <div class="row align-items-center">
        <div class="col-md-6 text-center mb-4 mb-md-0">
          <img src="/static/media/homeipad.png" class="img-fluid rounded" alt="Home iPad">
        </div>
        <div class="col-md-6">
          <h1 class="display-4 fw-bold">Welcome to your guide for learning sketching brushes in <span class="text-info">Procreate.</span></h1>
          <p class="lead mt-4">You’ll explore how to differentiate between brushes and when to use them.</p>
          <a href="/quiz" class="btn btn-secondary btn-lg mt-4 px-4">GET STARTED&nbsp;&rarr;</a>
        </div>
      </div>
    </div>`);
}
function bindHomeHandlers() {
  $('#home-root').on('click', '.btn-secondary', e=>{
    e.preventDefault(); window.location.href='/learn';
  });
}

/* QUIZ START */
function buildQuizUI() {
  $('#quiz-root').html(`
    <div style="position:relative;display:inline-block">
      <img src="/static/media/quizipad.png" width="800" alt="Quiz iPad">
      <button id="start-quiz" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:1em 2em;font-size:1.5rem;cursor:pointer;">Start Quiz</button>
    </div><br><br>
    <button id="review" style="padding:.75em 1.5em;font-size:1.25rem;cursor:pointer;">Review</button>
  `);
}
function bindQuizHandlers() {
  $('#start-quiz').on('click', e=>{
    e.preventDefault(); localStorage.removeItem('userAnswers'); window.location.href='/questions/1';
  });
  $('#review').on('click', e=>{
    e.preventDefault(); window.location.href='/learn';
  });
}
