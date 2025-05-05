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
