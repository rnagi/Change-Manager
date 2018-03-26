//var host = window.location.protocol + window.location.host;

$(document).ready(function () {
  
    $('#tblchangelog').dataTable({
        scrollX: true,
        processing: true,   
        "ajax": "testdata.txt",       
        "columns": [
            { "data": "system"},
            { "data": "changesummary"},
            { "data": "aaaincident" },
            { "data": "aaaproblem" },
            { "data": "vendor"},
            { "data": "salary"},
            { "data": "changedate"},
            { "data": "createdby"}
        ]

//        responsive: {
//            breakpoints: [
//                { name: 'desktop', width: Infinity },
//                { name: 'tablet', width: 1024 },
//                { name: 'fablet', width: 768 },
//                { name: 'phone', width: 480 }
//                ]
//        },

    });


});

