

# Implemented Algorithms

## Quilting
Implementation of the _image quilting_ process presented in [^ef01]

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/quilting1.png">
	<img alt="quilting" src="http://igg.unistra.fr/People/astex/gallery/mini_quilting1.png" width="200" style="padding:20px"></a>

	<a href="http://igg.unistra.fr/People/astex/gallery/quilting2.png">
	<img alt="quilting" src="http://igg.unistra.fr/People/astex/gallery/mini_quilting2.png" width="200" style="padding:20px"></a>


	<a href="http://igg.unistra.fr/People/astex/gallery/quilting3.png">
	<img alt="quilting" src="http://igg.unistra.fr/People/astex/gallery/mini_quilting3.png" width="200" style="padding:20px"></a>

	<a href="http://igg.unistra.fr/People/astex/gallery/quilting4.png">
	<img alt="quilting" src="http://igg.unistra.fr/People/astex/gallery/mini_quilting4.png" width="200" style="padding:20px"></a>
</p>

<!--
	<em> <strong>Figure 1</strong>: A cellular decomposition of a 2-dimensional object and its incidence graph </em>


[^ef01]: \[EF01\]Efros, Alexei A. and Freeman, William T.<br>
Image Quilting for Texture Synthesis and Transfer,<br> SIGGRAPH '01
-->

## Wang Tiles

Implementation of the _wang tile_ texture generation method presented in [^CS03]

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/wang_tiles2.png">
	<img alt="wang tiles" src="http://igg.unistra.fr/People/astex/gallery/mini_wang_tiles2.png" style="padding:20px" width="200"></a>

	<a href="http://igg.unistra.fr/People/astex/gallery/wang_gen2.png">
	<img alt="wang generation" src="http://igg.unistra.fr/People/astex/gallery/mini_wang_gen2.png" style="padding:20px" width="200"></a>
</p>



## Bi-Layer Textures

  Implementaion of the method presented in [^GS17].
Global implementation can be tested, but also 4 independant important step of the algorithm, as
described below.

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/blue_rust_blt.jpg">
	<img alt="BLT" src="http://igg.unistra.fr/People/astex/gallery/mini_blue_rust_blt.jpg" width="200" style="padding:20px"></a>

	<a href="http://igg.unistra.fr/People/astex/gallery/lichen_blt.jpg">
	<img alt="BLT" src="http://igg.unistra.fr/People/astex/gallery/mini_lichen_blt.jpg" width="200" style="padding:20px"></a>
</p>

