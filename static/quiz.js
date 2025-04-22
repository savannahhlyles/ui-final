
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

  if (q.type === 'multiple_choice')      renderMCQ(q,$root);
  else if (q.type === 'matching')        renderMatching(q,$root);
  else if (q.type === 'fill_in_the_blanks') renderFillBlanks(q,$root);

  // nav / submit
  const backId = q.id>1 ? q.id-1 : null;
  const nextId = q.id<totalQuestions ? q.id+1 : null;
  let nav = '<div class="mt-4">';
  if (backId)  nav += `<a href="/questions/${backId}" class="btn btn-secondary me-2">Back</a>`;
  if (nextId)  nav += `<a href="/questions/${nextId}" class="btn btn-primary">Next</a>`;
  else         nav += `<button id="submit-quiz" class="btn btn-success">Submit</button>`;
  nav += '</div>';
  $root.append(nav);

  if (!nextId) {
    $('#submit-quiz').on('click', submitQuiz);
  }
}

function renderMCQ(q,$root) {
  const $grp = $('<div class="list-group mb-3">');
  q.options.forEach(opt=>{
    const $it = $(`<button class="list-group-item list-group-item-action">${opt}</button>`);
    if (window.userAnswers[q.id]===opt) $it.addClass('active');
    $it.on('click', function(){
      $it.siblings().removeClass('active');
      $it.addClass('active');
      window.userAnswers[q.id]=opt; persist();
    });
    $grp.append($it);
  });
  $root.append($grp);
}

function renderMatching(q,$root) {
  const $row = $('<div class="row">'),
        $l   = $('<div class="col-md-6">'),
        $r   = $('<div class="col-md-6 text-center">');
  q.prompts.forEach(p=>{
    const prev = (window.userAnswers[q.id]||{})[p.drop_id]||'';
    $l.append(`<div class="mb-3"><strong>${p.text}</strong><div id="${p.drop_id}" class="drop-zone p-2 border bg-light" style="min-height:2rem;">${prev}</div></div>`);
  });
  q.options.forEach(opt=>{
    $r.append(`<div class="draggable btn btn-outline-dark mb-2" draggable="true">${opt}</div>`);
  });
  $row.append($l,$r); $root.append($row);

  $('.draggable').on('dragstart', e=>e.originalEvent.dataTransfer.setData('text', e.target.innerText));
  $('.drop-zone')
    .on('dragover', e=>e.preventDefault())
    .on('drop', function(e){
      e.preventDefault();
      const val = e.originalEvent.dataTransfer.getData('text');
      $(this).text(val);
      window.userAnswers[q.id]=window.userAnswers[q.id]||{};
      window.userAnswers[q.id][this.id]=val; persist();
    });
}

function renderFillBlanks(q,$root) {
  q.options.forEach(opt=>{
    $root.append(`<span class="draggable btn btn-outline-secondary me-1" draggable="true">${opt}</span>`);
  });
  $root.append('<br><br>');
  q.sentences.forEach(s=>{
    const prev=(window.userAnswers[q.id]||{})[s.drop_id]||'';
    $root.append(`<p>${s.text.replace(
      `<div id='${s.drop_id}' class='drop-zone'></div>`,
      `<div id="${s.drop_id}" class="drop-zone p-2 border bg-light">${prev}</div>`
    )}</p>`);
  });
  $('.draggable').on('dragstart', e=>e.originalEvent.dataTransfer.setData('text', e.target.innerText));
  $('.drop-zone')
    .on('dragover', e=>e.preventDefault())
    .on('drop', function(e){
      e.preventDefault();
      const val=e.originalEvent.dataTransfer.getData('text');
      $(this).text(val);
      window.userAnswers[q.id]=window.userAnswers[q.id]||{};
      window.userAnswers[q.id][this.id]=val; persist();
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
