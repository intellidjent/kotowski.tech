(function ($) {

    'use strict';

    var $arrDown = $(".tile_arr");

    $arrDown.on('click', function(){
        var menuHeight = 0,
            menuMargin = 0,
            $menuParent = $(this).parent(),
            padTop = parseInt($menuParent.css("padding-top")),
            padBot = parseInt($menuParent.css("padding-bottom")),
            padSum = padTop + padBot;

        $menuParent.find("li").each(function() {
            menuHeight = menuHeight + $(this).height();
            menuMargin = menuMargin + parseInt($(this).css('margin-bottom'));
        });

        var animHeight = menuHeight + menuMargin +padSum;

        if ($menuParent.parent().hasClass('tile__active')) {
            $menuParent.animate({
                height: 121
            }, 400, 'swing', function() {
                $menuParent.parent().removeClass('tile__active');
            });
        } else {
            $menuParent.animate({
                height: animHeight
            }, 400, 'swing', function() {});
        }

        $menuParent.parent().addClass('tile__active');
        $(this).find('.tile_arr-img').toggleClass('tile_arr-img__active');

    });

})(jQuery);