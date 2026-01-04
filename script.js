$(document).ready(function () {
    const cropBox = $('#cropBox');
    const image = $('#utensil-img');
    const thumb = $('#thumbImage');
    const orientationInput = $('#imageorientation');

    // crop coordinates relative to the original image
    let state = {
        x1: parseInt($('#x1').val()),
        x2: parseInt($('#x2').val()),
        y1: parseInt($('#y1').val()),
        y2: parseInt($('#y2').val())
    };

    // Rotation in degrees
    let rotation = initialRotation; 
    image.css('transform', `rotate(${rotation}deg)`);

    // Image dimensions
    const imgWidth = image.width();
    const imgHeight = image.height();

    // Update crop box and thumbnail
    function updateCropBox() {
        let x1 = state.x1;
        let x2 = state.x2;
        let y1 = state.y1;
        let y2 = state.y2;

        if (x2 < x1) [x1, x2] = [x2, x1];
        if (y2 < y1) [y1, y2] = [y2, y1];

        let side = Math.min(x2 - x1, y2 - y1);
        if (side <= 0) return;

        // calculate rotated positions for crop box
        let left, top;
        switch (rotation % 360) {
            case 0:
                left = x1; top = y1; break;
            case 90:
                left = imgWidth - y2; top = x1; break;
            case 180:
                left = imgWidth - x2; top = imgHeight - y2; break;
            case 270:
                left = y1; top = imgHeight - x2; break;
        }

        cropBox.css({
            left: left + 'px',
            top: top + 'px',
            width: side + 'px',
            height: side + 'px'
        });

        // Update thumbnail
    //     const scale = 60 / side;
    //     let thumbLeft = -x1 * scale;
    //     let thumbTop = -y1 * scale;
    //     switch (rotation % 360) {
    //         case 90:
    //             thumbLeft = -y1 * scale;
    //             thumbTop = - (imgWidth - x2) * scale;
    //             break;
    //         case 180:
    //             thumbLeft = - (imgWidth - x2) * scale;
    //             thumbTop = - (imgHeight - y2) * scale;
    //             break;
    //         case 270:
    //             thumbLeft = - (imgHeight - y2) * scale;
    //             thumbTop = - x1 * scale;
    //             break;
    //     }

    //     thumb.css({
    //         left: thumbLeft + 'px',
    //         top: thumbTop + 'px',
    //         transform: `scale(${scale}) rotate(${rotation}deg)`,
    //         transformOrigin: 'top left'
    //     });
    // }


  // Update thumbnail
const scale = 60 / side; // thumbnail scale

let thumbLeft = -state.x1 * scale;
let thumbTop = -state.y1 * scale;

// Adjust for main image rotation (simulate rotation)
switch (rotation % 360) {
    case 0: // 0°
        thumbLeft = -state.x1 * scale;
        thumbTop = -state.y1 * scale;
        break;
    case 90: // 90°
        thumbLeft = -state.y1 * scale;
        thumbTop = -(imgWidth - state.x2) * scale;
        break;
    case 180: // 180°
        thumbLeft = -(imgWidth - state.x2) * scale;
        thumbTop = -(imgHeight - state.y2) * scale;
        break;
    case 270: // 270°
        thumbLeft = -(imgHeight - state.y2) * scale;
        thumbTop = -state.x1 * scale;
        break;
}

thumb.css({
    left: thumbLeft + 'px',
    top: thumbTop + 'px',
    transform: `scale(${scale})`, // only scale, no rotate
    transformOrigin: 'top left'
});
    }


    // handle input changes
    $('#x1, #x2, #y1, #y2').on('input', function () {
        const val = parseInt(this.value);
        if (!isNaN(val)) state[this.id] = val;
        updateCropBox();
    });

    // rotate image
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
    updateOrientationInput();
});
