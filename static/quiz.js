$(document).ready(function(){
  console.log('questions.js loaded');
  console.log('question global is:', question);
  console.log('totalQuestions global is:', totalQuestions);

  // make sure we actually have a question
  if (typeof question === 'undefined' || question === null) {
    $('#question-root').text('⚠️ Error: question data not found.');
    return;
  }

  renderQuestion(question);
});

function renderQuestion(q) {
  const $root = $('#question-root').empty();
  console.log('rendering question:', q);

  // Header
  $root.append(`<h2>${q.id}. ${q.text}</h2><hr>`);

  // Body by type
  if (q.type === 'matching') {
    renderMatching(q, $root);
  }
  else if (q.type === 'multiple_choice') {
    renderMCQ(q, $root);
  }
  else if (q.type === 'fill_in_the_blanks') {
    renderFillBlanks(q, $root);
  }
  else {
    $root.append(`<p>Unknown question type: ${q.type}</p>`);
  }

  // Navigation: Back / Next or Submit
  const backId = q.id > 1              ? q.id - 1 : null;
  const nextId = q.id < totalQuestions ? q.id + 1 : null;
  let nav = '<div class="mt-4">';
  if (backId) {
    nav += `<a href="/questions/${backId}" class="btn btn-secondary me-2">Back</a>`;
  }
  if (nextId) {
    nav += `<a href="/questions/${nextId}" class="btn btn-primary">Next</a>`;
  } else {
    nav += `<button id="submit-quiz" class="btn btn-success">Submit</button>`;
  }
  nav += '</div>';
  $root.append(nav);

  // Submit handler (only last page)
  $('#submit-quiz').on('click', () => {
    console.log('Submit clicked');
    gradeAllQuestions();
  });
}

function renderMatching(q, $root) {
  console.log('renderMatching', q);
  const $row   = $('<div class="row">'),
        $left  = $('<div class="col-md-6">'),
        $right = $('<div class="col-md-6 text-center">');

  q.prompts.forEach(p => {
    $left.append(`
      <div class="mb-3">
        <strong>${p.text}</strong>
        <div id="${p.drop_id}"
             class="drop-zone p-2 border bg-light"
             data-expected="${q.answer[p.drop_id]}"
             style="min-height:2em;"></div>
      </div>`);
  });

  q.options.forEach(opt => {
    $right.append(`
      <div class="draggable btn btn-outline-dark mb-2" draggable="true">
        ${opt}
      </div>`);
  });

  $row.append($left, $right);
  $root.append($row);

  // Submit for this question only (you could skip if you only grade at the end)
  const $submit = $('<button class="btn btn-success mt-3">Check This</button>');
  $root.append($submit);

  // Drag & Drop wiring
  $('.draggable').on('dragstart', e =>
    e.originalEvent.dataTransfer.setData('text', e.target.innerText)
  );
  $('.drop-zone')
    .on('dragover', e => e.preventDefault())
    .on('drop', function(e) {
      e.preventDefault();
      $(this).text(e.originalEvent.dataTransfer.getData('text'));
    });

  // Grade this prompt set
  $submit.on('click', () => {
    let correct = 0;
    q.prompts.forEach(p => {
      const $dz = $('#' + p.drop_id),
            user = $dz.text().trim(),
            exp  = $dz.data('expected');
      if (user === exp) {
        $dz.removeClass('bg-light').addClass('bg-success text-white');
        correct++;
      } else {
        $dz.removeClass('bg-light').addClass('bg-danger text-white');
      }
    });
    alert(`You got ${correct}/${q.prompts.length} here.`);
  });
}

function renderMCQ(q, $root) {
  console.log('renderMCQ', q);
  const $group = $('<div class="list-group mb-3">');
  q.options.forEach(opt => {
    const $item = $(`<button class="list-group-item list-group-item-action">${opt}</button>`);
    $group.append($item);

    $item.on('click', function(){
      const correct = opt === q.answer;
      $(this)
        .toggleClass('list-group-item-success', correct)
        .toggleClass('list-group-item-danger', !correct);
    });
  });
  $root.append($group);
}

function renderFillBlanks(q, $root) {
  console.log('renderFillBlanks', q);
  // very basic placeholder UI
  $root.append('<p><em>Drag and drop from the word bank below:</em></p>');
  // word bank
  const $bank = $('<div class="mb-3">Word Bank: </div>');
  q.options.forEach(opt => {
    $bank.append(
      `<span class="draggable btn btn-outline-secondary me-1" draggable="true">${opt}</span>`
    );
  });
  $root.append($bank);

  // sentences with blanks
  q.sentences.forEach(s => {
    $root.append(`<p>${s.text}</p>`);
  });

  // drag/drop handlers
  $('.draggable').on('dragstart', e =>
    e.originalEvent.dataTransfer.setData('text', e.target.innerText)
  );
  $('.drop-zone')
    .on('dragover', e => e.preventDefault())
    .on('drop', function(e) {
      e.preventDefault();
      $(this).text(e.originalEvent.dataTransfer.getData('text'));
    });
}

function gradeAllQuestions() {
  // this is where you could loop over all questions,
  // fetch their user answers from the DOM, compare
  // to your global `questions` array and build a summary.
  alert('Grading of all questions isn’t implemented yet.');
}
