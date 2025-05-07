$(document).ready(function () {
  if ($('#home-root').length) {
    buildHomeUI();
    bindHomeHandlers();
  } else if ($('#quiz-root').length) {
    localStorage.removeItem('userAnswers'); // clear old state
    buildSideBySideCongratsPage();
    bindQuizHandlers();
  }
});

/* QUIZ START */
function buildSideBySideCongratsPage() {
  $('#quiz-root').html(`
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      font-family: sans-serif;
      box-sizing: border-box;
      gap: 2rem;
    ">
      <!-- LEFT: Text + Review Button -->
      <div style="flex: 1 1 400px; max-width: 500px;">
        <h1 style="font-size: 2.4rem; font-weight: bold; margin-bottom: 1rem;">
          🎉 Congrats!
        </h1>
        <p style="font-size: 1.2rem; color: #444; margin-bottom: 2rem;">
          You’ve finished the learning module. Ready to test your skills? Just click the iPad.
        </p>
        <a href="/learn" style="
          background-color: #76e0df;
          color: white;
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 0.2s ease;
        " onmouseover="this.style.backgroundColor='#000';"
           onmouseout="this.style.backgroundColor= '#76e0df';">
          REVIEW
        </a>
      </div>

      <!-- RIGHT: iPad image -->
      <a href="/questions/1" style="flex: 1 1 600px;">
        <img src="/static/media/quizipad.png" alt="Start Quiz iPad" style="
          width: 100%;
          max-height: 100vh;
          object-fit: contain;
          cursor: pointer;
          transition: transform 0.2s ease;
        " onmouseover="this.style.transform='scale(1.02)'"
           onmouseout="this.style.transform='scale(1)'">
      </a>
    </div>
  `);
}

function bindQuizHandlers() {
  $('#start-quiz').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('userAnswers');
    window.location.href = '/questions/1';
  });
  $('#review').on('click', function (e) {
    e.preventDefault();
    window.location.href = '/learn';
  });
}
