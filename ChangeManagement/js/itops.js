$(document).ready(function ()
{
    //Highlight menu link
    setTimeout(function ()
    {
        $('#menu').addClass("active");
        $('#svtl').removeClass("active");
        $('#sat').removeClass("active");
        $('#cm').removeClass("active");
        $('#set').removeClass("active");
        $('#rpt').removeClass("active");
    }, 300);


    //Load initial data from service
    //Get menu items from web.config file on page load
    var url = "api/login";
    $.ajax({
        url: url,
        type: 'get'
    })
    .done(function (data)
    {
        var listitems = new Array();
        var btnItems = new Array();

        $.each(data, function (index, value)
        {
            //Populate main menu navigation labels
            if (index === 0)
            {
                listitems += '<li id="menu"><a href="itops.html">' + value; //+ '&nbsp;&nbsp;<span class="glyphicon glyphicon-home"</li></a>';
            }
            if (index === 1)
            {
                listitems += '<li id="set" ><a href="settings.html">' + value; // +'&nbsp;&nbsp;<span class="glyphicon glyphicon-cog"></span></li></a>';
            }
            if (index === 2)
            {
                listitems += '<li id="cm"><a  href="changemgt.html" >' + value + '</li></a>';
            }
            if (index === 3)
            {
                listitems += '<li id="sat"><a href="systemtools.html">' + value; // +'&nbsp;&nbsp;<span class="glyphicon glyphicon-lock"></span></li></a>';
            }
            if (index === 4)
            {
                listitems += '<li id="svtl"><a href="softwareversion.html">' + value + '</li></a>';
            }
            if (index === 5)
            {
                listitems += '<li id="rpt"><a href="reporting.html">' + value;// +'&nbsp;&nbsp;<span class="glyphicon glyphicon-list-alt"></span></li></a>';
            }

            //Populate main menu button labels
            if (index === 1)
            {
                btnItems += '<button id="btnSettings" class="btn btn-primary btnmenu">' + value + '</button>';
            }
            if (index === 2)
            {
                btnItems += '<button id="btnCM" class="btn btn-primary btnmenu">' + value + '</button>';
            }
            if (index === 3)
            {
                btnItems += '<button id="btnSat" class="btn btn-primary btnmenu">' + value + '</button>';
            }
            if (index === 4)
            {
                btnItems += '<button id="btnSvtl" class="btn btn-primary btnmenu">' + value + '</button>';
            }
            if (index === 5)
            {
                btnItems += '<button id="btnRpt" class="btn btn-primary btnmenu">' + value + '</button>';
            }
        })
        $('#navigation').html(listitems);
        $('#menudiv').html(btnItems);
    })
    .fail(function (xhr, textStatus, errorThrown)
    {
        alert("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Display Settings Module Using Button
    $('#menudiv').on("click", "#btnSettings", function (event)
    {
        window.location = 'settings.html';
    });

    //Display System Availability Tools Module Using Button
    $('#menudiv').on("click", "#btnSat", function (event)
    {
        window.location = 'systemtools.html';
    });

    //Display Change Management Module Using Button
    $('#menudiv').on("click", "#btnCM", function (event)
    {
        window.location = 'changemgt.html';
    });

    //Display Software Version Tracking Tool Module Using Button
    $('#menudiv').on("click", "#btnSvtl", function (event)
    {
        window.location = 'softwareversion.html';
    });

    //Display Reporting Tools Module Using Button
    $('#menudiv').on("click", "#btnRpt", function (event)
    {
        window.location = 'reporting.html';
    });

});