Executable for Linux, Mac & Windows are [downloadable](http://igg.unistra.fr/People/guingo/)

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

Extract the noise(PSD) from the different areas determined by the masks using AutoCorrelation constrainted on the content, to only pick up pixel which belong to the mask, discarding the missing informations. Then synthesis a noise layer using [^RPN] for each extracted PSD. 


Parameter:
- nb_cluster = need to be correlated with the masks provided


### Biscale noise patch exchange:

This is a modified version of the mono-scale On-the-Fly Multi-Scale Infinite Texturing from Example [^VSLD13], without complex color transfers and texture fetches. It consists in Wang tiles, in which patch contents are randomly exchanged. Allowing for contents to be rotated (by angle θ ∈ {π/4, π/2, 3π/4, π}) and scaled (0.5 ≤ λ ≤ 1), and applying turbulence. 

<!--
Parameters:
-->

If used in Bi-Layer textures context, structure layer + synchronized maks will be synthesised using this method then Noise layer will be added. 


## Texton Analysis
Analysis part of Texton Noise [^TN]. Generates all possible sizes of texton for a given input.


## Graphcut textures
The GCTexture class implements the patch-based graphcut texture synthesis method described in [^KSE03], using the Maxflow library [^Maxflow]. It provides the three selection methods proposed in the paper (random placement, entire patch matching and sub-patch matching) as well as the possibility to refine synthesis results based on cut errors. The implementation of the FFT-based acceleration of SSD evaluation is not available for now. Graphcut texture synthesis combines optimal patch placement and computation of optimal cuts of arbitrary shape, which yields high-quality results for a large class of textures (stochastic to structured).


## PatchMatch
The PatchMatch code is adapted from the "minimal unoptimized example of PatchMatch" by Barnes et al. [^BSF09] [^PatchMatch]. PatchMatch is an efficient algorithm for matching small patches between an input and an output texture, that alternates coherent and random searches.


## PatchExchange

Implementation of the approach proposed in [^VSLD13] for infinite texturing. The idea is to cut a given periodic tile into a set of patches, for which alternative contents are seeked among all other possible locations over the tile.

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/brick_content_exchange.jpg">
	<img alt="" src="http://igg.unistra.fr/People/astex/gallery/mini_brick_content_exchange.jpg" width="200"></a>
</p>

During synthesis, alternative contents are then randomly picked in order to ensure a high degree of variety, while keeping memory consumption very low with respect to other state-of-the-art tiling methods (eg. Wang tiling).


## SLIC Superpixels

An implementation of SLIC superpixel [^SLIC] method is included in ASTex core under the form of an filter. A usage example can be found in the _Test_ directory

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/SLIC_MEAN.png">
	<img alt="" src="http://igg.unistra.fr/People/astex/gallery/mini_SLIC_MEAN.png" width="200"></a>
</p>


## Saliency Filters

An implementation of saliency map computation based on [^KP12] is included in ASTex core under the form of a filter. A usage example can be found in the _Test_ directory.

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/saliency.png">
	<img alt="" src="http://igg.unistra.fr/People/astex/gallery/mini_saliency.png" width="200"></a>
</p>


## Periodic plus smooth
An implementation of Periodic plus smooth image decomposition [^LM11]

<p align="center">
	<a href="http://igg.unistra.fr/People/astex/gallery/lena_periosmooth.png">
	<img alt="" src="http://igg.unistra.fr/People/astex/gallery/mini_lena_periosmooth.png" width="200" style="padding:20px"></a>
	<a href="http://igg.unistra.fr/People/astex/gallery/leaf_periosmooth.png">
	<img alt="quilting" src="http://igg.unistra.fr/People/astex/gallery/mini_leaf_periosmooth.png" width="200" style="padding:20px"></a>
</p>


## Bibliography

[^ef01]: Efros, Alexei A. and Freeman, William T. Image Quilting for Texture Synthesis and Transfer, SIGGRAPH '01

[^CS03]: Michael F. Cohen, Jonathan Shade, Stefan Hiller, Oliver Deussen, Wang Tiles for image and texture generation,ACM SIGGRAPH 2003

[^KSE03]: Vivek Kwatra, Arno Schödl, Irfan Essa, Greg Turk, and Aaron Bobick. Graphcut textures: image and video synthesis using graph cuts. ACM Trans. Graph. (Proc. SIGGRAPH 2003), 22(3):277-286, 2003. DOI:https://doi.org/10.1145/882262.882264 

[^Maxflow]: Maxflow library, Vladimir Kolmogorov, [WebSite](http://pub.ist.ac.at/~vnk/software.html)

[^BSF09]: C. Barnes, E. Shechtman, A. Finkelstein, and D. B. Goldman. PatchMatch: A Randomized Correspondence Algorithm for Structural Image Editing. ACM Transactions on Graphics (Proc. SIGGRAPH), 28(3), 2009.

[^PatchMatch]: Minimal unoptimized example of PatchMatch, C. Barnes, [url](http://gfx.cs.princeton.edu/pubs/Barnes_2009_PAR/index.php)

[^RPN]: Bruno Galerne, Yann Gousseau, Jean-Michel Morel, Random Phase Textures: Theory and Synthesis, IEEE Transactions on Image Processing ( Volume: 20, Issue: 1, Jan. 2011 ) DOI: 10.1109/TIP.2010.2052822 [url](http://www.math-info.univ-paris5.fr/~bgalerne/galerne_gousseau_morel_random_phase_textures_final_preprint.pdf)


[^LM11]: Lionel Moisan Periodic Plus Smooth Image Decomposition, Journal of Mathematical Imaging and Vision, February 2011, Volume 39, Issue 2, pp 161–179 [url](https://hal.archives-ouvertes.fr/hal-00388020v2)

[^SLIC]:Radhakrishna Achanta, Appu Shaji, Kevin Smith, Aurelien Lucchi, Pascal Fua, and Sabine Süsstrunk, SLIC Superpixels Compared to State-of-the-art Superpixel Methods, IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 34, num. 11, p. 2274 - 2282, May 2012. [url](http://ivrl.epfl.ch/research/superpixels)


[^KP12]: Krahenbuhl, Philipp,Saliency Filters: Contrast Based Filtering for Salient Region Detection, Proceedings of the 2012 IEEE Conference on Computer Vision and Pattern Recognition (CVPR), [url](http://dl.acm.org/citation.cfm?id=2354409.2355041)


[^VSLD13]: K. Vanhoey, B. Sauvage, F. Larue, J-M. Dischler. On-the-Fly Multi-Scale Infinite Texturing from Example, Siggraph Asia,  Hong Kong, ACM Siggraph (Eds.), ACM Siggraph Asia 2013 Papers, Volume 32, n° 6, novembre 2013, doi:10.1145/2508363.2508383, Oral, Long [url](https://icube-publis.unistra.fr/docs/5117/_VSLD13-paper.pdf)


[^GS17]: Guingo, Geoffrey and Sauvage, Basile and Dischler, Jean-Michel and Cani, Marie-Paule, Bi-Layer Textures: A Model for Synthesis and Deformation of Composite Textures, Comput. Graph. Forum, July 2017, [url](https://hal.archives-ouvertes.fr/hal-01528537/)

[^TN]: Galerne, B. and Leclaire, A. and Moisan, L. Texton Noise, Computer Graphics Forum 2017, [url](https://hal.archives-ouvertes.fr/hal-01299336)


