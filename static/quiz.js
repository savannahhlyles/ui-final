
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

  if (q.img) {
    $root.append(`<div class="text-center mb-4">
      <img src="${q.img}" alt="Question image" class="img-fluid rounded shadow">
    </div>`);
  }

  if (q.id === 1) {
    const $videoContainer = $(`
      <div class="text-center mb-4">
        <video autoplay muted loop playsinline style="width: 500px;" class="rounded shadow">
          <source src="/static/media/BrushDemo.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    `);
    $root.append($videoContainer);
  }

  // Render question based on type
  if (q.type === 'multiple_choice') renderMCQ(q, $root);
  else if (q.type === 'matching') renderMatching(q, $root);
  else if (q.type === 'fill_in_the_blanks') renderFillBlanks(q, $root);

  const backId = q.id > 1 ? q.id - 1 : null;
const nextId = q.id < totalQuestions ? q.id + 1 : null;

const $navWrapper = $(`
  <div class="mt-5 d-flex justify-content-between">
    <div class="left-nav"></div>
    <div class="right-nav"></div>
  </div>
`);

const backLink = backId ? `/questions/${backId}` : '/quiz';
$navWrapper.find('.left-nav').append(
  `<a href="${backLink}" class="btn btn-secondary">Back</a>`
);

const answer = window.userAnswers[q.id] || {};
const selected = answer.selected;
const submitted = answer.submitted;

// Always show "Submit Answer" until submitted
if (!submitted) {
  const $submitAnswerBtn = $('<button class="btn btn-primary">Submit Answer</button>');
  $submitAnswerBtn.on('click', function () {
    if (!selected) {
      showPopupMessage("Please select an answer before submitting.", false);
      return;
    }
    const isCorrect = selected === q.answer;
    window.userAnswers[q.id].locked = true;
    window.userAnswers[q.id].submitted = true;
    persist();
    showPopupMessage(isCorrect ? "Correct!" : "Incorrect", isCorrect);
    renderQuestion(q); // Re-render to show Next/Submit Quiz
  });
  $navWrapper.find('.right-nav').append($submitAnswerBtn);
} else if (nextId) {
  const $nextBtn = $('<button class="btn btn-primary">Next</button>');
  $nextBtn.on('click', function () {
    window.location.href = `/questions/${nextId}`;
  });
  $navWrapper.find('.right-nav').append($nextBtn);
} else {
  const $submitQuizBtn = $('<button id="submit-quiz" class="btn btn-success">Submit Quiz</button>');
  $submitQuizBtn.on('click', function () {
    submitQuiz();
  });
  $navWrapper.find('.right-nav').append($submitQuizBtn);
}

$root.append($navWrapper);
}

function checkAnswered(q, ans) {
  if (!ans) return false;

  if (q.type === 'multiple_choice') {
    return !!ans.selected;
  }

  if (q.type === 'matching') {
    const expectedKeys = q.prompts?.map(p => p.drop_id) || [];
    return expectedKeys.every(key => ans[key] && ans[key].trim() !== '');
  }

  if (q.type === 'fill_in_the_blanks') {
    const expectedKeys = q.sentences?.map(s => s.drop_id) || [];
    return expectedKeys.every(key => ans[key] && ans[key].trim() !== '');
  }

  return false;
}

function renderMCQ(q, $root) {
  const $grp = $('<div class="list-group mb-3">');
  const answer = window.userAnswers[q.id] || {};
  const locked = answer.locked;

  // Render options
  q.options.forEach(opt => {
    const $it = $(`<button class="list-group-item list-group-item-action">${opt}</button>`);
    if (answer.selected === opt) $it.addClass('active');
    if (locked) $it.attr('disabled', true);
    $it.on('click', function () {
      if (locked) return;
      $it.siblings().removeClass('active');
      $it.addClass('active');
      window.userAnswers[q.id] = {
        selected: opt,
        locked: false,
        submitted: false
      };
      persist();
      renderQuestion(q); // Re-render to show submit button in nav
    });
    $grp.append($it);
  });

  $root.append($grp);
}

