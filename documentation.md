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

To run the tuto, first copy Data/*.png in TEMPO_PATH (see cmake options)


# Itk types

Almost all itk types are defined in any dimension, but do not have nice constructors. We provide convenient generator functions:
```c++
Index ind  = gen_index(0,0);
Size  sz   = gen_size(256,256);
Region reg = gen_region(0,0,256,256);
```


## PixelType

The pixel accessors (*pixelAbsolute()*, *pixelRelative()*) and the traversal use *itk::RGBPixel\<CHANNEL_TYPE\>* and *itk::RGBAPixel\<CHANNEL_TYPE\>* 
types. To avoid the lack of pratical constructor, convenient functions * itkPixel(...) * are provided.
```c++
auto pi = ImageRGBu8::itkPixel(65, 55, 45);
auto pi = ImageRGBu8::itkPixel(255); // [255,255,255]
```


## Eigen conversion.
To benefit of all computation capabilities of Eigen vector types we provide conversion fonctions *eigenPixel\<T\>(p)*. The template parameter T is
the scalar type of Eigen vectors (int8\_t,..., double). 
The conversion can be done on the fly when accessing (read/write) to the image with *pixelEigenAbsolute* method:
```c++
using DPE = IMG::DoublePixelEigen;
DPE dp1 = image.pixelEigenAbsolute(0,0);
DPE dp2 = image.pixelEigenAbsolute(1,0);
DPE dp3 = image.pixelEigenAbsolute(2,0);
image.pixelEigenAbsolute(1,1) = (dp1+dp2+dp3)/3;
```
This allow to easily avoid overflow problem when working with *uint8\_t* pixels.
It could also be interesting to normalize floating point value into \[0,1\] during the conversion. It can be done by using
*normalized*, *unnormalized* conversion functions and *pixelNormEigenAbsolute* accessor.
>>>>>>> refs/remotes/origin/master


# Image traversal

## With classical nested loop

```c++
for(int j=0; j<img.height(); ++j)
    for(int i=0; i<img.width(); ++i)
	img.pixelAbsolute(i,j) = ...
```
or if you do not want to think about the order of loops !
```c++
for_indices(0,img.width(), 0, img.height(), [&] (int x, int y)
{
   img.pixelAbsolute(i,j) = ...
});
```


## With iterators

Images can be traversed using itk iterators. We just provide simplified syntax of the begin method. Iterators can be const or not, and indexed or not.
Indexed mean that you can get back position of pixel from iterator.


```c++
...
for (auto it = image.beginConstIterator(); !it.IsAtEnd(); ++it)
{
   average += ImageRGBu8::eigenPixel<double>(it.Value());
   nb ++;
}
average /= nb;
std::cout << "Average: "<<ImageRGBu8::itkPixel(average) << std::endl;
...
Region reg = gen_region(0,0,128,64);
for (auto it = image.beginConstIterator(reg); !it.IsAtEnd(); ++it)
{
   average += ImageRGBu8::eigenPixel<double>(it.Value());
   nb ++;
}
average /= nb;
std::cout << "Average: "<<ImageRGBu8::itkPixel(average) << std::endl;
```


## With for\_all\_pixel fonction

The *for\_all\_pixel* methods allow the traversal of the image, a lambda expression is applied on each pixel.
It could have different parameters:
* reference to pixel
* const reference to pixel if method is called on const ref image. 
* \[const\] reference to pixel and pixel position in image.

```c++
img1.for_all_pixels([] (double& p)
{
    p = 0.0;
});

img2.for_all_pixels( [&] (ImageRGBf::PixelType& p, int x, int y)
{
    p = ImageRGBf::itkPixel(0,0,0);
}
```

## Parallel optimisation

Just by prefixing the for\_all\_pixel method by parallel\_ the traversal is split on as many threads as available on your hardware.
Performance acceleration depend on the ratio memory access / computations. 
Of course data race probleme is left to the attention of the library user.

For per thread storage problem you can add a thread id parameter to your lambda (uint16\_t type)

```c++
std::vector<double> totals(nb_launched_threads(),0.0);
imgA.parallel_for_region_pixels(rA, [&] (ImageGreyd::PixelType& p, uint16_t th_id)
{
    totals[th_id] += p
});
double total=0.0;
for(double t: totals)
    total+= t;
```

# Mask

A mask is a generic class that expose its () operator (x,y) that return a bool. We provide several kinds of masks:
* MaskDist
* MaskLargestValue
* MaskSmallestValue
* MaskAboveThreshold
* MaskBelowThreshold

It is easily usable with *for\_all\_pixel* traversal:

```c++
// a booelan mask filled randomly with true at 10%
MaskBool mask(img.width(), img.height());
mb.random(0.1);

image.for_all_pixels([&] (ImageRGBu8::PixelType& pix)
{
    pix=ImageRGBu8::itkPixel(0);
},mask);

image.for_all_pixels([&] (ImageRGBu8::PixelType& pix, int x, int y)
{
    pix=ImageRGBu8::itkPixel(200);
},
[&](int i, int j) { return i<j;}
);
```



# Input-Output

Images can simply be loaded/saved with the load/save methods if image type is supported by file format (which is deduced from filename extension).

We also provide convenient functions for loading/saving floating point images (in \[0,1\]) from/to classic 8 bits file formats:
*loadu8_in_01(img, filename)* and *save01_in_u8(img, filename)*

*IO::EXR::load(img,filename)* and *IO::EXR::save(img,filename)* can be used with floating point images, to load/save in the ILM [OpenEXR](http://www.openexr.com/) file format


# Fourier

** under construction **

