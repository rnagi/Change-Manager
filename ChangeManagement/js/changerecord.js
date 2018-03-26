$(document).ready(function () {

    //Highlight the active link in navigaion menu
    setTimeout(function ()
    {
        $('#record').addClass('active');
        $('#main').removeClass("active");
        $('#request').removeClass("active");
        $('#admin').removeClass("active");
        $('#mngrequest').removeClass('active');

    }, 100);


    //Clear out input text fields
    $('input[type=text]').each(function () {
        $(this).val('');
    });

    //Populate the category values for change record
    $.ajax({
        url: 'api/data/GetCategoryValues'
    })
    .done(function (data) {
        $select = $('#category');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the impact values for change record
    $.ajax({
        url: 'api/data/GetImpactValues'
    })
    .done(function (data) {
        $select = $('#impact');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


//    //Populate the state values for change record
//    $.ajax({
//        url: 'api/data/GetStateValues'
//    })
//    .done(function (data) {
//        $select = $('#state');
//        var listitems;
//        $.each(data, function (key, value) {
//            listitems += '<option value=' + key + '>' + value + '</option>';
//        });
//        $select.append(listitems);
//    })
//    .fail(function (xhr, textStatus, errorThrown) {
//        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
//    });


    //Populate the priority values for change record
    $.ajax({
        url: 'api/data/GetPriorityValues'
    })
    .done(function (data) {
        $select = $('#priority');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the risk values for change record
    $.ajax({
        url: 'api/data/GetRiskValues'
    })
    .done(function (data) {
        $select = $('#risk');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the approval values for change record
    $.ajax({
        url: 'api/data/GetApprovalValues'
    })
    .done(function (data) {
        $select = $('#status');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the type values for change record
    $.ajax({
        url: 'api/data/GetTypeValues'
    })
    .done(function (data) {
        $select = $('#type');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the requestedby values for change record
    $.ajax({
        url: 'api/data/GetRequestedByValues'
    })
    .done(function (data) {
        $select = $('#requestedby');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the source type values for change record
    $.ajax({
        url: 'api/data/GetSourceTypeValues'
    })
    .done(function (data) {
        $select = $('#source');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });



    //Populate change form for the record selected
    var id = getUrlParameter('id');
    if (!id) { //if new record 
        return false;
    } else {
        $.ajax({
            url: 'api/data/GetChangeRecordDetailsById?id=' + id,
            type: 'get'
        }).done(function (data) {
            // alert('success');
            $('#crdate').val(data.CreateDate);
            $('#crby').val(data.CreatedBy);
            $('#shortdesc').val(data.Change_Short_Desc);           
            $('#component').val(data.Component);

            $('#requestedby option:selected').text(data.RequestedByName);
            $('#requestedby option:selected').val(data.Requested_By_Id);

            $('#category option:selected').text(data.Category);
            $('#category option:selected').val(data.Category_Id);

            $('#status option:selected').text(data.Status);
            $('#status option:selected').val(data.Change_Status_Id);

            $('#risk option:selected').text(data.Risk);
            $('#risk option:selected').val(data.Change_Risk_Id);

            $('#type option:selected').text(data.Type);
            $('#type option:selected').val(data.Change_Type_Id);

            $('#priority option:selected').text(data.Priority);
            $('#priority option:selected').val(data.Change_Priority_Id);

           // $('#state option:selected').text(data.State);
           // $('#state option:selected').val(data.Change_State_Id);

            $('#impact option:selected').text(data.Impact);  
            $('#impact option:selected').val(data.Change_Impact_Id);
                    
//          $('#assignedto option:selected').text(data.AssignedTo);
//          $('#assignedto option:selected').val(data.Assigned_To);
           
            $('#description').text(data.Change_Desc);
            $('#comments').text(data.Comments);
            $('#worknotes').text(data.Work_Notes);
            if (data.PlannedStartDate.toLowerCase() === "1900-01-01T00:00:00".toLowerCase())
                $('#startdatepicker').val("");
            else
                $('#startdatepicker').val(data.PlannedStartDate);

            if (data.WorkStartDate.toLowerCase() === "1900-01-01T00:00:00".toLowerCase())
                $('#workstartdatepicker').val("");
            else
                $('#workstartdatepicker').val(data.WorkStartDate);

            if (data.RequestedBy.toLowerCase() === "1900-01-01T00:00:00".toLowerCase())
                $('#requestbydatepicker').val("");
            else
                $('#requestbydatepicker').val(data.RequestedBy);

            if (data.PlannedEndDate.toLowerCase() === "1900-01-01T00:00:00".toLowerCase())
                $('#enddatepicker').val("");
            else
                $('#enddatepicker').val(data.PlannedEndDate);

            if (data.WorkEndDate.toLowerCase() === "1900-01-01T00:00:00".toLowerCase())
                $('#workenddatepicker').val("");
            else
                $('#workenddatepicker').val(data.WorkEndDate);

            $('#changeplan').text(data.ChangePlan);
            $('#backoutplan').text(data.BackoutPlan);
            $('#testplan').text(data.TestPlan);
            $('#source option:selected').text(data.SourceType);
            $('#sourceid option:selected').val(data.SourceVal);
        }).fail(function () {
            alert('fail');
        });
    }

});  //end $(document).ready

//Used to get current record id from url
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}


//Update or Add a record
$('#btnSave').click(function (e) {

    //Save all change record properties in an object to send to post/put web service
    var properties = new Object();
    properties.CreateDate = $('#crdate').val();
    properties.CreatedBy = $('#crby').val();
    properties.Change_Short_Desc = $('#shortdesc').val();
    properties.Component_Id = $('#component').val();
    properties.Requested_By_Id = $('#requestedby').val(); 
    properties.Category_Id = $('#category').val();
    properties.Change_Status_Id = $('#status').val();
    properties.Change_Risk = $('#risk').val();
    properties.Change_Type_Id = $('#type').val();
    properties.Change_Priority_Id = $('#priority').val();
    //properties.Change_State_Id = $('#state').val();
    properties.Change_Impact_Id = $('#impact').val();
    properties.Assigned_To = $('#assignedto').val();
    properties.Change_Desc = $('#description').text();
    properties.Comments = $('#comments').text();
    properties.Work_Notes = $('#worknotes').text();
    properties.PlannedStartDate = $('#startdatepicker').val();
    properties.WorkStartDate = $('#workstartdatepicker').val();
    properties.RequestedBy = $('#requestbydatepicker').val();
    properties.PlannedEndDate = $('#enddatepicker').val();
    properties.WorkEndDate = $('#workenddatepicker').val();
    properties.ChangePlan = $('#changeplan').text();
    properties.BackoutPlan = $('#backoutplan').text();
    properties.TestPlan = $('#testplan').text();
    properties.SourceType = $('#source').val();
    properties.SourceVal = $('#sourceid').val();
   
    var id = getUrlParameter('id');
    properties.Change_Record_Id = id;

    //If record id is alreay available go to update method else create a new record

    if (id) { //if new record 
        //  alert('update');
        $.ajax({
            url: 'api/data/UpdateChangeRecord',
            method: 'put',
            data: properties
        }).done(function () {
            alert('update successful');
        }).fail(function () {
            alert('failed update');
        });
    } else {
        $.ajax({
            url: 'api/data/PostChangeRecord',
            method: 'post',
            data: properties
        }).done(function () {
            alert('insert successful');
        }).fail(function () {
            alert('failed insert');
        });
    }
});