# Usage

This content-slider widget can be used by instantiating a node Slider class.

# Example
include <script src="slider.js"></script>in <head> tag and add html in the <body> like:
 <div id="slider">
    <div>
    <div class="number-text">1 / 5</div>
    <img
        src="https://img.freepik.com/free-photo/wide-angle-shot-single-tree-growing-clouded-sky-during-sunset-surrounded-by-grass_181624-22807.jpg"
        style="width: 100%; height: 40rem"
    />
    <div class="text">Caption Text</div>
</div>

<script>
    const slider = new Slider(document.getElementById('slider'), { autoplayDuration: 3 }); // The constructor also gives option for adding autoplayDuration key for autoplaying and its duration.
    // The above slider will go to the next content in 3 seconds
</script>

The Slider will be initialized with a single content in carousel.

