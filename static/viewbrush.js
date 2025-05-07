document.addEventListener('DOMContentLoaded', () => {
  const pencil = document.getElementById('drag-pencil');
  const area = document.getElementById('sketch-area');
  const sketchImg = document.getElementById('sketch-image');

  // When dragging starts, tag the drag data
  pencil.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', 'pencil');
  });

  // Visual feedback
  area.addEventListener('dragover', e => {
    e.preventDefault();
  });

  area.addEventListener('dragleave', () => {
    area.classList.remove('border-highlight');
  });

  // On drop, show the sketch image
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('border-highlight');

    const data = e.dataTransfer.getData('text/plain');
    if (data === 'pencil') {
      const slug = area.getAttribute('data-slug');
      const src = `/static/media/demos/${slug}`;
      sketchImg.src = src;
      sketchImg.alt = `Sketch for ${slug}`;
      sketchImg.style.display = 'block';
    }
  });

  const sketchImage = document.getElementById('sketch-image');
const infoBoxesContainer = document.getElementById('info-boxes');
const progressBarFill = document.getElementById('progress-bar-fill');

const messages = [
  'Light Pressure for Construction Line',
  'Hard Pressure for Definition and Proportion',
  'Use with Low Opacity for Natural Feel'
];

let clickCount = 0;

sketchImage.addEventListener('click', () => {
  if (clickCount < messages.length) {
    const box = document.createElement('div');
    box.classList.add('info-box');
    box.textContent = messages[clickCount];
    infoBoxesContainer.appendChild(box);

    // Update progress bar
    progressBarFill.style.width = `${((clickCount + 1) / messages.length) * 100}%`;

    clickCount++;
  }
});

});
