<?php
include 'db_connection.php';

/* ---------------- FETCH LAST STATE ---------------- */

$sql = "SELECT * FROM croppedimage ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $x1 = $row['x1'];
    $x2 = $row['x2'];
    $y1 = $row['y1'];
    $y2 = $row['y2'];
    $imageorientation = $row['imageorientation'];
} else {
    $x1 = 50;
    $x2 = 150;
    $y1 = 50;
    $y2 = 150;
    $imageorientation = 1;
}

/* ---------------- SAVE FORM ---------------- */

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $x1 = intval($_POST['x1']);
    $x2 = intval($_POST['x2']);
    $y1 = intval($_POST['y1']);
    $y2 = intval($_POST['y2']);
    $imageorientation = intval($_POST['imageorientation']);

    $sql = "INSERT INTO croppedimage (x1, x2, y1, y2, imageorientation)
            VALUES ($x1, $x2, $y1, $y2, $imageorientation)";

    $conn->query($sql);

    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}

/* ---------------- ROTATION SEED ---------------- */
$rotationDegrees = 0;
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Chittagong Bazaar - Image Crop & Rotate</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" href="style.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

<div class="container">

  <div class="left-panel">

    <div class="image-area">
      <!-- ROTATION CONTEXT -->
      <div id="rotateWrapper">
        <img id="utensil-img"
             src="http://bit.ly/2hRajbp"
             alt="Cooking utensil set">

        <div id="cropBox" class="crop-box"></div>
      </div>
    </div>

    <div class="thumbnail-preview">
      <h4>Thumbnail preview</h4>
      <div class="thumb-box">
        <img id="thumbImage"
             src="http://bit.ly/2hRajbp"
             alt="Thumbnail preview">
      </div>
    </div>

  </div>

  <form method="POST" class="controls" id="cropForm">

    <div class="input-group">
      <input type="number" name="x1" id="x1" value="<?= $x1 ?>">
      <label>x1</label>
    </div>

    <div class="input-group">
      <input type="number" name="x2" id="x2" value="<?= $x2 ?>">
      <label>x2</label>
    </div>

    <div class="input-group">
      <input type="number" name="y1" id="y1" value="<?= $y1 ?>">
      <label>y1</label>
    </div>

    <div class="input-group">
      <input type="number" name="y2" id="y2" value="<?= $y2 ?>">
      <label>y2</label>
    </div>

    <div class="rotate-buttons">
      <button type="button" id="rotateLeft">Rotate anticlockwise</button>
      <button type="button" id="rotateRight">Rotate clockwise</button>
    </div>

    <input type="hidden"
           name="imageorientation"
           id="imageorientation"
           value="<?= $imageorientation ?>">

    <button type="submit" class="submit-btn">Submit changes</button>

  </form>

</div>

<script>
let initialRotation = <?= $rotationDegrees ?>;
</script>
<script src="script.js"></script>

</body>
</html>
