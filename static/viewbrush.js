document.addEventListener('DOMContentLoaded', () => {
    const pencil = document.getElementById('drag-pencil');
    const area    = document.getElementById('sketch-area');
  
    // When dragging starts, tag the drag data
    pencil.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', 'pencil');
    });
  
    // Visual highlight on drag over
    area.addEventListener('dragover', e => {
      e.preventDefault();
      area.classList.add('border-primary');
    });
    area.addEventListener('dragleave', () => {
      area.classList.remove('border-primary');
    });
  
    // On drop, look up the demo image for this brush and show it
    area.addEventListener('drop', e => {
      e.preventDefault();
      area.classList.remove('border-primary');
      const data = e.dataTransfer.getData('text/plain');
      if (data === 'pencil') {
        // clear the demo area
        area.innerHTML = '';
        // find the slug
        const slug = area.getAttribute('data-slug');
        // pick the right image (fallback to a default if missing)
        const src = window.demoMap[slug] ||
                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_3kHOrLPKFnNLrpipnc-fF7VirX2iiOPQ2g&s';
        // create and insert the image
        const img = document.createElement('img');
        img.src = src;
        img.alt = `${slug} demo`;
        img.style.width     = '100%';
        img.style.height    = '100%';
        img.style.objectFit = 'contain';
        area.appendChild(img);
      }
    });
  });
  