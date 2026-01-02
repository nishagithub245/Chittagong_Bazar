<?php
include 'db_connection.php';



// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $x1 = intval($_POST['x1']);
    $x2 = intval($_POST['x2']);
    $y1 = intval($_POST['y1']);
    $y2 = intval($_POST['y2']);
    $imageorientation = intval($_POST['imageorientation']);

    
     // Always insert a new row
    $sql = "INSERT INTO croppedimage (x1, x2, y1, y2, imageorientation)
            VALUES ($x1, $x2, $y1, $y2, $imageorientation)";

    if ($conn->query($sql) === TRUE) {
        
        // echo "New record created successfully";
    } else {
        echo "Error: " . $conn->error;
    }


    //Redirect to prevent form resubmission on refresh
    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}



 
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chittagong Bazaar - Image Crop & Rotate</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>
<body>

 <div class="container">

  <div class="left-panel">
    <div class="image-area">
      <img id="utensil-img" src="http://bit.ly/2hRajbp" alt="Cooking utensil set">
      <div class="crop-box" id="cropBox"></div>
    </div>

    <div class="thumbnail-preview">
      <h4>Thumbnail preview</h4>
      <div class="thumb-box">
        <img id="thumbImage" src="http://bit.ly/2hRajbp" alt="Thumbnail preview">
      </div>
    </div>
  </div>

  <form method="POST" class="controls" id="cropForm">
    <div class="input-group">
      <input type="number" name="x1" id="x1" value="<?php echo $x1; ?>">
      <label>x1</label>
    </div>

    <div class="input-group">
      <input type="number" name="x2" id="x2" value="<?php echo $x2; ?>">
      <label>x2</label>
    </div>

    <div class="input-group">
      <input type="number" name="y1" id="y1" value="<?php echo $y1; ?>">
      <label>y1</label>
    </div>

    <div class="input-group">
      <input type="number" name="y2" id="y2" value="<?php echo $y2; ?>">
      <label>y2</label>
    </div>

    <div class="rotate-buttons">
      <button type="button" id="rotateLeft">Rotate anticlockwise</button>
      <button type="button" id="rotateRight">Rotate clockwise</button>
    </div>

    <input type="hidden" name="imageorientation" id="imageorientation" value="1">


    <button type="submit" class="submit-btn">Submit changes</button>
  </form>

</div>



  <script src="script.js"></script>

 
</body>
</html>
