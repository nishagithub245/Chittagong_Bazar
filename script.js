$(document).ready(function () {
    const cropBox = $('#cropBox');
    const image = $('#utensil-img');
    const thumb = $('#thumbImage');
    const orientationInput = $('#imageorientation');

    // crop coordinates relative to the original image
    let state = { x1: 0, x2: 100, y1: 0, y2: 100 };
    let rotation = 0; // in degrees

    function updateCropBox() {
        let x1 = state.x1;
        let x2 = state.x2;
        let y1 = state.y1;
        let y2 = state.y2;

        if (x2 < x1) [x1, x2] = [x2, x1];
        if (y2 < y1) [y1, y2] = [y2, y1];

        let side = Math.min(x2 - x1, y2 - y1);
        if (side <= 0) return;

        const imgWidth = image.width();
        const imgHeight = image.height();

        // clamp coordinates
        x1 = Math.max(0, Math.min(x1, imgWidth - side));
        y1 = Math.max(0, Math.min(y1, imgHeight - side));

        // Calculate crop box position depending on rotation
        let left = x1, top = y1;

        switch(rotation % 360) {
            case 0:
                left = x1; top = y1; break;
            case 90:
            case -270:
                left = imgWidth - y2;
                top = x1;
                break;
            case 180:
            case -180:
                left = imgWidth - x2;
                top = imgHeight - y2;
                break;
            case 270:
            case -90:
                left = y1;
                top = imgHeight - x2;
                break;
        }

        cropBox.css({
            left: left + 'px',
            top: top + 'px',
            width: side + 'px',
            height: side + 'px'
        });

        // Update thumbnail
        const scale = 60 / side;
        thumb.css({
            left: -(x1 * scale) + 'px',
            top: -(y1 * scale) + 'px',
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'top left'
        });
    }

    // input handling
    $('#x1, #x2, #y1, #y2').on('input', function () {
        const val = parseInt(this.value);
        if (!isNaN(val)) state[this.id] = val;
        updateCropBox();
    });

    // Rotate image and update orientation input
    function rotateImage(delta) {
        rotation = (rotation + delta + 360) % 360;
        image.css('transform', `rotate(${rotation}deg)`);
        updateCropBox();
        updateOrientationInput();
    }

    function updateOrientationInput() {
        let val = 1;
        switch(rotation) {
            case 0: val = 1; break;
            case 90: val = 2; break;
            case 180: val = 3; break;
            case 270: val = 4; break;
        }
        orientationInput.val(val);
    }

    $('#rotateLeft').click(() => rotateImage(-90));
    $('#rotateRight').click(() => rotateImage(90));

    // initialize
    updateCropBox();
});
