$(document).ready(function ()
{

    //Highlight the change mgmt link in navigaion menu
    setTimeout(function ()
    {
        $('#cm').addClass('active');
        $('#menu').removeClass("active");
        $('#sat').removeClass("active");
        $('#set').removeClass("active");
        $('#svtl').removeClass("active");
        $('#rpt').removeClass("active");
    }, 300);



    $("#btnchgadmin").click(function ()
    {
        window.location = 'changeadmin.html';
    });

    $("#btnchglog").click(function ()
    {
        window.location = 'changelog.html';
    });

    $('#btnsettings').click(function ()
    {
        window.location = 'settings.html';
    });
});






