//= require jquery-3.2.1.min
//= require jquery.sticky

$(document).ready(function(){
    $("#side_menu>ul").sticky({
		topSpacing: 0,
		widthFromWrapper: false
	});

        imgArray = ["url(http://igg.unistra.fr/People/astex/gallery/banner1.png)",
                    "url(http://igg.unistra.fr/People/astex/gallery/banner2.png)",
                    "url(http://igg.unistra.fr/People/astex/gallery/banner3.png)",
                    "url(http://igg.unistra.fr/People/astex/gallery/banner4.png)"];

        randomNumber = Math.floor((Math.random() * imgArray.length));
        imgh = imgArray[randomNumber] + " no-repeat 400px 4px";
	$("#header_wrap").css('background',imgh);

       // $("#main_content_wrap").css('background','url(assets/img/lena_big.jpg)');
	// no-repeat scroll 16px 46px transparent
});
