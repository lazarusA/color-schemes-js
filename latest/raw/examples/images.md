# Image Generation & Processing

`color-schemes-js` is ideal for procedural image generation, fractals, pseudocolor false-color mapping, and pixel data manipulation in JavaScript and TypeScript.

<image-processing-demo>



</image-processing-demo>

## Procedural Fractals

When generating mathematical structures such as Julia Set or Mandelbrot fractals, each pixel's iteration count is normalized into $t \in <span>

0.0, 1.0

</span>

$ and mapped directly to a continuous colormap using `get(scheme, t)`.

## False-Color Pseudocolor Mapping

Pseudocolor mapping converts single-channel scalar data (such as topographic elevation heightmaps, thermal infrared, and medical ultrasound scans) into perceptually uniform colormaps. By combining continuous sampling with step quantization, you can generate topographic contour isolines or smooth elevation heatmaps without perceptual artifacts.
