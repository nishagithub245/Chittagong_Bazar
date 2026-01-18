$(document).ready(function () {

    const cropBox = $('#cropBox');
    const imgTag = $('#utensil-img');
    const imageArea = $('.image-area');
    const thumb = $('#thumbImage');
    const orientationInput = $('#imageorientation');
    const rotateWrapper = $('#rotateWrapper');

    let state = {
        x1: parseInt($('#x1').val()),
        x2: parseInt($('#x2').val()),
        y1: parseInt($('#y1').val()),
        y2: parseInt($('#y2').val())
    };

    let rotation = 0;
    let imgWidth = 0;
    let imgHeight = 0;

    /* ---------------- INITIAL STATE ---------------- */

    rotateWrapper.css({
        transform: 'rotate(0deg)',
        transformOrigin: 'center center'
    });
    orientationInput.val(1);

    /* ---------------- RANDOM CROP ---------------- */

    function setRandomCrop() {
        const minSide = 50;
        const maxSide = Math.min(imgWidth, imgHeight) / 2;
        const side = Math.floor(Math.random() * (maxSide - minSide) + minSide);

        const x = Math.floor(Math.random() * (imgWidth - side));
        const y = Math.floor(Math.random() * (imgHeight - side));

        state.x1 = x;
        state.y1 = y;
        state.x2 = x + side;
        state.y2 = y + side;
    }

    /* ---------------- CLAMP ---------------- */

  function clampValues() {
    let side = Math.abs(state.x2 - state.x1);

    // If side is bigger than the image itself, shrink it
    const maxSide = Math.min(imgWidth, imgHeight);
    if (side > maxSide) side = maxSide;

    // Clamp x within range
    if (state.x1 < 0) {
        state.x1 = 0;
        state.x2 = side;
    } else if (state.x2 > imgWidth) {
        state.x2 = imgWidth;
        state.x1 = imgWidth - side;
    }

    // Clamp y within range
    if (state.y1 < 0) {
        state.y1 = 0;
        state.y2 = side;
    } else if (state.y2 > imgHeight) {
        state.y2 = imgHeight;
        state.y1 = imgHeight - side;
    }

    // Ensure square stays inside even if resized
    state.x1 = Math.max(0, Math.min(state.x1, imgWidth - side));
    state.x2 = state.x1 + side;
    state.y1 = Math.max(0, Math.min(state.y1, imgHeight - side));
    state.y2 = state.y1 + side;
}

    /* ---------------- SQUARE ENFORCEMENT ---------------- */

    function enforceSquare(activeField) {
        let side;

        if (activeField === 'x1' || activeField === 'x2') {
            side = Math.abs(state.x2 - state.x1);
            state.y2 = state.y1 + side;
        }

        if (activeField === 'y1' || activeField === 'y2') {
            side = Math.abs(state.y2 - state.y1);
            state.x2 = state.x1 + side;
        }

        clampValues();
    }

    /* ---------------- CORE RENDER ---------------- */
   function updateCropBox() {

    if ([state.x1, state.x2, state.y1, state.y2].some(isNaN)) return;

    const normalizedRotation = ((rotation % 360) + 360) % 360;

    let x1 = Math.min(state.x1, state.x2);
    let y1 = Math.min(state.y1, state.y2);
    let side = Math.abs(state.x2 - state.x1);

    /* --- Crop box --- */
    cropBox.css({
        width: side + 'px',
        height: side + 'px',
        left: x1 + 'px',
        top: y1 + 'px'
    });

    /* --- Thumbnail --- */
  

const thumbSize = 60;
const scale = thumbSize / side;

// position thumbnail image normally (NO rotation here)
thumb.css({
    width: imgWidth * scale + 'px',
    height: imgHeight * scale + 'px',
    left: (-x1 * scale) + 'px',
    top: (-y1 * scale) + 'px',
    transform: 'none'
});

// rotate the thumbnail CONTAINER instead
$('.thumb-box').css({
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'center center'
});

    /* --- Sync inputs --- */
    $('#x1').val(state.x1);
    $('#x2').val(state.x2);
    $('#y1').val(state.y1);
    $('#y2').val(state.y2);
}


    /* ---------------- INPUT HANDLING ---------------- */

  $('#x1, #x2, #y1, #y2').on('input', function () {
    const val = parseInt(this.value);
    if (isNaN(val)) return;

    state[this.id] = val;
    enforceSquare(this.id);
    clampValues();      
    updateCropBox();
});


    /* ---------------- ROTATION ---------------- */

    function rotateImage(delta) {
        rotation = (rotation + delta + 360) % 360;

        rotateWrapper.css({
            transform: `rotate(${rotation}deg)`
        });

        updateCropBox();
        updateOrientationInput();
    }

    function updateOrientationInput() {
        orientationInput.val(
            rotation === 0 ? 1 :
            rotation === 90 ? 2 :
            rotation === 180 ? 3 : 4
        );
    }

    $('#rotateLeft').click(() => rotateImage(-90));
    $('#rotateRight').click(() => rotateImage(90));

    /* ---------------- INIT ON IMAGE LOAD ---------------- */

    imgTag.on('load', function () {
        imgWidth = imageArea.width();
        imgHeight = imageArea.height();

        setRandomCrop();
        updateCropBox();
        updateOrientationInput();
    });

    if (imgTag[0].complete) imgTag.trigger('load');

});