function renderMatching(q, $root) {
  const $row = $('<div class="row">'),
        $l = $('<div class="col-md-6">'),
        $r = $('<div class="col-md-6 text-center draggable-container">');

  const locked = window.userAnswers[q.id]?.locked;
  const currentAnswers = window.userAnswers[q.id] || {};

  // Drop zones (left)
  q.prompts.forEach(p => {
    const prev = currentAnswers[p.drop_id] || '';
    $l.append(`<div class="mb-3">
                <strong>${p.text}</strong>
                <div id="${p.drop_id}" class="drop-zone p-2 border bg-light" style="min-height:2rem;">${prev}</div>
              </div>`);
  });

  // Option bank (right)
  const used = Object.values(currentAnswers);
  q.options.forEach(opt => {
    if (!used.includes(opt)) {
      const $opt = $(`<div class="draggable btn btn-outline-dark mb-2" draggable="true">${opt}</div>`);
      if (locked) $opt.attr('draggable', false).addClass('disabled');
      $r.append($opt);
    }
  });

  $row.append($l, $r);
  $root.append($row);
  bindMatchingEvents(q, $root);
}

function bindMatchingEvents(q, $root) {
  const locked = window.userAnswers[q.id]?.locked;
  const $bank = $root.find('.draggable-container');

  $root.find('.draggable').off('dragstart').on('dragstart', e => {
    if (locked) return;
    e.originalEvent.dataTransfer.setData('text', e.target.innerText);
    e.originalEvent.dataTransfer.setData('fromDrop', e.target.dataset.fromDrop || '');
  });

  $root.find('.drop-zone').off('dragover drop')
    .on('dragover', e => { if (!locked) e.preventDefault(); })
    .on('drop', function (e) {
      if (locked) return;
      e.preventDefault();

      const val = e.originalEvent.dataTransfer.getData('text');
      const fromDropId = e.originalEvent.dataTransfer.getData('fromDrop');
      const prev = $(this).find('.draggable').text();

      if (prev && prev !== val) {
        $bank.append(`<div class="draggable btn btn-outline-dark mb-2" draggable="true">${prev}</div>`);
      }

      $(this).html(`<div class="draggable btn btn-outline-dark mb-2" draggable="true" data-from-drop="${this.id}">${val}</div>`);
      $bank.find('.draggable').filter((_, el) => el.innerText === val).remove();

      if (fromDropId && fromDropId !== this.id) {
        $(`#${fromDropId}`).html('');
        delete window.userAnswers[q.id][fromDropId];
      }

      window.userAnswers[q.id] = window.userAnswers[q.id] || {};
      window.userAnswers[q.id][this.id] = val;
      persist();

      bindMatchingEvents(q, $root);

      const ans = window.userAnswers[q.id];
      const expected = q.answer;
      const allFilled = Object.keys(expected).every(key => ans[key]);
      if (allFilled) {
        const isCorrect = Object.keys(expected).every(key => ans[key] === expected[key]);
        showPopupMessage(isCorrect ? "Correct!" : "Incorrect", isCorrect);
      }
    });

  // 🆕 Allow dropping back into the bank
  $bank.off('dragover drop')
    .on('dragover', e => { if (!locked) e.preventDefault(); })
    .on('drop', function (e) {
      if (locked) return;
      e.preventDefault();
      const val = e.originalEvent.dataTransfer.getData('text');
      const fromDropId = e.originalEvent.dataTransfer.getData('fromDrop');

      if (!val || !fromDropId) return;

      // Add back to bank
      $bank.append(`<div class="draggable btn btn-outline-dark mb-2" draggable="true">${val}</div>`);

      // Clear original drop zone
      $(`#${fromDropId}`).html('');
      delete window.userAnswers[q.id][fromDropId];
      persist();

      bindMatchingEvents(q, $root);
    });
}

