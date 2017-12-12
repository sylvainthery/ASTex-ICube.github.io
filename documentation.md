# Supported image types

Number of channels: 1/3/4

* ImageGray 1 channel
* ImageRGB 3 channels
* ImageRGBA 4 channels

With the possible channel types:

* int8 / int16 / int32 / int64
* uint8 / uint16 / uint32 / uint64
* float / double

And spectral images (1 channel) :

* float / double
* complex of float or double

All floating-point images can be load and save with on the fly conversion from \[0,1\]to uint8 classic file format or saved in EXR 32 bits float format (double is not supported).

# Tutorials

There are some tutorials that explain briefly concepts and data structures of ASTex:
* tuto_gray : loading, modifying and saving gray images
* tuto_rgb : loading, modifying and saving RGB images
* tuto_pixel_type: Usage of the PixelType and ASTexPixelType.
* tuto_traverse_iterators: how to traverse pixels using Iterator syntax (inherited from ITK)
* tuto_traverse_for\_all: how to traverse pixels using for_all_pixels c++11 lambda programming style.
* tuto_mask: definition, manipulation and usage of masks
* tuto\_png\_indexed
* tuto\_color\_filters: color conversion RGB LUV XYZ LAB
* tuto on creating filters
  * tuto_filter1: example of pure itk filters (mono-thread/multi-thread)
  * tuto_filter2: example of filters using ASTex syntax (simple, in place & mt)
  * tuto_filter3: example of filter with 2 inputs (1 output)
  * tuto_filter4: example of filter with 2 inputs of different types
  * tuto_filter5: example of filter with 4 ouputs of different types
  * tuto_filter6: example of filter with an output whose size is different from the input 
  * tuto_filter7: example of filter with 2 outputs of different size

To run the tuto, first copy Data/*.png in TEMPO_PATH(/tmp)



# PixelType
## IMG::PixelType

## Eigen conversion.


# Image traversal

## With classical for loop

## With iterators

## With for\_all\_pixel fonction
```c++
img.for_all_pixels([] (double& p)
{
    p = 0.0;
});
```


## Parallel optimisation

# Mask

# Input-Output




