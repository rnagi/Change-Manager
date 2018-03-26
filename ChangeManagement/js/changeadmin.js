$(document).ready(function ()
{

    //Highlight the active link in navigaion menu
    setTimeout(function ()
    {
        $('#admin').addClass('active');
        $('#main').removeClass("active");
        $('#record').removeClass("active");
        $('#request').removeClass("active");
        $('#mngrequest').removeClass('active');

    }, 100);



    $('#btnadd').click("click", function (event)
    {
        window.location = "changerecord.html";
    });

    $('#btnrequest').click("click", function (event)
    {
        window.location = "changerequest.html";
    });

    $('#btnmngrequest').click("click", function (event)
    {
        window.location = "managerequest.html";
    });

    $('#btnexit').click("click", function (event)
    {
        window.location = "itops.html";
    });



    //tblchangeadmin is global scope and can be used in all callback functions for the datatable
    tblchangeadmin = $('#tblchangeadmin').DataTable({
        //  scrollX: true,
        processing: true,
        responsive: true,
        //autoWidth: false,
        ajax: "api/data/GetAllChangeRecordDetails",
        columns: [
                    { data: "Change_Num" },
                    { data: "RequestedByName" },
                    { data: "AssignedTo" },
                    { data: "Category" },
                    { data: "State" },
                    { data: "Priority" },
                    { data: "Impact" },
                    { data: "Status" },
                    { data: "Type" },
                    { data: "Component" },
                    { data: "Risk" },
                    { data: "Change_Short_Desc" },
                    { data: "Change_Desc" },
                    { data: "Comments" },
                    { data: "Work_Notes" },
                    { data: "RequestedBy" },
                    { data: "PlannedStartDate" },
                    { data: "PlannedEndDate" },
                    { data: "WorkStartDate" },
                    { data: "WorkEndDate" },
                    { data: "CreatedBy" },
                    { data: "CreateDate" },
                    { data: "SourceType" }
        ],
        columnDefs: [
            {
                //Display empty cell for null date values
                render: function (data, type, row)
                {
                    if (data.toLowerCase() === "1900-01-01T00:00:00".toLowerCase())
                        data = "";
                    return data;
                },
                targets: [15, 16, 17, 18, 19, 21]
            },
            {
                render: function (data, type, row)
                {
                    return '<a  class="record_id" href="#" >' + data + '</a>'
                },
                targets: [0]
            }
        ],
        fnDrawCallback: function ()
        {

            $('.record_id').click(function (e)
            {
                var id = $(e.target).text();
                window.location.href = "changerecord.html?id=" + id;
            });

        }

    }); //end datatables
});        // end docuemnt.ready()


