$(document).ready(function () {
  if ($('#home-root').length) {
    buildHomeUI();
    bindHomeHandlers();
  } else if ($('#quiz-root').length) {
    localStorage.removeItem('userAnswers');
    bindQuizHandlers();
  }
});

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
