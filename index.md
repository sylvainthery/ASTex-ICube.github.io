
# Foreground

# Introduction

# Installation
## Dependencies:
To compile and use ASTex, you need some libraries:
- ITK 4.10 
- zlib
- libpng for saving/loading indexed  png images.
- openexr for saving/loading images in floating point format.

You need some classic development tools (minimal supported version)
- git
- cmake 3.0
- a _recent_C++ compiler 
	- g++ 4.9
	- clang 3.3
	- Visual Studio C++ 2015


## Linux

Just install packages:
- libinsighttoolkit4-dev (4.10 min)
- libpng-dev
- libopenexr-dev 


## Mac OS/X

The most simple way to install dependencies is to use [homebrew](https://brew.sh/) package system.
Then you can install the dependencies:
- brew install insighttoolkit
- brew install openexr
- brew install libpng

## Windows
### Software to install:
- VisualStudio C++ (2015 min)
- CMake (3.0 min),
- [ninja](https://ninja-build.org/) for multi-threaded compilation of dependencies 

### Source to downloads:
- get sources of zlib
- get sources of OpenEXR (use github, archive on OpenEXR.com has bugs)
- get sources of InsightToolKit

### Compile dependencies
- use furnished compilation scripts:
  - make a local copy of folder __script_windows__ to avoid pushing your modifications on git server
  - edit your installvars.bat (check path for exec, src and installation)
  - **WARNING** due to a limitation in Visual-Studio, source and build (of itk) directory path should not be too long (50 char) !
  - double click on install\_static\_debug.bat for compil/install of zlib/openexr/itk and creation of ASTex solution in static debug mode
  - or/and double click on install\_static\_release.bat for compil/install of zlib/openexr/itk and creation of ASTex solution in static release mode
  - or/and double click on install\_dynamic\_debug.bat for compil/install of zlib/openexr/itk and creation of ASTex solution in dynamic debug mode
  - or/adn double click on install\_dynamic\_release.bat for compil/install of zlib/openexr/itk and creation of ASTex solution in dynamic release mode
  - you can reset the ASTex solutions with the reset\_static\_astex\_solu.bat and reset\_dynamic\_astex\_solu.bat scripts
  - after you can customize your build with cmake-gui (using the right build directory)
- solutions are in folder build-astex-release / build-astex-debug
- all installed libs (including ASTex) are in the same folder:
  - to install ASTex just just generate the INSTALL target
  - installed-Release for release
  - installed-Debug for debug

## Data
Some tests, tutorials and algorithms use read example images and write some results.
In order to keep original Data directory of ASTex clean we use a copy which pass can be choosen 
at cmake configuration stage.

You have to copy yourself the contain of the Data directory in to the right place (see ASTEX\_TEMPO\_PATH clake variable).

## Compilation
### on Linux & Mac
Use CMake as usual:
* create a build directory as same level than ASTex (ASTex-build or ASTex-buildDebug for example)
* go inside build directory and do cmake ../ASTex (or use gui)
* or let (a recent) Qtcreator do the job !

### on Windows + VisualStudio
You have the choice:
* use CMake-gui
* or use the script _reset\_astex\_solu_ in your copy of _script\_windows_

Then launch Visual and load ASTex solution which has been generated in the build directory

### CMake Options
There are some original options/values that can be set at the cmake stage:

* ASTEX\_ALGO\_xxx choose to build the different implemented algorithms.
* ASTEX\_BUILD\_xxx choose to build bench/tuto/test
* ASTEX\_PERSO\_xxx for each directory added in ASTex that contain a CMakeLists.txt set this to ON to build. When you add a directory just relaunch cmake.
* ASTEX\_TEMPO\_PATH path of directory use to store images for test and tuto (copy ASTex/Data into it)
* ASTEX\_USE\_CPP14 set this to ON if VXL say that you are using a C++ standard version older than the one used ton compile the lib.

# Architecture

ASTex is based on the library [ITK](https://itk.org/).
As ITK can perform its algorithms (filters) on images of different dimension,
its syntax is often complex. Their system of filter that can be easily combined
is perfect for an high level usage, but is boring for quickly prototype application.

In order to easily and quickly prototype texture generation application, we propose
a syntax overlay for 2D image manipulation.

We propose also a new traversal syntax _for\_all\_pixels_ which parameter is a lambda (or functor or function) that can have different kind of signature:
* \[const\] PixelType \[&\]
* \[const\] PixelType \[&\], int x, int y

And also for the parallel version:
* \[const\] PixelType \[&\], int16 thread_index
* \[const\] PixelType \[&\], int x, int y, int16 thread_index

Algorithm writen with new syntax can easily be encapsulated into ITK filter system.
And the two syntaxes can also be mixed to profit of provided ITK algorithms.

We do not inherit from ITK image 


### Supported image types

Number of channels: 1/3/4

* ImageGray 1 channel
* ImageRGB 2 channels
* ImageRGBA 3 channels

With the possible channel types:

* int8 / int16 / int32 / int64
* uint8 / uint16 / uint32 / uint64
* float / double

And spectral images (1 channel) :

* float / double
* complex of float or double

## Tutorials
There is some tutorials that explain briefly concepts and data structures of ASTex:
* tuto_gray : 
* tuto_rgb :
* tuto_traverse_iterators: how to traverse pixels using Iterator syntax (inherited from ITK)
* tuto_traverse_for\_all: how to traverse pixels using for_all_pixels c++11 lambda programming style.
* tuto_pixel_type: Usage of the PixelType and ASTexPixelType.
* tuto_mask
* tuto\_color\_filters
* tuto on creating filters
  * tuto_filter1: example of pure itk filters (mono-thread/multi-thread)
  * tuto_filter2: example of filters using ASTex syntax (simple, in place & mt)
  * tuto_filter3: example of filter with 2 inputs (1 output)
  * tuto_filter4: example of filter with 2 inputs of different types
  * tuto_filter5: example of filter with 4 ouputs of different types
  * tuto_filter6: example of filter with an output whose size is different from the input 
  * tuto_filter7: example of filter with 2 outputs of different size
* tuto\_png\_indexed

To run the tuto, first copy Data/*.png in TEMPO_PATH(/tmp)

#implemented
# Implemented Algorithms

## Bi-Layer Textures

  Implementaion if the method presented in [GS17](https://hal.archives-ouvertes.fr/hal-01528537/).
Global implementation can be tested, but also 4 independant important step of the algorithm, as
described below.

Executable for Linux, Mac & Windows are [downloadable](http://igg.unistra.fr/People/guingo/)

\[GS17\] Guingo, Geoffrey and Sauvage, Basile and Dischler, Jean-Michel and Cani, Marie-Paule,
Bi-Layer Textures: A Model for Synthesis and Deformation of Composite Textures,
Comput. Graph. Forum, July 2017,

### Noise Filter

This filtering method creates homogeneous areas based on noise. 
It uses a local spectra descriptor coupled with a Joint Bilateral filter. 
The Local spectra descriptor (T loc) is a spectra of a small neighborhood around the pixel. By comparing this local descriptor, we can determine if two patches belong to the same noise or not. 
In this way, the filtering will be guided by the spatial distance, and by the spectral distance. If two pixel have a close local spectra, their will be blended.

Parameters: 
- size fft = size of local spectra descriptor
- filt size = filtering spatial neighborhoods ( set to 16 ) 
- sig_freq = distance between spectra (set to 0.01 )
- nb_step_filt = number of interations (set to 5 times )


### Noise KMean

 This clustering method extract areas based on noise. The method proceed to a kmean clustering using the local spectra descriptor as distance. 
Clusters in this high dimension domain will be the masks. 

Parameters:
- size fft = size of local spectra descriptor
- nb_cluster = usually between 2-4

### Synthesis_corel

Extract the noise(PSD) from the different areas determined by the masks using AutoCorrelation constrainted on the content, to only pick up pixel which belong to the mask, discarding the missing informations. Then synthesis a noise layer using [RPN](http://www.math-info.univ-paris5.fr/~bgalerne/galerne_gousseau_morel_random_phase_textures_final_preprint.pdf) for each extracted PSD. 

Parameter:
- nb_cluster = need to be correlated with the masks provided


### Biscalenoisepatchexg:

modified the mono-scale version of On-the-Fly Multi-Scale Infinite Texturing from Example \[VSLD13\], without complex color transfers and texture fetches. It consists in Wang tiles, in which patch contents are randomly exchanged. Allowing for contents to be rotated (by angle θ ∈ {π/4, π/2, 3π/4, π}) and scaled (0.5 ≤ λ ≤ 1), and applying turbulence. 

\[VSLD13\] K. Vanhoey, B. Sauvage, F. Larue, J-M. Dischler
On-the-Fly Multi-Scale Infinite Texturing from Example, Siggraph Asia, Hong Kong, Hong Kong, ACM Siggraph (Eds.), ACM, ACM Siggraph Asia 2013 Papers, Volume 32, n° 6, novembre 2013, doi:10.1145/2508363.2508383, Oral, Long, 

Parameters:??

If used in Bi-Layer textures context, structure layer + synchronized maks will be synthesised using this method then Noise layer will be added. 


## Texton Analysis
Analysis part of Texton Noise [article](https://hal.archives-ouvertes.fr/hal-01299336v2/document). Generates all possible sizes of texton for a given input.

## Periodic plus smooth
Implementation of Periodic plus smooth image decomposition [article](http://www.math-info.univ-paris5.fr/~moisan/papers/2009-11r.pdf)



## Graphcut textures
The GCTexture class implements the patch-based graphcut texture synthesis method described in \[KSE+03\], using the Maxflow library \[Maxflow\]. It provides the three selection methods proposed in the paper (random placement, entire patch matching and sub-patch matching) as well as the possibility to refine synthesis results based on cut errors. The implementation of the FFT-based acceleration of SSD evaluation is not available for now. Graphcut texture synthesis combines optimal patch placement and computation of optimal cuts of arbitrary shape, which yields high-quality results for a large class of textures (stochastic to structured).

\[KSE+03\] Vivek Kwatra, Arno Schödl, Irfan Essa, Greg Turk, and Aaron Bobick. 2003. Graphcut textures: image and video synthesis using graph cuts. ACM Trans. Graph. (Proc. SIGGRAPH 2003), 22(3):277-286, 2003. DOI: https://doi.org/10.1145/882262.882264 

\[Maxflow\] Maxflow library, Vladimir Kolmogorov, [WebSite](http://pub.ist.ac.at/~vnk/software.html)

## PatchMatch
The PatchMatch code is adapted from the "minimal unoptimized example of PatchMatch" by Barnes et al. \[BSF+09, PatchMatch\]. PatchMatch is an efficient algorithm for matching small patches between an input and an output texture, that alternates coherent and random searches.

\[BSF+09\] C. Barnes, E. Shechtman, A. Finkelstein, and D. B. Goldman. PatchMatch: A Randomized Correspondence Algorithm for Structural Image Editing. ACM Transactions on Graphics (Proc. SIGGRAPH), 28(3), 2009.

\[PatchMatch\] Minimal unoptimized example of PatchMatch, C. Barnes,
[WebSite](http://gfx.cs.princeton.edu/pubs/Barnes_2009_PAR/index.php)

## PatchExchange


## SLIC Superpixels

An implementation of SLIC superpixels method is included in ASTex core under the form of an filter.
A usage example can be found in the _Test_ directory
[web](http://ivrl.epfl.ch/research/superpixels)

## Quilting
Implementation of the _image quilting_ process presented in \[EF01\]

\[EF01\]
Efros, Alexei A. and Freeman, William T.
Image Quilting for Texture Synthesis and Transfer, SIGGRAPH '01
year = {2001},


## Wang Tiles

(Soon Available)
Implementation of the _wang tile_ texture generation method presented in \[CS03\]

\[CS03\]Michael F. Cohen, Jonathan Shade, Stefan Hiller, Oliver Deussen, 
Wang Tiles for image and texture generation
ACM SIGGRAPH 2003






