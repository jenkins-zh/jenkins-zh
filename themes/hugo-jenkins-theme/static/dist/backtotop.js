var pxShow = 600;
var scrollSpeed = 500;
$(window).scroll(function() {
    if ($(window).scrollTop() >= pxShow) {
        $("#backtotop").addClass('visible');
    } else {
        $("#backtotop").removeClass('visible');
    }
});
$('#backtotop a').on('click', function() {
    $('html, body').animate({
        scrollTop: 0
    }, scrollSpeed);
    return false;
});