function renderFillBlanks(q, $root) {
  const locked = window.userAnswers[q.id]?.locked;
  const currentAnswers = window.userAnswers[q.id] || {};

  // Render sentences with placeholders like {{drop1}}
  q.sentences.forEach(s => {
    const prev = currentAnswers[s.drop_id] || '';
    const dropHTML = `<span id="${s.drop_id}" class="drop-zone">${prev}</span>`;
    const safeText = s.text.replace(`{{${s.drop_id}}}`, dropHTML);
    $root.append(`<id="question-root" p>${safeText}</p>`);
  });

  // Create the word bank container
  const $bank = $('<div class="draggable-container" id="word-bank"></div>');
  $bank.append(`<h5 class="word-bank-header text-center w-100 mb-3">WORD BANK</h5>`);

  const used = Object.values(currentAnswers);
  q.options.forEach(opt => {
    if (!used.includes(opt)) {
      const $opt = $(`<span class="draggable btn btn-outline-secondary me-1 mb-2" draggable="true">${opt}</span>`);
      if (locked) $opt.attr('draggable', false).addClass('disabled');
      $bank.append($opt);
    }
  });

  $root.append($bank); // ⬅ Append to $root, not body
  bindFillEvents(q, $root);
}

function bindFillEvents(q, $root) {
  const locked = window.userAnswers[q.id]?.locked;
  const $bank = $root.find('.draggable-container');

  $root.find('.draggable').off('dragstart').on('dragstart', e => {
    if (locked) return;
    e.originalEvent.dataTransfer.setData('text', e.target.innerText);
    e.originalEvent.dataTransfer.setData('fromDrop', e.target.dataset.fromDrop || '');
  });

  $root.find('.drop-zone').off('dragover drop')
    .on('dragover', e => { if (!locked) e.preventDefault(); })
    .on('drop', function (e) {
      if (locked) return;
      e.preventDefault();

      const val = e.originalEvent.dataTransfer.getData('text');
      const fromDropId = e.originalEvent.dataTransfer.getData('fromDrop');
      const prev = $(this).find('.draggable').text();

      if (prev && prev !== val) {
        $bank.append(`<span class="draggable btn btn-outline-secondary me-1 mb-2" draggable="true">${prev}</span>`);
      }

      $(this).empty().append(
        $(`<span class="draggable btn btn-outline-secondary me-1 mb-2" draggable="true" data-from-drop="${this.id}">${val}</span>`)
      );
      $bank.find('.draggable').filter((_, el) => el.innerText === val).remove();

      if (fromDropId && fromDropId !== this.id) {
        $(`#${fromDropId}`).html('');
        delete window.userAnswers[q.id][fromDropId];
      }

      window.userAnswers[q.id] = window.userAnswers[q.id] || {};
      window.userAnswers[q.id][this.id] = val;
      persist();

      bindFillEvents(q, $root);

      const ans = window.userAnswers[q.id];
      const expected = q.answer;
      const allFilled = Object.keys(expected).every(key => ans[key]);
      if (allFilled) {
        const isCorrect = Object.keys(expected).every(key => ans[key] === expected[key]);
        showPopupMessage(isCorrect ? "Correct!" : "Incorrect", isCorrect);
      }
    });

  $bank.off('dragover drop')
    .on('dragover', e => { if (!locked) e.preventDefault(); })
    .on('drop', function (e) {
      if (locked) return;
      e.preventDefault();
      const val = e.originalEvent.dataTransfer.getData('text');
      const fromDropId = e.originalEvent.dataTransfer.getData('fromDrop');

      if (!val || !fromDropId) return;

      $bank.append(`<span class="draggable btn btn-outline-secondary me-1 mb-2" draggable="true">${val}</span>`);
      $(`#${fromDropId}`).html('');
      delete window.userAnswers[q.id][fromDropId];
      persist();

      bindFillEvents(q, $root);
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
  popup.style.backgroundColor = isCorrect ? '#5ac493' : '#eb4a44';
  popup.classList.remove('d-none');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('show');
    popup.classList.add('d-none');
  }, 4000);
}