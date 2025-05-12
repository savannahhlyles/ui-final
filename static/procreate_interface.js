$(document).ready(function() {
  if ($('#interface-root').length) {
    buildInterfaceUI();
  }
});


function buildInterfaceUI(){
    var $root = $('#interface-root');
    let new_slide = "";
    if(loaded_slide.id === 1){
        new_slide = `
        <div class="row">
         <div class="big-bold bordered interface-heading-border">${loaded_slide.title}</div>

            <div class="col-md-12 row d-flex justify-content-center align-items-center">
                <div class="col-md-2 arrow">
                </div>
                <div class="cyan-box" style="left: ${loaded_slide.boxx}%; top: ${loaded_slide.boxy}%;"></div>
                <div class="slide col-md-8">
                    <img src="/static/media/Procreate_interface/slide${loaded_slide.id}.png" class="img-fluid">
                </div>
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id + 1}">
                        <img src="/static/media/Procreate_interface/right_arrow.png" class="img-fluid">
                    </a>
                </div>
            </div>
        </div>`;
    }else if(loaded_slide.id === 5){
        new_slide = `
        <div class="row">
            <div class="big-bold bordered interface-heading-border">${loaded_slide.title}</div>
            <div class="col-md-12 row d-flex justify-content-center align-items-center">
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id - 1}">
                        <img src="/static/media/Procreate_interface/left_arrow.png" class="img-fluid">
                    </a>
                </div>
                <div class="cyan-box" style="left: ${loaded_slide.boxx}%; top: ${loaded_slide.boxy}%;"></div>
                <div class="slide col-md-8">
                    <img src="${loaded_slide.img}" class="img-fluid">
                </div>
                <div class="col-md-2 arrow">
                </div>
            </div>
        </div>`;
    }else {
        new_slide = `
        <div class="row">
            <div class="big-bold bordered interface-heading-border">${loaded_slide.title}</div>
            <div class="col-md-12 row d-flex justify-content-center align-items-center">
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id - 1}">
                        <img src="/static/media/Procreate_interface/left_arrow.png" class="img-fluid">
                    </a>
                </div>
                <div class="cyan-box" style="left: ${loaded_slide.boxx}%; top: ${loaded_slide.boxy}%;"></div>
                <div class="slide col-md-8">
                    <img src="/static/media/Procreate_interface/slide${loaded_slide.id}.png" class="img-fluid">
                </div>
                <div class="col-md-2 arrow">
                    <a href="/procreate/${loaded_slide.id + 1}">
                        <img src="/static/media/Procreate_interface/right_arrow.png" class="img-fluid">
                    </a>
                </div>
            </div>
        </div>`;
    }
    $root.append(new_slide);
}



