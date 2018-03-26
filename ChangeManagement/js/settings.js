$(document).ready(function (event)
{

    //Highlight the settings link in navigaion menu
    setTimeout(function ()
    {
        $('#set').addClass('active');
        $('#menu').removeClass("active");
        $('#sat').removeClass("active");
        $('#cm').removeClass("active");
        $('#svtl').removeClass("active");
        $('#rpt').removeClass("active");
    }, 300);

});