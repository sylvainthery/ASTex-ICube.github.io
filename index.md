
ASTex is an open-source library for texture analysis and synthesis.
The term “texture” must be understood as in computer graphics.
The purpose of this library is to support collaborative coding and to allow for comparison with recently published algorithms. 

Main features are:
- C++ source code is freely available on github
- It is based on [ITK](https://itk.org/) (Insight Segmentation and Registration Toolkit)
- Linux / Windows / Mac compliant 
- No graphical interface
- CPU implementations for maximum compatibility

# News
10/24 ASTex available on [github](https://github.com/ASTex-ICube/ASTex)
10/27 Continuous integration online develop branch of github repository

# Contributors and contact
The library is developed in the [IGG](http://icube-igg.unistra.fr/en/index.php/Main_Page) team of the [ICube](https://icube.unistra.fr/) laboratory of Strasbourg.

The contributors are:
- [Rémi Allegre](http://igg.unistra.fr/People/allegre/)
- [Jean-Michel Dischler](http://dpt-info.u-strasbg.fr/~dischler/)
- Geoffrey Guingo
- Frédéric Larue
- [Basile Sauvage](http://icube-igg.unistra.fr/en/index.php/Basile_Sauvage)
- [Sylvain Thery](http://icube-igg.unistra.fr/en/index.php/Utilisateur:Thery)

[email contact](mailto:astex@icube.unistra.fr)


# Architecture

ASTex is based on the library [ITK](https://itk.org/).
As ITK can perform its algorithms (filters) on images of different dimension,
its syntax is often complex. Its system of filter pipeline is perfect for an high
level usage, but is boring for quickly prototype application which need development of
its own new filters.

In order to easily and quickly prototype texture generation application, we propose
a syntax overlay for 2D image manipulation.

Lots of usefull types (Index, Offset, Region, ...) are instancied in 2D cand can easily 
generated with simple fonction.

We propose also a new traversal syntax _for\_all\_pixels_ which parameter is a lambda (or functor or function) that can have different kind of signature:
* \[const\] PixelType \[&\]
* \[const\] PixelType \[&\], int x, int y

And also for the parallel version:
* \[const\] PixelType \[&\], int16 thread_index
* \[const\] PixelType \[&\], int x, int y, int16 thread_index

Algorithms writen with new syntax can easily be encapsulated into ITK filter system.
And the two syntaxes can also be mixed to profit of provided ITK algorithms.

## Inheritance

All classes of supported image type follow this kind of inheritance diagram:

![Example of ASTex class hierarchy](/assets/img/class_astex.png "Example of ASTex class hierarchy")

- the ImageBase class is only used for type checking
- the ImageGrayBase class is the real gray image class. I contains a pointer on itk::image, some type definitions and methods which depends on image type.
- the ImageCommon class enhance its param image class with all code that is common to image types.
The second parameter allow the definition of *normal* Image and class ConstImage. It is important
to allow the writing of filters with out wild const_cast.

