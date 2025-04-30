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
      <!-- Top row: Text and Image -->
      <div class="row align-items-center">
        <div class="col-md-4">
          <h1 class="display-4 fw-bold">Your guide to using sketching brushes in <span class="text-info">Procreate.</span></h1>
          <p class="lead mt-4 text-muted">Master the art of selecting the perfect brush for every creative project.</p>
        </div>

        <div class="col-md-8 text-center mt-4 mt-md-0">
          <img src="/static/media/homeipad.png" class="img-fluid hero-image" alt="Home iPad">
        </div>
      </div>

      <!-- Button row: floated to match Procreate Interface nav item -->
<div class="row mt-4">
  <div class="col">
    <div class="d-flex justify-content-end pe-4">
      <a href="/quiz" class="btn btn-accent btn-lg px-5">GET STARTED&nbsp;&rarr;</a>
    </div>
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
