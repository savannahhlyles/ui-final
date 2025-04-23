// static/js/learn.js
document.addEventListener('DOMContentLoaded', () => {
    const draggable = document.getElementById('draggable');
    const dropZone  = document.getElementById('droppable');
    const tips      = document.getElementById('tips');
  
    if (draggable && dropZone) {
      dragElement(draggable);
    }
  
    function dragElement(elm) {
      // allow absolute positioning
      elm.style.position = 'absolute';
      elm.style.top  = elm.offsetTop  + 'px';
      elm.style.left = elm.offsetLeft + 'px';
      let pos1=0, pos2=0, pos3=0, pos4=0;
  
      elm.onmousedown = function(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDrag;
        document.onmousemove = onDrag;
      };
  
      function onDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elm.style.top  = (elm.offsetTop  - pos2) + "px";
        elm.style.left = (elm.offsetLeft - pos1) + "px";
  
        // highlight drop zone if overlapping
        if (overlaps(elm, dropZone)) {
          dropZone.classList.add('highlight');
        } else {
          dropZone.classList.remove('highlight');
        }
      }
  
      function closeDrag() {
        document.onmouseup = null;
        document.onmousemove = null;
        dropZone.classList.remove('highlight');
  
        if (overlaps(elm, dropZone)) {
          // inject reveal image instead of text
          const url = elm.dataset.revealUrl;
          dropZone.innerHTML = `<img src="${url}" alt="Full sketch">`;
          if (tips) tips.classList.add('visible');
        }
      }
  
      function overlaps(a, b) {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        return !(
          ra.right  < rb.left  ||
          ra.left   > rb.right ||
          ra.bottom < rb.top   ||
          ra.top    > rb.bottom
        );
      }
    }
  });
  