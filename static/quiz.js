
$(function(){
  console.log('quiz.js loaded', question);
  window.userAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
  renderQuestion(question);
});

function persist() {
  localStorage.setItem('userAnswers', JSON.stringify(window.userAnswers));
}

function renderQuestion(q) {
  const $root = $('#question-root').empty();
  $root.append(`<h2>${q.id}. ${q.text}</h2><hr>`);

  // Render question based on type
  if (q.type === 'multiple_choice') renderMCQ(q, $root);
  else if (q.type === 'matching') renderMatching(q, $root);
  else if (q.type === 'fill_in_the_blanks') renderFillBlanks(q, $root);

  // Navigation
  const backId = q.id > 1 ? q.id - 1 : null;
  const nextId = q.id < totalQuestions ? q.id + 1 : null;
  const $nav = $('<div class="mt-4">');

  if (backId) {
    $nav.append(`<a href="/questions/${backId}" class="btn btn-secondary me-2">Back</a>`);
  }

  if (nextId) {
    const $nextBtn = $('<button class="btn btn-primary">Next</button>');
    $nextBtn.on('click', function () {
      const ans = window.userAnswers[q.id];
      const isAnswered = checkAnswered(q, ans);
      if (!isAnswered) {
        showPopupMessage("Please answer the question before continuing.", false);
        return;
      }
      window.userAnswers[q.id].locked = true;
      persist();
      window.location.href = `/questions/${nextId}`;
    });
    $nav.append($nextBtn);
  } else {
    const $submitBtn = $('<button id="submit-quiz" class="btn btn-success">Submit</button>');
    $submitBtn.on('click', function () {
      const ans = window.userAnswers[q.id];
      const isAnswered = checkAnswered(q, ans);
      if (!isAnswered) {
        showPopupMessage("Please answer the question before submitting.", false);
        return;
      }
      window.userAnswers[q.id].locked = true;
      persist();
      submitQuiz();
    });
    $nav.append($submitBtn);
  }

  $root.append($nav);
}

function checkAnswered(q, ans) {
  if (!ans) return false;

  if (q.type === 'multiple_choice') {
    return !!ans.selected;
  }

  if (q.type === 'matching' || q.type === 'fill_in_the_blanks') {
    const expectedKeys = q.prompts?.map(p => p.drop_id) || q.sentences?.map(s => s.drop_id) || [];
    return expectedKeys.every(key => ans[key] && ans[key].trim() !== '');
  }

  return false;
}

function renderMCQ(q, $root) {
  const $grp = $('<div class="list-group mb-3">');
  const locked = window.userAnswers[q.id]?.locked;
  q.options.forEach(opt => {
    const $it = $(`<button class="list-group-item list-group-item-action">${opt}</button>`);
    if (window.userAnswers[q.id]?.selected === opt) $it.addClass('active');
    if (locked) $it.attr('disabled', true);
    $it.on('click', function() {
      if (locked) return;
      $it.siblings().removeClass('active');
      $it.addClass('active');
      window.userAnswers[q.id] = {
        selected: opt,
        locked: false
      };
      persist();

      const isCorrect = opt === q.answer;
      showPopupMessage(isCorrect ? "Correct!" : "Incorrect", isCorrect);
    });
    $grp.append($it);
  });
  $root.append($grp);
}

function renderMatching(q, $root) {
  const $row = $('<div class="row">'),
        $l = $('<div class="col-md-6">'),
        $r = $('<div class="col-md-6 text-center">');

  const locked = window.userAnswers[q.id]?.locked;

  q.prompts.forEach(p => {
    const prev = (window.userAnswers[q.id] || {})[p.drop_id] || '';
    $l.append(`<div class="mb-3">
                <strong>${p.text}</strong>
                <div id="${p.drop_id}" class="drop-zone p-2 border bg-light" style="min-height:2rem;">${prev}</div>
              </div>`);
  });

  q.options.forEach(opt => {
    const $opt = $(`<div class="draggable btn btn-outline-dark mb-2" draggable="true">${opt}</div>`);
    if (locked) $opt.attr('draggable', false).addClass('disabled');
    $r.append($opt);
  });

  $row.append($l, $r);
  $root.append($row);

  $('.draggable').on('dragstart', e => {
    if (locked) return;
    e.originalEvent.dataTransfer.setData('text', e.target.innerText);
  });

  $('.drop-zone')
    .on('dragover', e => {
      if (!locked) e.preventDefault();
    })
    .on('drop', function(e) {
      if (locked) return;
      e.preventDefault();
      const val = e.originalEvent.dataTransfer.getData('text');
      $(this).text(val);

      window.userAnswers[q.id] = window.userAnswers[q.id] || {};
      window.userAnswers[q.id][this.id] = val;
      persist();

      const ans = window.userAnswers[q.id];
      const expected = q.answer;
      const allFilled = Object.keys(expected).every(key => ans[key]);
      if (allFilled) {
        const isCorrect = Object.keys(expected).every(key => ans[key] === expected[key]);
        showPopupMessage(isCorrect ? "Correct!" : "Incorrect", isCorrect);
      }
    });
}

function renderFillBlanks(q, $root) {
  const locked = window.userAnswers[q.id]?.locked;

  q.options.forEach(opt => {
    const $opt = $(`<span class="draggable btn btn-outline-secondary me-1 mb-2" draggable="true">${opt}</span>`);
    if (locked) $opt.attr('draggable', false).addClass('disabled');
    $root.append($opt);
  });

  $root.append('<br><br>');

  q.sentences.forEach(s => {
    const prev = (window.userAnswers[q.id] || {})[s.drop_id] || '';
    const dropHTML = `<div id="${s.drop_id}" class="drop-zone p-2 border bg-light">${prev}</div>`;
    $root.append(`<p>${s.text.replace(
      `<div id='${s.drop_id}' class='drop-zone'></div>`, dropHTML
    )}</p>`);
  });

  $('.draggable').on('dragstart', e => {
    if (locked) return;
    e.originalEvent.dataTransfer.setData('text', e.target.innerText);
  });

  $('.drop-zone')
    .on('dragover', e => {
      if (!locked) e.preventDefault();
    })
    .on('drop', function(e) {
      if (locked) return;
      e.preventDefault();
      const val = e.originalEvent.dataTransfer.getData('text');
      $(this).text(val);

      window.userAnswers[q.id] = window.userAnswers[q.id] || {};
      window.userAnswers[q.id][this.id] = val;
      persist();

      const ans = window.userAnswers[q.id];
      const expected = q.answer;
      const allFilled = Object.keys(expected).every(key => ans[key]);
      if (allFilled) {
        const isCorrect = Object.keys(expected).every(key => ans[key] === expected[key]);
        showPopupMessage(isCorrect ? "Correct!" : "Incorrect", isCorrect);
      }
    });
}

function submitQuiz() {
  fetch('/submit_quiz',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({answers:window.userAnswers})
  })
  .then(r=>r.text())
  .then(html=>{
    document.open(); document.write(html); document.close();
    localStorage.removeItem('userAnswers');
  })
  .catch(console.error);
}

function showPopupMessage(text, isCorrect) {
  const popup = document.getElementById('popup-message');
  popup.textContent = text;
  popup.style.backgroundColor = isCorrect ? '#198754' : '#dc3545'; // green or red
  popup.classList.remove('d-none');
  popup.classList.add('show');

  // hide after 2 seconds
  setTimeout(() => {
    popup.classList.remove('show');
    popup.classList.add('d-none');
  }, 2000);
}