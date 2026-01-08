$(document).ready(function () {
    const cropBox = $('#cropBox');
    const image = $('.image-area');
    const imgTag = $('#utensil-img');

    const thumb = $('#thumbImage');
    const orientationInput = $('#imageorientation');

    // Initial state from input fields
    let state = {
        x1: parseInt($('#x1').val()),
        x2: parseInt($('#x2').val()),
        y1: parseInt($('#y1').val()),
        y2: parseInt($('#y2').val())
    };

    // Rotation in degrees
    let rotation = 0;
    imgTag.css('transform', 'rotate(0deg)');
    orientationInput.val(1);

    // Image dimensions
    let imgWidth = 0;
    let imgHeight = 0;

    // Random crop box on load
    function setRandomCrop() {
        const minSide = 40;
        const maxSide = Math.min(imgWidth, imgHeight) / 2;

        const side = Math.floor(
            Math.random() * (maxSide - minSide) + minSide
        );

        const maxX = imgWidth - side;
        const maxY = imgHeight - side;

        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        state.x1 = x;
        state.y1 = y;
        state.x2 = x + side;
        state.y2 = y + side;
    }

    // Clamp values to stay inside image
    function clampValues() {
        state.x1 = Math.max(0, Math.min(state.x1, imgWidth));
        state.x2 = Math.max(0, Math.min(state.x2, imgWidth));
        state.y1 = Math.max(0, Math.min(state.y1, imgHeight));
        state.y2 = Math.max(0, Math.min(state.y2, imgHeight));
    }

    // Enforce square crop
    function enforceSquare(activeField) {
        let width = Math.abs(state.x2 - state.x1);
        let height = Math.abs(state.y2 - state.y1);

        if (activeField === 'x1' || activeField === 'x2') {
            // User controls width → adjust height
            if (state.y2 >= state.y1) {
                state.y2 = state.y1 + width;
            } else {
                state.y2 = state.y1 - width;
            }
        }

        if (activeField === 'y1' || activeField === 'y2') {
            // User controls height → adjust width
            if (state.x2 >= state.x1) {
                state.x2 = state.x1 + height;
            } else {
                state.x2 = state.x1 - height;
            }
        }

        clampValues();
    }

    // Update crop box and thumbnail
    function updateCropBox() {
        if (
            isNaN(state.x1) || isNaN(state.x2) ||
            isNaN(state.y1) || isNaN(state.y2)
        ) return;

        let x1 = state.x1;
        let x2 = state.x2;
        let y1 = state.y1;
        let y2 = state.y2;

        if (x2 < x1) [x1, x2] = [x2, x1];
        if (y2 < y1) [y1, y2] = [y2, y1];

        let side = x2 - x1;

        // Crop box position relative to image
        cropBox.css({
            left: x1 + 'px',
            top: y1 + 'px',
            width: side + 'px',
            height: side + 'px'
        });

        // Thumbnail preview
        const scale = 60 / side;
        let thumbLeft = -x1 * scale;
        let thumbTop = -y1 * scale;

        switch (rotation % 360) {
            case 0:
                thumbLeft = -x1 * scale; thumbTop = -y1 * scale; break;
            case 90:
                thumbLeft = -y1 * scale; thumbTop = -(imgWidth - x2) * scale; break;
            case 180:
                thumbLeft = -(imgWidth - x2) * scale; thumbTop = -(imgHeight - y2) * scale; break;
            case 270:
                thumbLeft = -(imgHeight - y2) * scale; thumbTop = -x1 * scale; break;
        }

        thumb.css({
            left: thumbLeft + 'px',
            top: thumbTop + 'px',
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'top left'
        });

        // Update input fields
        $('#x1').val(state.x1);
        $('#x2').val(state.x2);
        $('#y1').val(state.y1);
        $('#y2').val(state.y2);
    }

    // Handle input changes
    $('#x1, #x2, #y1, #y2').on('input', function () {
        const val = parseInt(this.value);
        if (isNaN(val)) return;

        state[this.id] = val;
        enforceSquare(this.id);
        updateCropBox();
    });

    // Rotate image
    function rotateImage(delta) {
        rotation = (rotation + delta + 360) % 360;
        imgTag.css('transform', `rotate(${rotation}deg)`);
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

    // Initialize on page load AFTER image loads
    imgTag.on('load', function () {
        imgWidth = image.width();
        imgHeight = image.height();

        setRandomCrop();
        updateCropBox();
        updateOrientationInput();

        console.log('Image loaded:', imgWidth, imgHeight);
    });

    // If the image is cached and already loaded, trigger the handler manually
    if (imgTag[0].complete) {
        imgTag.trigger('load');
    }
});
