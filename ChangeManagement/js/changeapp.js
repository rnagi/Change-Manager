//Global variables
var dataArray = [];
var id = 0;
var task_id = 0;
var counter = 0;
var workEmail;
var userSecurity = new Array();
var taskAssignToChange = false;
var recAssignToChange = false;
var changeRecordEmail1 = new Object();
var currentUserName
var tblRelatedDocs;
var tblchangehistory;
var tblchangetasks;
var tblFilter;

//Used these variables to move the assessment tasks from change task table to the change record ui and vice versa
var ch_task_id_assess = 0;
var t_ch_task_id_assess = 0;
var ch_task_status;
var ch_task_duedate;
var ch_task_worknotes;
var ch_task_typeId;
var taskAssignToChange_assess = false;
var extChangeTaskId_assess;

//Get server name 
var url = window.location.href
var urlArray = url.split("/");
var servername = urlArray[2];

//var boolPopulateRecord = false;
var boolAssessed = false;
var boolRelated = false;

//variables from the url when clicked from email
var ch_record_id = null;

//var ch_record_id_1 = null;
var change_task_type_id = null;
var external_task_id = null;
var isDirty = false;

// Used to maintaing original state of change record values
var histCR = {};

//Used to maintaing original state of change task values
var histCT = {};

//var result;
var confirmStatus = false;
var confirmStatus2 = false;


//Page load
$(document).ready(function () {
    $(document).ajaxStart(function () {
        //display an overlay on the page 
        var over = '<div id="overlay"></div>';
        $(over).appendTo('body');

        //add a spinner to the overlay
        var opts = {
            lines: 13 // The number of lines to draw
                , length: 28 // The length of each line
                , width: 14 // The line thickness
                , radius: 42 // The radius of the inner circle
                , scale: 1 // Scales overall size of the spinner
                , corners: 1 // Corner roundness (0..1)
                , color: '#fff' // #rgb or #rrggbb or array of colors
                , opacity: 0.5 // Opacity of the lines
                , rotate: 0 // The rotation offset
                , direction: 1 // 1: clockwise, -1: counterclockwise
                , speed: 1 // Rounds per second
                , trail: 60 // Afterglow percentage
                , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                , zIndex: 2e9 // The z-index (defaults to 2000000000)
                , className: 'spinner' // The CSS class to assign to the spinner
                , top: '50%' // Top position relative to parent
                , left: '50%' // Left position relative to parent
                , shadow: false // Whether to render a shadow
                , hwaccel: false // Whether to use hardware acceleration
                , position: 'absolute' // Element positioning
        }
        target = document.getElementById("loading");
        spinner = new Spinner(opts).spin(target);
    });

    $(document).ajaxStop(function () {
        //remove the overlay with spinner from the page
        $('#overlay').remove();
        spinner.stop();
    });

    //Check if fields are dirty
    $(':input').change(function () {
        isDirty = true;
    });

    //Make modals draggable
    $("#commentModal").draggable({
        handle: ".modal-header"
    });
    $("#notesModal").draggable({
        handle: ".modal-header"
    });
    $("#divLinkModal").draggable({
        handle: ".modal-header"
    });

    $("#myModal").draggable({
        handle: ".modal-header"
    });
    $("#divConfirmModal").draggable({
        handle: ".modal-header"
    });

    $("#divConfirmModal2").draggable({
        handle: ".modal-header"
    });

    //Get currentusername used for assessment notes screen
    $(function () {
        $.ajax({
            url: 'api/data/GetCurrentUsername',
            method: 'get'
        }).done(function (data) {
            currentUserName = data;
        }).fail(function () {
            // alert('fail');
        });
    });

    //Populate form elements with default values
    populateProperties();
    populateProjectValues();
    populateStrategicValues();

    //Get current user's permissions for the change mgmt app
    GetUserPermissions(1, "Change Management");

    //Display change records, requests, tasks, and all my records, tasks on page load
    showChangeRecords();
    showChangeRequests();
    showOpenAssessments();
    showRejectedReasons();
    getAllChangeTasks();

    showMyChangeRecords();
    showMyChangeRequests();

    getMyChangeTasks();

    //Display correct doc type on page load
    var typeVal = $('#addLinkType').val();
    if (typeVal === "Link") {
        $('#divAddLink').show();
        $('#divFileUpload').hide();
    }
    if (typeVal === "File") {
        $('#divFileUpload').show();
        $('#divAddLink').hide();
    }

    //Prevent Enter key from reloading page
    $('input[type=text]').unbind('keydown').bind('keydown', function (event) {
        if (event.keyCode == 13)
            event.preventDefault();
    });

    // Prevent the Backspace from navigating back.
    $(document).unbind('keydown').bind('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode == 8) {
            var d = event.srcElement || event.target;
            if ((d.tagName.toUpperCase() === 'INPUT' &&
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' ||
                 d.type.toUpperCase() === 'FILE' ||
                 d.type.toUpperCase() === 'EMAIL' ||
                 d.type.toUpperCase() === 'SEARCH' ||
                 d.type.toUpperCase() === 'DATE')
             )
             ||
             d.tagName.toUpperCase() === 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else {
                doPrevent = true;
            }
        }

        if (doPrevent) {
            event.preventDefault();
        }
    });

    //set filter dates to empty 
    $('#aSearch').click(function () {
        $('#dueDate').val('');
        $('#createDate').val('');
    });

    $('#btnResetFilter').click(function () {
        $('#filterbyId').val('');
        $('#f_status').val(0);
        $('#f_type').val(0);
        $('#f_requestedby').val(0);
        $('#begCD').val('');
        $('#endCD').val('');
        $('#begDD').val('');
        $('#endDD').val('');
        $('#f_assignToId').val(0);
        $('#f_busline').val(0);
        $('#f_bus_priorityId').val(0);

        //Return unfiltered results
        filterResults();
    });

    $('#addSI').click(function () {
        clearSI();
        $('#divSI_CR').hide();
    });

    $('#addProject').click(function () {
        clearProjectInputs();
        $('#divCRProjects').hide();
    });

    //Populate Strategic Initiative with selected Strategic Id
    $('#btnSI').click(function () {
        clearSI();
        getAllSI();
        $('#btnSI').hide();
        $('#pSave').hide();
        $('#saveSI').show();
        $('#addSI').show();
        $('#addProject').hide();
        $('#btnProjects').hide();
        $('#adminHome').html("Strategic Initiatives");
    });

    //Populate Project with selected Project Id
    $('#btnProjects').click(function () {
        clearProjectInputs();
        getAllProjects();
        $('#btnProjects').hide();
        $('#btnSI').hide();
        $('#saveSI').hide();
        $('#addSI').hide();
        $('#divCRProjects').hide();
        $('#divSI_CR').hide();
        $('#pSave').show();
        $('#addProject').show();
        $('#adminHome').html("Projects");
    });

    // Add/Update a project
    $('#pSave').click(function () {
        if (validateProject()) {
            var p = new Object();

            //determine if this is an add or update       
            if ($('#p_Id').val() === "")
                p.Project_Id = 0;
            else
                p.Project_Id = $('#p_Id').val();
            p.Project_CreatedBy = $('#pCreatedBy').val();
            p.Project_Title = $('#p_Title').val();
            p.Project_FiscalYear = $('#p_FY').val();
            p.Project_Owner = $('#p_Owner').val();
            p.Project_Descr = $('#txtpDescr').text();
            p.Project_Completed = $('#pckComplete').prop('checked');
            p.Project_Start_Date = $('#pStartDate').val();
            p.Project_End_Date = $('#pEndDate').val();
            p.Project_Status_Id = $('#selPS').val();
            p.Project_Bus_Line_Id = $('#selBL').val();

            if (p.Project_Id == 0) {
                $.ajax({
                    url: 'api/data/PostProject',
                    method: 'post',
                    data: p
                }).done(function (data) {
                    // project_id = data;
                    clearProjectInputs();
                    getAllProjects();
                    $('#success').html("Record was added successfully!").fadeIn(1000);
                    setTimeout(function () {
                        $("#success").fadeOut();
                    }, 3000
                    );

                    $('#divCRProjects').hide();

                }).fail(function () {
                    $('#error').html("! Failed to add record.").fadeIn(1000);
                    setTimeout(function () {
                        $("#error").fadeOut();
                    }, 5000
                    );
                });
            } else {
                $.ajax({
                    url: 'api/data/Put_Project',
                    method: 'put',
                    data: p
                }).done(function (data) {
                    clearProjectInputs();
                    getAllProjects();
                    $('#success').html("Record was updated successfully!").fadeIn(1000);
                    setTimeout(function () {
                        $("#success").fadeOut();
                    }, 3000
                    );

                    $('#divCRProjects').hide();

                }).fail(function () {
                    $('#error').html("! Failed to update record.").fadeIn(1000);
                    setTimeout(function () {
                        $("#error").fadeOut();
                    }, 5000
                    );
                });
            }
        }
    });

    //Add/Update a strategic initiative
    $('#saveSI').click(function () {
        if (validateSI()) {
            var si = new Object();
            //determine if this is an add or update       
            if ($('#siId').val() === "")
                si.Strategic_Id = 0;
            else
                si.Strategic_Id = $('#siId').val();
            si.Strategic_CreatedBy = $('#siCreatedBy').val();
            si.Strategic_Title = $('#siTitle').val();
            si.Strategic_FiscalYear = $('#siFY').val();
            si.Strategic_Owner = $('#siOwner').val();
            si.Strategic_Descr = $('#siDescr').text();
            si.Strategic_Active = $('#siActive').prop('checked');

            if (si.Strategic_Id == 0) {
                $.ajax({
                    url: 'api/data/PostStrategicInitiative',
                    method: 'post',
                    data: si
                }).done(function (data) {
                    //  strategic_id = data;
                    clearSI();
                    getAllSI();
                    $('#success').html("Record was added successfully!").fadeIn(1000);
                    setTimeout(function () {
                        $("#success").fadeOut();
                    }, 3000
                    );
                    $('#divSI_CR').hide();
                }).fail(function () {
                    $('#error').html("! Failed to add record.").fadeIn(1000);
                    setTimeout(function () {
                        $("#error").fadeOut();
                    }, 5000
                    );
                });
            } else {
                $.ajax({
                    url: 'api/data/PutStrategicInitiative',
                    method: 'put',
                    data: si
                }).done(function (data) {
                    clearSI();
                    getAllSI();
                    $('#success').html("Record was updated successfully!").fadeIn(1000);
                    setTimeout(function () {
                        $("#success").fadeOut();
                    }, 3000
                    );

                    $('#divSI_CR').hide();
                }).fail(function () {
                    $('#error').html("! Failed to update record.").fadeIn(1000);
                    setTimeout(function () {
                        $("#error").fadeOut();
                    }, 5000
                    );
                });
            }
        }
    });

    //Go back to previous page
    $('#btnBackPrjct').click(function () {
        $('#divProjectTbl').show();
        $('#divCRProjects').hide();
        $('#btnBackPrjct').hide();
    });
    $('#btnBackSI').click(function () {
        $('#divSI').show();
        $('#divSI_CR').hide();
        $('#btnBackSI').hide();
    });
    //Exit to home from admin page
    $('#btnExitAdmin').click(function () {
        $('#main').hide();
        $('#navbuttons').hide();
        $('#requestdetails').hide();
        $('#divAdmin').hide();
        $('#divCRProjects').hide();
        $('#divSI_CR').hide();
        $('#divLanding').show();
    });

    //Display Admin section
    $('#btnAdmin').click(function () {
        $('#divAdmin').show();
        $('#divLanding').hide();
        $('#divStrategic').hide();
        $('#createdbyST').prop('disabled', true);
        $('#divSI').hide();
        $('#pSave').hide();
        $('#saveSI').hide();
        $('#divProjects').hide();
        $('#p_CreatedBy').prop('disabled', true);
        $('#divProjectTbl').hide();
        $('#addSI').hide();
        $('#addProject').hide();
        $('#btnSI').show();
        $('#btnProjects').show();
        $('#adminHome').html("Administration");
        $('#divCRProjects').hide();
        $('#divSI_CR').hide();
        $('#btnBackSI').hide();
        $('#btnBackPrjct').hide();
    });

    //Disable completed date on change task form
    $('#completeddate').prop('disabled', true);

    //Disable declined date on change task form
    $('#declinedDate').prop('disabled', true);

    //Set completed date to current date upon closing the task
    $('#taskStatus').change(function () {
        var status = $('#taskStatus').val();
        if (status == 2) {
            formatDate(new Date(), $('#completeddate'));
            $('#assessbyDate').val($("#completeddate").val());
        }
        else {
            $('#completeddate').val("");
        }

        if (status == 3) {
            formatDate(new Date(), $('#declinedDate'));
        }
        else {
            $('#declinedDate').val("");
        }
    });

    $('#taskassignedto').change(function () {
        //used as a flag to send an email to the person assigned to this task
        taskAssignToChange = true;
    });

    $('#assessby').change(function () {
        //used as a flag to send an email to the person assigned to this assessment task
        taskAssignToChange_assess = true;
    });

    $('#assignedto').change(function () {
        //used as a flag to send an email to the change manager assigned to this request
        recAssignToChange = true;
    });

    $('#rptSummary').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fRequested+Changes+Summary', '_blank');
    });

    $('#rptSummCM').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fRequested+Changes+Summary+by+Change+Manager', '_blank');
    });

    $('#rptFilter').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fChange+Management+Master', '_blank');
    });

    $('#rptDetail').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=/Service+Manager/Requested+Changes+Detail', '_blank');
    });

    $('#rptAgent').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fOverdue+Tasks+By+Agent', '_blank');
    });

    $('#rptAgent1').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fTasks+By+Agent', '_blank');
    });

    $('#rptVQGL').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fVendor+Quotes+by+GL+Account+by+Status', '_blank');
    });

    $('#rptVQA').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fVendor+Quotes+Analysis', '_blank');
    });

    $('#rptTBA').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fCompleted+Tasks+by+Agent', '_blank');
    });

    $('#rptDA').click(function () {
        window.open('http://svrdwdb/Reports/Pages/Report.aspx?ItemPath=%2fService+Manager%2fDevelopment+Analysis', '_blank');
    });

    $('#rptAxisBundle').click(function () {
        $('#divReports').hide();
        $('#divLanding').hide();
        $('#divRptAxis').show();
        //  $('#divFilters').show();
        getAxisReport();
    });

    $('#logo').click(function () {
        window.location.href = "changeapp.html";
    });

    //Display reports page
    $('#btnReports').click(function () {
        $('#divReports').show();
        $('#divLanding').hide();
    });

    //Initialize jquery tooltip
    $('[data-toggle="tooltip"]').tooltip({
    });

    //Show all change requests
    $('#btnAllRequests').click(function () {
        $('#main').show();
        $('#divLanding').hide();

        $('#btnFilter').hide();
        $('#btnResetFilter').hide();

    });

    /**************************Add/Update Change Tasks*****************************************/
    $('#modal-ok').click(function (event) {
        event.preventDefault();

        /**********************Validation******************************************/
        //This is a required field on change task form
        if ($('#tasktype').val() == 0) {
            $('#task_error').html('<strong>! Type</strong> is a required field to create a Change Task.').show();
            setTimeout(function () {
                $("#task_error").fadeOut();
            }, 3000);
            return false;
        }

        //This is a required field on change task form
        if ($('#longdesc').val() === "") {
            $('#errorlongdesc').show();
            setTimeout(function () {
                $("#errorlongdesc").fadeOut();
            }, 3000);
            return false;
        }

        //Validate input on change task form
        var qAmount = $('#qAmount').val();
        //        var qInvoice = $('#qInvoice').val();
        var qValid = true;
        var msg = "! The following fields need to be numeric: <br >";
        if (isNaN(qAmount)) {
            qValid = false;
            msg += "<strong>Amount</strong> <br >";
        }

        if (qValid === false) {
            $('#task_error').html(msg).show();
            setTimeout(function () {
                $("#task_error").fadeOut();
            }, 3000);
            return false;
        }
        /******************************End validation*****************************/

        //Save all change task properties in an object to send to post/put web service 
        var properties = new Object();
        if (task_id == 0)
            properties.Change_Task_Id = 0;
        else
            properties.Change_Task_Id = task_id; //current task
        properties.Change_Record_Id = id; //current record  
        properties.LongDesc = $('#longdesc').val();
        properties.Assigned_To = $('#taskassignedto').val();
        properties.Task_State_Id = $('#taskstate').val();
        properties.CompleteDate = $('#completeddate').val();
        properties.Task_Start_Date = $('#task_startdate').val();
        properties.DueDate = $('#duedate').val();
        properties.Type_Id = $('#tasktype').val();
        properties.Task_Status_Id = $('#taskStatus').val();
        // properties.WorkNotes = $('#tasknotes').val();
        properties.Dev_Description = $('#devDescription').val();
        properties.Dev_Type_Id = $('#devType').val();
        properties.Dev_Category_Id = $('#devCategory').val();
        properties.Dev_Stage_Id = $('#devStage').val();
        properties.Activity_Descr = $('#activityDescr').val();
        properties.Quote_Id = $('#qId').val();
        //Convert to decimal
        var qAmount1 = $('#qAmount').val();
        var qAmount1_d = parseFloat(qAmount1);
        properties.Amount = qAmount1_d;
        properties.Invoice_No = $('#qInvoice').val();
        properties.GL_Account = $('#glAccount').val();
        properties.Quote_Requested = $('#qRequested').val();
        properties.Quote_Received = $('#qReceived').val();
        properties.Quote_Approved = $('#qApproved').val();
        properties.Software_Delivered = $('#sDelivered').val();
        properties.Software_Implemented = $('#sImplemented').val();
        properties.FullReleaseRequired = $('#ckVendorRelease').prop('checked');
        properties.Declined_Date = $('#declinedDate').val();
        properties.AnnMaintFee = $('#qAnnMaintFee').val();
        properties.AnnFeeDueDate = $('#qAnnFeeDueDate').val();
        properties.AXIS_Type_Id = $('#ax_types').val();
        properties.AXIS_Status_Id = $('#ax_status').val();
        properties.Campana_Descr = $('#txtCampanaDescr').text();
        properties.User_Descr = $('#txtUserDescr').text();
        properties.Axis_Owner_Id = $('#owner').val();
        properties.Loaded_To_Test = $('#ltt_date').val();
        properties.Loaded_To_Train = $('#lttr_date').val();
        properties.Loaded_To_TrainBy = $('#trainby').val();
        properties.Emergency_Load = $('#ckELR').prop('checked');
        properties.Emergency_Load_Reason = $('#txtEMRReason').val();

        properties.Loaded_To_Prod = $('#ltp_date').val();
        properties.Loaded_To_ProdBy = $('#selprodby').val();
        properties.Obsolete = $('#ckObsolete').prop('checked');
        properties.Obsolete_Reason = $('#txtObsReason').val();
        properties.TicketNum = $('#ticketNum').val();

        //Update change task
        if (properties.Change_Task_Id !== 0) {
            $.ajax({
                url: 'api/data/UpdateChangeTask',
                method: 'put',
                data: properties
            }).done(function (data) {
                $('#errorlongdesc').hide();
                //Send an email to the Assignee for each change task assigned to them on update
                var employeeId = $('#taskassignedto').val();
                if (taskAssignToChange) {
                    taskAssignToChange = false;
                    var chgrecid = id;
                    var changeRecordEmail = new Object();
                    changeRecordEmail.employeeId = employeeId;
                    changeRecordEmail.changeRecordId = chgrecid;
                    changeRecordEmail.serverName = servername;
                    changeRecordEmail.changeExternalTaskId = $('#extChangeTaskId').val();
                    changeRecordEmail.changeTaskId = task_id;
                    changeRecordEmail.changeTask_Type_Id = $('#tasktype').val();
                    $.ajax({
                        url: "api/data/AssignTask",
                        method: "get",
                        data: changeRecordEmail
                    }).done(function (data) {
                        //  $('#success').html("<strong>Change Task " + data.changeTaskId + "</strong> was sent to Assignee at <strong>" + data.email + "</strong> successfully!").show()
                        //  setTimeout(function(){
                        //  $('#success').fadeOut();
                        //  }, 3000);                                             
                    }).fail(function (data) {
                        //  $('#error').html("<strong>! Failed to assign Change Task. Please select a valid Assignee.</strong>").show()
                        //  setTimeout(function(){
                        //  $('#error').fadeOut();
                        //  }, 3000);
                    });
                }
                $('#taskinsertfail').hide();
                $('#taskupdatefail').hide();
                $('#taskinsertsuccess').hide();
                $('#taskupdatesuccess').fadeIn(1000);
                setTimeout(function () {
                    $("#taskupdatesuccess").fadeOut();
                }, 5000);

                //Refresh task tables to display new results
                getChangeTasks();
                getAllChangeTasks();
                getMyChangeTasks();
                getAxisReport();

            }).fail(function (e) {
                $('#taskupdatefail').fadeIn(1000);
                $('#taskinsertsuccess').hide();
                $('#taskupdatesuccess').hide();
                $('#taskinsertfail').hide();
                setTimeout(function () {
                    $("#taskupdatefail").fadeOut();
                }, 5000);
            });
        }
        else {
            //Add a new change task
            $.ajax({
                url: 'api/data/PostChangeTask',
                method: 'post',
                data: properties
            }).done(function (data) {
                $('#errorlongdesc').hide();
                var new_change_task_id = data;
                //Send an email if a change task is assigned to an employee on the creation of a new change task 
                var employeeId = $('#taskassignedto').val();
                if (taskAssignToChange) {
                    taskAssignToChange = false;
                    var chgrecid = id;
                    var changeRecordEmail = new Object();
                    changeRecordEmail.employeeId = employeeId;
                    changeRecordEmail.changeRecordId = chgrecid;
                    // Assign new change task id
                    changeRecordEmail.changeTaskId = new_change_task_id;
                    changeRecordEmail.serverName = servername;
                    changeRecordEmail.changeTask_Type_Id = $('#tasktype').val();
                    //Get external task id to display in email when creating a new task
                    $.ajax({
                        url: "api/data/GetExternalTaskId",
                        method: "get",
                        data: changeRecordEmail
                    }).done(function (data) {
                        //Assign new external task id
                        changeRecordEmail.changeExternalTaskId = data;
                        $.ajax({
                            url: "api/data/AssignTask",
                            method: "get",
                            data: changeRecordEmail
                        })
                        .done(function (data) {
                            //  $('#success').html("Change Task " + data.changeTaskId + " was sent to Assignee at <strong>" + data.email + "</strong> successfully!").show()
                            //   setTimeout(function(){
                            //       $('#success').fadeOut();
                            //   }, 3000);                                     
                        })
                        .fail(function (data) {
                            //   $('#error').html("<strong>! Failed to assign Change Task.</strong>").show()
                            //    setTimeout(function(){
                            //      $('#error').fadeOut();
                            //    }, 3000);
                        });
                    }).fail(function (data) {
                        $('#error').html("<strong>! Failed get External Task Id.</strong>").show()
                        setTimeout(function () {
                            $('#error').fadeOut();
                        }, 3000);
                    });
                }

                //Refresh task tables to display new results
                getChangeTasks();
                getAllChangeTasks();
                getMyChangeTasks();
               // getAxisReport();

                $('#taskinsertfail').hide();
                $('#taskupdatefail').hide();
                $('#taskupdatesuccess').hide();
                $('#taskinsertsuccess').fadeIn(1000);
                setTimeout(function () {
                    $("#taskinsertsuccess").fadeOut();
                }, 3000);
            }).fail(function () {
                $('#taskinsertsuccess').hide();
                $('#taskupdatesuccess').hide();
                $('#taskupdatefail').hide();
                $('#taskinsertfail').fadeIn(1000);
                setTimeout(function () {
                    $("#taskinsertfail").fadeOut();
                }, 5000);
            });

        } //end else
    }); //end modal-ok
    /*************************End Save/Update Change Tasks***************************************/

    //Only display the related docs and tasks tab if there is already a change record created
    $('#rdTab').click(function (event) {
        var changeRecId = id;
        if (isNaN(changeRecId) || changeRecId == 0) {
            $('#rdTab').attr('class', 'disabled');
            if ($(this).hasClass('disabled')) {
                $('#error').html("<strong> ! You need to save the Change Request to perform this action. </strong>").fadeIn(1000);
                setTimeout(function () {
                    $('#error').fadeOut();
                }, 5000);

                return false;
            }
        } else {
            //Display the "Add Change Task" button only on the "Related Documents and Tasks" tab
            $('#spanTask').show();
        }
    });

    //Show the Add Change Task button only on the Related Documents and Tasks tab
    $(function () {
        $('#requestTab').click(function () {
            $('#spanTask').hide();
        });
        $('#assessTab').click(function () {
            $('#spanTask').hide();
        });
        $('#historyTab').click(function () {
            $('#spanTask').hide();
        });
        $('#implementTab').click(function () {
            $('#spanTask').hide();
        });
        $('#commentsTab').click(function () {
            $('#spanTask').hide();
        });
    });

    //Hide the filter buttons on all tabs except the filter tab and remove the "create new" button from filter tab
    $(function () {
        $('#aMyAssign').click(function () {
            $('#btnFilter').hide();
            $('#btnResetFilter').hide();
            $('#btnrequest').show();
        });
        $('#aChangeRequest').click(function () {
            $('#btnFilter').hide();
            $('#btnResetFilter').hide();
            $('#btnrequest').show();
        });
        $('#aChangeRecord').click(function () {
            $('#btnFilter').hide();
            $('#btnResetFilter').hide();
            $('#btnrequest').show();
        });
        $('#aChangeTask').click(function () {
            $('#btnFilter').hide();
            $('#btnResetFilter').hide();
            $('#btnrequest').hide();
        });
        $('#aFilter').click(function () {
            $('#btnFilter').show();
            $('#btnResetFilter').show();
            $('#btnrequest').hide();
        });

    });

    //Add new request
    $('#btnrequest').click("click", function (event) {
        event.preventDefault();

        //Reset change task variables for a new change record 
        ch_task_status = 1;
        ch_task_duedate = '';
        ch_task_worknotes = '';

        //Reset risk to default - Low
        calcRisk($('#risk').val(0), $('#busimpact').val(0));

        //Reset change task fields when creating a new change record
        $('#taskStatus1').val(1);
        $('#duedate1').val('');
        $('#tasknotes1').val('');

        //Set Type default to 'Normal' when creating a new request
        $('#type').val(1);

        //Set title to Change Request on creation of new request
        $('#ReqRecNav').html("Change Request");

        //Clear out textarea fields
        $('textarea').each(function () {
            $(this).val('');
        });

        //Clear out text fields on page load and disable createdate and createby
        $('input[type=text]').each(function () {
            $(this).val('');
            if (this.id !== 'crdate' && this.id !== 'crby' && this.id != 'extChangeTaskId' && this.id != 'requestnum' && this.id != 'completedate')
                $(this).prop('disabled', false);
        });

        //Clear out select dropdowns 
        $("select").each(function () {
            $(this).empty();
        });

        //Set Type default to 'Normal' when creating a new request
        $('#type option:selected').text('Normal');

        if (!tblRelatedDocs) {
        } else {
            if (tblRelatedDocs.data().length !== 0)
            //Clear out related docs table
                $('#tblRelatedDocs').DataTable().clear().draw();
        }

        if (!tblchangetasks) {
        } else {
            if (tblchangetasks.data().length !== 0)
            //Clear out related tasks table
                $('#tblChangeTasks').DataTable().clear().draw();
        }

        if (!tblchangehistory) {
        } else {
            if (tblchangehistory.data().length !== 0)
            //Clear out history for current change record
                $('#tblchangehistory').DataTable().clear().draw();
        }

        //Repoplulate Type dropdown for Related Documents and Tasks tab since they are hardcoded
        //and not repopulated from the database 
        $("#addLinkType").append($("<option></option>").val("Link").html("Link"));
        $("#addLinkType").append($("<option></option>").val("File").html("File"));

        //Reset current record id to default
        id = 0;

        //Reset current task_id for assessment tasks
        task_id = 0;

        $('#main').hide();
        $('#requestdetails').show();
        $('#navbuttons').show();
        //    $( '#div_static' ).show();

        //Set the default tab to the request tab
        $('#tabs a[href="#request"]').tab('show');

        //Hide add change task button when creating a new record
        $('#spanTask').hide();

        populateProperties();

        //hide link button 
        $('#btnLink').hide();
    });

    //Go Back to change manager home page on exit from change record
    $('#btnexitchange').click("click", function (event) {
        var cnfrm;
        if (isDirty === true) {
            cnfrm = confirm('You have unsaved changes.  Are you sure you want to exit without saving changes?');
        } else {
            backToChangeManagerMain();
            $('#divReject').hide();

            //clear out implementation time fields
            $('#starttimepicker').val('');
            $('#endtimepicker').val('');
            $('#actualStartTimepicker').val('');
            $('#actualEndTimepicker').val('');
        }

        if (cnfrm) {
            backToChangeManagerMain();
            $('#divReject').hide();

            //clear out implementation time fields
            $('#starttimepicker').val('');
            $('#endtimepicker').val('');
            $('#actualStartTimepicker').val('');
            $('#actualEndTimepicker').val('');

            //reset variable to false.
            isDirty = false;
        }
        else {
            //do nothing
        }
    });

    //Exit Change Mangager
    $('#btnexit').click(function () {
        window.location.href = "changeapp.html";
    });

    $('#btnexit2').click(function () {
        window.location.href = "changeapp.html";
    });

    //Go back to home page from axis report page
    $('#rptExit').click("click", function (event) {
        $('#divReports').hide();
        $('#divRptAxis').hide();
        //   $('#divFilters').hide();
        $('#divLanding').show();
    });

    //Go back to home page from reports page
    $('#rptsExit').click("click", function (event) {
        $('#divReports').hide();
        $('#divRptAxis').hide();
        //   $('#divFilters').hide();
        $('#divLanding').show();
    });

    $('#devExit').click(function () {
        window.location.href = "changeapp.html";
    });

    // Add Assessment Tab Comments
    $('#btnAddAssessCmnt').click(function () {
        if (id == 0) {
            $('#errorAssess').html("<strong> ! You need to save the Change Request to perform this action. </strong>").fadeIn(1000);
            setTimeout(function () {
                $('#errorAssess').fadeOut();
            }, 5000);
            return false;
        }
        else {
            // clear out assessment comments
            $('#txtAssessCmnts').val("");
            $('#txtAssessCmnts').show();
            $('#txtNotes').hide();
            $('#txtImpCmnts').hide();
            $('#txtTaskCmnts').hide();
            $('#notesModal').modal({
                backdrop: "static"
            });

            //determine which type of comment to save
            commentType = 4;
        }
    });

    //Details Tab Comments
    $('#btnAddDetailCmnts').click(function () {
        // clear out detail comments

        $('#txtNotes').val("");
        $('#txtNotes').show();
        $('#txtAssessCmnts').hide();
        $('#txtImpCmnts').hide();
        $('#txtTaskCmnts').hide();
        $('#notesModal').modal({
            backdrop: "static"
        });

        //determine which type of comment to save
        commentType = 6;
    });

    //Implementation Tab Comments
    $('#btnAddImplementCmnt').click(function () {
        if (id == 0) {
            $('#errorImplement').html("<strong> ! You need to save the Change Request to perform this action. </strong>").fadeIn(1000);
            setTimeout(function () {
                $('#errorImplement').fadeOut();
            }, 5000);
            return false;
        }
        else {
            // clear out implementation comments
            $('#txtImpCmnts').val("");
            $('#txtImpCmnts').show();
            $('#txtNotes').hide();
            $('#txtAssessCmnts').hide();
            $('#txtTaskCmnts').hide();
            $('#notesModal').modal({
                backdrop: "static"
            });

            //determine which type of comment to save
            commentType = 7;
        }
    });

    //Task Comments
    $('#btnAddTaskComment').click(function () {
        if (task_id == 0) {
            ShowMessage("task_error", "! The task has to be saved before adding a comment.");
            return false;
        } else {

            $('#txtTaskCmnts').val("");
            $('#txtTaskCmnts').show();
            $('#txtAssessCmnts').hide();
            $('#txtImpCmnts').hide();
            $('#txtNotes').hide();
            $('#notesModal').modal({
                backdrop: "static"
            });

            //determine which type of comment to save
            commentType = $('#tasktype').val();
        }
    });

    //Save change record comments  
    $('#btnSaveNotes').click(function () {
        var assessComments = $('#txtAssessCmnts').text();
        var detailComments = $('#txtNotes').text();
        var implComments = $('#txtImpCmnts').text();
        var taskComments = $('#txtTaskCmnts').text();

        var change_comments = {};
        var comments;
        switch (parseInt(commentType)) {
            case 1:
            case 2:
            case 3:
            case 5:
                comments = taskComments;
                break;
            case 4:
                comments = assessComments;
                break;
            case 6:
                comments = detailComments;
                break;
            case 7:
                comments = implComments;
                break;
            default:
                comments = '';
        }

        //Set assessment, detail, and implementation change_task_id = 0 since 
        // these comments are related to the record
        if (commentType == 4)
            task_id = 0;
        if (commentType == 6)
            task_id = 0;
        if (commentType == 7)
            task_id = 0;

        change_comments.Type_Id = commentType;
        change_comments.CreatedBy = currentUserName;
        change_comments.CreatedDate = formatDate2(new Date());
        change_comments.Change_Record_Id = id;
        change_comments.Change_Task_Id = task_id;
        change_comments.Comments = comments;

        $.ajax({
            url: 'api/data/PostTaskComment',
            data: change_comments,
            method: 'post'
        }).done(function (data) {
            $('#success').html("<strong>Comment was successfully added!</strong>").fadeIn(1000);
            setTimeout(function () {
                $('#success').fadeOut();
            }, 3000);

            //Refresh comment tables
            getAssessComments();
            getDetailComments();
            getImplComments();
            getAllComments();

            //Refresh task comments tables
            getTaskComments(id, task_id);

            //clear out text area fields in comments modal
            $('#notesModal').on('hidden.bs.modal', function () {
                $('#txtNotes').text('');
                $('#txtAssessCmnts').text('');
                $('#txtImpCmnts').text('');
            });

            //close modal
            $('#notesModal').modal('hide');

            $('#task_success').html("<strong>Comment was added successfully!</strong>").fadeIn(1000);
            setTimeout(function () {
                $('#task_success').fadeOut();
            }, 3000);
        }).fail(function (errorThrown, xhr, statusText) {
            $('#task_error').html("<strong>! Failed to add comment</strong>").fadeIn(1000);
            setTimeout(function () {
                $('#task_error').fadeOut();
            }, 5000);
        });
    });

    //Add new task from the Related Documents and Tasks tab
    $('#btnAddTask').click(function (event) {
        event.preventDefault();

        //Clear out current task id
        task_id = 0;

        //Clear out current header
        $('#myModalLabel').text("Add Change Task");

        //Reset fields to defaults
        $('#tasktype').val(0);
        $('#longdesc').val('');

        $('#taskassignedto').val(0);
        //set to open upon creation of a new task
        $('#taskStatus').val(1);

        $('#tasknotes').val('');
        $('#myModal .modal-dialog').addClass("modalSize");
        $('#myModal').modal({
            backdrop: "static"
        });
       
        $('#divDevFields').hide();
        $('#divQuoteFields').hide();
        $('#divAxisBundle').hide();
        $('#divActivity').hide();

        $('#devDescription').val('');
        $('#activityDescr').val('');

        //Clear task comment table when creating a new task
        var rowCount = $('#tblTaskComments tr').length;
        if (rowCount > 0)
            tblTaskComments.clear().draw();
    });

    //Display development fields for task modal
    $('#tasktype').change(function () {
        if ($('#tasktype').val() == 1) {
            $('#myModal .modal-dialog').addClass("modalSize");
            $('#divDevFields').show();
        }
        else {
            //  $('#myModal .modal-dialog').removeClass("modalSize");
            $('#divDevFields').hide();
        }
    });

     //Display activity fields for task modal
    $('#tasktype').change(function () {
        if ($('#tasktype').val() == 3) {
            $('#myModal .modal-dialog').addClass("modalSize");
            $('#divActivity').show();
        }
        else {
            $('#divActivity').hide();
        }
    });

    //Display vendor quote fields for task modal
    $('#tasktype').change(function () {
        if ($('#tasktype').val() == 2) {
            $('#myModal .modal-dialog').addClass("modalSize");
            $('#divQuoteFields').show();
        }
        else {
            //  $('#myModal .modal-dialog').removeClass("modalSize");
            $('#divQuoteFields').hide();
        }
    });

    //Display axis bundle fields for task modal
    $('#tasktype').change(function () {
        if ($('#tasktype').val() == 5) {
            $('#myModal .modal-dialog').addClass("modalSize");
            $('#divAxisBundle').show();
            $('#lblTitle').text("*Bundle Number");
        }
        else {
            //  $('#myModal .modal-dialog').removeClass("modalSize");
            $('#divAxisBundle').hide();
            $('#lblTitle').text("*Title");
        }
    });

    //Add or Update Change Record
    $('#btnSave').click("click", function (event) {
        event.preventDefault();
        addUpdate();
    });

    //recalc the risk value any time the value changes in the risk or bus impact dropdowns
    $('#risk').change(function () {
        calcRisk($('#risk').val(), $('#busimpact').val());
    });

    $('#busimpact').change(function () {
        calcRisk($('#risk').val(), $('#busimpact').val());
    });

    //Used for adding a new doc from the Related Documents and Tasks Tab
    $('#btnaddDoc').click(function () {
        if ($('#addLinkTitle').val() === '') {
            $('#error').html("<strong>! Title</strong> is a required field.").fadeIn(1000);
            setTimeout
                (function () {
                    $("#error").fadeOut();
                }, 3000
                );
            return false;
        }

        if ($('#addLinkValue').val() === '') {
            $('#error').html("<strong>! Link/Document</strong> is a required field.").fadeIn(1000);
            setTimeout
                (function () {
                    $("#error").fadeOut();
                }, 3000
                );
            return false;
        }
        //Save all change record properties in an object to send to post/put web service 
        var properties = new Object();
        properties.Change_Record_Id = id;
        properties.DocTitle = $('#addLinkTitle').val();
        properties.DocType = $('#addLinkType').val();
        properties.DocLocation = $('#addLinkValue').val();
        properties.CreateDate = new Date($.now());

        $.ajax({
            url: 'api/data/PostChangeDocument',
            method: 'post'
        , data: properties
        })
            .done(function (e) {
                getRelatedDocs();
                $('#errorInsert').hide();
                $('#errorUpdate').hide();
                $('#errorSelect').hide();
                $('#successInsert').hide();

                $('#success').html("Added related document successfully.").fadeIn(1000);
                setTimeout
                (function () {
                    $("#success").fadeOut();
                }, 3000
                );
            })
            .fail(function (e) {
                $('#error').html("Failed to Add Related Document.").fadeIn(1000);
                $('#errorSelect').hide();
                $('#successInsert').hide();
                $('#successUpdate').hide();
                $('#errorInsert').hide();

                setTimeout(function () {
                    $("#error").fadeOut();
                }, 5000);
            });
    });

    //Hide or show the document link or file upload element depending on the type
    $('#addLinkType').click(function () {
        var typeVal = $('#addLinkType').val();
        if (typeVal === "Link") {
            $('#divAddLink').show();
            $('#divFileUpload').hide();
        }
        if (typeVal === "File") {
            $('#divFileUpload').show();
            $('#divAddLink').hide();
        }
    });

    //Upload files on the Related docuuments and tasks screen to a file server
    $('#btnUploadFile').on('click', function () {
        if ($('#fileUpload').val() === '') {
            $('#error').html("! Please select a file to upload.").fadeIn(1000);
            setTimeout
                (function () {
                    $("#error").fadeOut();
                }, 2000);
            return false;
        }
        if ($('#addLinkTitle').val() === '') {
            $('#error').html("! Title is a required field.").fadeIn(1000);
            setTimeout
                (function () {
                    $("#error").fadeOut();
                }, 2000);
            return false;
        }
        var filedata = new FormData();
        var files = $("#fileUpload").get(0).files;

        // Add the uploaded content to the form data collection
        if (files.length > 0) {
            filedata.append("UploadedFile", files[0]);
        }
        var uploadfilepath = "";
        $.ajax({
            type: "POST",
            url: "api/data/GetUploadPath?changeid=" + id,
            contentType: false,
            processData: false,
            data: filedata
        }).done(function (data) {
            uploadfilepath = data;
            var doUpload = false;
            var overwrite = false;
            //check for error 
            if (uploadfilepath.fileSavePath.length <= 0) {
                $('#error').html("! Error: Could not get File Path.").fadeIn(1000);
                setTimeout(function () {
                    $("#error").fadeOut();
                }, 5000);
            }
            //overwrite file 
            else if (uploadfilepath.confirmMessage.length > 25 && uploadfilepath.confirmMessage.substring(0, 25) === "This file already exists.") {
                var cnfrm = confirm(uploadfilepath.confirmMessage);
                if (cnfrm === true) {
                    doUpload = true;
                    overwrite = true;
                }
            }
            else {
                doUpload = true;
            }
            if (doUpload) {
                // Make Ajax request with the contentType = false, and processData = false
                $.ajax({
                    type: "POST",
                    url: "api/data/UploadFile?fileSavePath=" + uploadfilepath.fileSavePath,
                    contentType: false,
                    processData: false,
                    data: filedata
                }).done(function (data) {
                    if (data.substring(0, 5) === "ERROR") {
                        $('#error').html("! Error: Could not Upload File.").fadeIn(1000);
                        setTimeout(function () {
                            $("#error").fadeOut();
                        }, 3000);
                    }
                    else {
                        $('#success').html("! Successfully uploaded file.").fadeIn(1000);
                        setTimeout
                            (function () {
                                $("#success").fadeOut();
                            }, 3000);

                        //if we're doing an overwrite there's no need to update the db info
                        if (!overwrite)
                            addRelatedDoc(uploadfilepath.fileSavePath);
                    }
                }).fail(function (xhr, textStatus, errorThrown) {
                    $('#error').html("Upload Failed.").fadeIn(1000);
                    setTimeout(function () {
                        $("#error").fadeOut();
                    }, 5000);
                });
            } //end doUpload
        }).fail(function () {
            $('#error').html("! Error: File Upload service failed.").fadeIn(1000);
            setTimeout(function () {
                $("#error").fadeOut();
            }, 5000);
        }); //end getUploadPath
    }); //end btnupload func

    //For auditing
    $('#btnAddHistory').click(function () {
        $('#divAddHistory').show();
        var properties = new Object();
        properties.Change_Record_Id = id;
        properties.Source = $('#selSource').val();
        properties.Field = $('#selField').val();
        properties.ChangeDate = $('#changeDate').val();
        properties.Previous = $('#selPrevious option:selected').text();
        properties.New = $('#selNew option:selected').text();
        properties.isAudit = 1;
        $.ajax({
            url: 'api/data/AddChangeHistoryRecord',
            method: 'post',
            data: properties
        }).done(function () {
            //Refresh data
            getChangeRecordHistoryDataTable();
            $('#success').html('You successfully added a change history record').show();
            setTimeout(function () {
                $('#success').fadeOut();
            }, 3000);
        }).fail(function () {
            $('#error').html('Failed to add change history record').show();
            setTimeout(function () {
                $('#error').fadeOut();
            }, 5000);
        });
    });

    //Display History audit section for selected users
    $('#historyTab').click(function () {
        if (userSecurity[0].IsAdmin == true) {
            $('#divHistoryRecord').show();
            $('#divAddHistory').show();
        }
        else {
            $('#divHistoryRecord').hide();
            $('#divAddHistory').hide();
        }
    });

    //Change page label to corresponding tab
    $('#myAssignments').click(function () {
        $('#chgmgthome').text("My Assignments");
    });

    $('#changerequests').click(function () {
        $('#chgmgthome').text("Change Requests");
    });

    $('#changerecords').click(function () {
        $('#chgmgthome').text("Change Records");
    });

    $('#changetasks').click(function () {
        $('#chgmgthome').text("Change Tasks");
    });

    $('#btnChangeReport').click(function () {
        window.open("http://svrdwdb/ReportServer/Pages/ReportViewer.aspx?/Service+Manager/Change+Management+Master&rs:Command=Render&ChangeNumber=" + id, '_blank');
    });

    $('#otherSrc').change(function () {
        var otherSrc = $('#otherSrc').val();
        if (otherSrc === "Project") {
            $('#divTitle').show();
            $('#divTitle2').hide();
            populateProjectValues();
        }
        else if (otherSrc === "Strategic") {
            $('#divTitle2').show();
            $('#divTitle').hide();
            populateStrategicValues();
        }
        else if (otherSrc === "--None--") {
            $('#selOtherSrc').empty();
            $('#selOtherSrc').append('<option value="0">--None--</option>');
            $('#selOtherSrc2').empty();
            $('#selOtherSrc2').append('<option value="0">--None--</option>');
        }
    });

    //Setup calendars using an anonymous function
    $(function () {
        // change record calendars
        $('#startdatepicker').datetimepicker({
            format: 'm-d-Y  H:i'
        });
        $('#enddatepicker').datetimepicker({
            format: 'm-d-Y  H:i'
        });
        $('#workstartdatepicker').datetimepicker({
            format: 'm-d-Y  H:i'
        });
        $('#workenddatepicker').datetimepicker({
            format: 'm-d-Y  H:i'
        });
        $("#requestbydatepicker").datepicker();
        $("#completedate").datepicker();
        $("#startdate").datepicker();
        $("#task_startdate").datepicker();
        $("#postReviewDate").datepicker();
        $("#assessbyDate").datepicker();
        $("#begDD").datepicker();
        $("#endDD").datepicker();
        $("#begCD").datepicker();
        $("#endCD").datepicker();

        //change task calendars   
        $("#duedate").datepicker();
        $("#duedate1").datepicker();
        $('#dateEntered').datepicker();
        $('#devDueDate').datepicker();
        $('#devCompleteDate').datepicker();
        $("#qRequested").datepicker();
        $("#qReceived").datepicker();
        $("#qApproved").datepicker();
        $("#sDelivered").datepicker();
        $("#sImplemented").datepicker();
        $('#changeDate').datepicker();
        $('#ltt_date').datepicker();
        $('#lttr_date').datepicker();
        $('#ltp_date').datepicker();
        $('#qAnnFeeDueDate').datepicker();

        //admin calendars
        $('#pStartDate').datepicker();
        $('#pEndDate').datepicker();

        //tech assess calendars
        $('#t_duedate').datepicker();
        $('#t_assessbyDate').datepicker();

        //calendar filters
        $('.ltp').datepicker({
            onClose: function () {
                tblAxisRpt.draw();
            }
        });


    }); //end anonymous function

    //Add popup calendar to calendar icons
    $(function () {
        $('#reqCalendar').click(function () {
            $("#requestbydatepicker").datepicker("show");
        });
        $('#wedCal').click(function () {
            $('#startdatepicker').datetimepicker('show');
        });
        $('#endCal').click(function () {
            $('#enddatepicker').datetimepicker('show');
        });
        $('#aStartCal').click(function () {
            $('#workstartdatepicker').datetimepicker('show');
        });
        $('#aEndCal').click(function () {
            $('#workenddatepicker').datetimepicker('show');
        });
        $('#duedateCal').click(function () {
            $("#duedate").datepicker("show");
        });
        $('#duedateCal1').click(function () {
            $("#duedate1").datepicker("show");
        });
        $('#completeCal').click(function () {
            $("#completedate").datepicker("show");
        });
        $('#startdateCal').click(function () {
            $("#startdate").datepicker("show");
        });
        $('#task_startdate_Cal').click(function () {
            $("#task_startdate").datepicker("show");
        });
        $('#dateEnterCal').click(function () {
            $("#dateEntered").datepicker("show");
        });
        $('#devDueDateCal').click(function () {
            $("#devDueDate").datepicker("show");
        });
        $('#devCompleteDateCal').click(function () {
            $("#devCompleteDate").datepicker("show");
        });
        $('#qRequestedCal').click(function () {
            $("#qRequested").datepicker("show");
        });
        $('#qReceivedCal').click(function () {
            $("#qReceived").datepicker("show");
        });
        $('#qApprovedCal').click(function () {
            $("#qApproved").datepicker("show");
        });
        $("#sDeliveredCal").click(function () {
            $("#sDelivered").datepicker("show");
        });
        $("#sImplementedCal").click(function () {
            $("#sImplemented").datepicker("show");
        });
        $('#postCal').click(function () {
            $("#postReviewDate").datepicker("show");
        });
        $('#assessByCal').click(function () {
            $("#assessbyDate").datepicker("show");
        });
        $('#changeDateCal').click(function () {
            $("#changeDate").datepicker("show");
        });
        $('#ltt_dateCal').click(function () {
            $("#ltt_date").datepicker("show");
        });
        $('#lttr_dateCal').click(function () {
            $("#lttr_date").datepicker("show");
        });
        $('#ltp_dateCal').click(function () {
            $("#ltp_date").datepicker("show");
        });
        $('#pStartDateCal').click(function () {
            $('#pStartDate').datepicker("show");
        });
        $('#pEndDateCal').click(function () {
            $('#pEndDate').datepicker("show");
        });
        $('#begDD_Cal').click(function () {
            $("#begDD").datepicker("show");
        });
        $('#endDD_Cal').click(function () {
            $("#endDD").datepicker("show");
        });
        $('#begCD_Cal').click(function () {
            $("#begCD").datepicker("show");
        });
        $('#endCD_Cal').click(function () {
            $("#endCD").datepicker("show");
        });
        $('#qAnnFeeDueDateCal').click(function () {
            $('#qAnnFeeDueDate').datepicker("show");
        });
        $('#t_duedateCal').click(function () {
            $('#t_duedate').datepicker("show");
        });
        $('#t_assessbyDateCal').click(function () {
            $('#t_assessbyDate').datepicker("show");
        });

        $('#ltpfCal').click(function () {
            $('#ltpf').datepicker("show");
        });

        $('#ltptCal').click(function () {
            $('#ltpt').datepicker("show");
        });
        //End add popup calendar to calendar icons
    });

    //Get parameters from the url for ch_record_id, task id, and change_task_type_id
    ch_record_id = getUrlVars()["id"];
    ch_task_id = getUrlVars()["task_id"];
    change_task_type_id = getUrlVars()["change_task_type_id"];
    external_task_id = getUrlVars()["external_task_id"];

    // Open change record/task details from email link
    if ((ch_record_id != null) && (ch_task_id == null)) {
        populateRecord(ch_record_id);
    }
    else if (change_task_type_id == 4 && ch_record_id != null && ch_task_id != null) {
        // Go to assessment tab for assessment tasks
        goToAssessment(ch_record_id);
    }
    else if (ch_record_id != null && ch_task_id != null) {
        // Go to task modal for all other tasks    
        getTaskDetails2(ch_task_id, ch_record_id, change_task_type_id); //possibly use any variations of this method  
    }

    //Create a filter for change records/requests
    $('#btnFilter').click(function () {

        //validation 
        var invalid = false;
        var msg = '';
        if (($('#begCD').val() === '') && ($('#endCD').val() !== '')) {
            invalid = true;
            msg = "<strong>! You need to complete the Begin Create Date.</strong>";
        }

        if (($('#begCD').val() !== '') && ($('#endCD').val() == '')) {
            invalid = true;
            msg = "<strong>! You need to complete the End Create Date.</strong>";
        }

        if (($('#begDD').val() === '') && ($('#endDD').val() !== '')) {
            invalid = true;
            msg = "<strong>! You need to complete the Begin Due Date.</strong>";
        }

        if (($('#begDD').val() !== '') && ($('#endDD').val() == '')) {
            invalid = true;
            msg = "<strong>! You need to complete the End Due Date.</strong>";
        }

        if (invalid == true) {
            $('#error').html(msg).fadeIn(1000);
            setTimeout(function () {
                $('#error').fadeOut();
            }, 5000);
            return false;
        }
        else {

            filterResults();

        } //end else for validation
    });

    // Change page title to Advanced Filter hide/show relative buttons
    $('#aFilter').click(function () {
        $('#chgmgthome').text("Advanced Filter");
    });

    //Create a link to a change record/request
    $('#btnLink').click(function () {
        $('#divLinkModal').modal('show');
        $('#divlink').html("<a href='http://" + servername + "/ChangeManagement/views/changeapp.html#id=" + id + "'>http://" + servername + "/ChangeManagement/views/changeapp.html#id=" + id + "</a>");
    });

    $("#status").change(function () {
        //Add reject reason code for change request
        var change_status = $('#status').val();
        if (change_status == 5) {
            $('#rejectReason').empty();
            // Populate the reject reasons for change record
            $.ajax({
                url: 'api/data/GetRejectReasons'
            })
            .done(function (data) {
                $select = $('#rejectReason');
                var listitems;
                $.each(data, function (key, value) {
                    listitems += '<option value=' + key + '>' + value + '</option>';
                });
                $select.append(listitems);
            })
            .fail(function (xhr, textStatus, errorThrown) {
                // console.log("Error: " + xhr.status + ": " + xhr.statusText);
            });

            $('#divReject').show();
        } else {
            $('#divReject').hide();
        }

        //Change label on dropdown change
        var reqStatus = $('#status').val();
        if (reqStatus < 3)
            $('#ReqRecNav').html("Change Request #" + id)
        else
            $('#ReqRecNav').html("Change Record #" + id);

        //Display confirm modal depending on changing status
        if ((histCR.status == 3 || histCR.status == 4 || histCR.status == 6)
              && (change_status == 1 || change_status == 2)) {
            $('#divConfirmModal').modal({
                backdrop: "static"
            });
        }

        //Display confirm modal depending on changing status
        if ((histCR.status == 4 || histCR.status == 6) && (change_status == 3 || change_status == 2 || change_status == 1)) {
            $('#divConfirmModal2').modal({
                backdrop: "static"
            });
        }
    }); //end status

    //set a flag if changing status from Approved, Completed, Closed back to Assessed or Requested
    $('#btnSaveConfirm').click(function () {
        confirmStatus = true
        $('#divConfirmModal').modal('hide');
    });

    //set a flag if changing status from  Completed, Closed on upward
    $('#btnSaveConfirm2').click(function () {
        confirmStatus2 = true
        $('#divConfirmModal2').modal('hide');
    });

    //set size of the multiselect to equal the amount of options
    //    $(function () {
    //        $("#multiSelect").attr("size", $("#multiSelect option").length);
    //    });


    //add jquery plugin to select dropdown 
    // var deselect = false;
    $('#multiSelect').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        buttonClass: 'btn btn-primary',
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
      //  selectAllText: 'Select All / Deselect All',
        onDeselectAll: function () {
            //  deselect = true;
        }
    });

    //filter datatable using values from status multiselect dropdown
    $('#multiSelect').on('change', function () {
        var search = [];
        $.each($('#multiSelect option:selected'), function () {
            search.push($(this).text());
        });
        search = search.join('|');
        tblAxisRpt.column(10).search(search, true, false).draw();
    });


    //add jquery plugin to select dropdown 
    $('#multiSelect2').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        buttonClass: 'btn btn-primary',
        enableCaseInsensitiveFiltering: true,
        includeSelectAllOption: true,
     //   selectAllText: 'Select All / Deselect All'
    });

    //filter datatable using values from assignedTo multiselect dropdown
    $('#multiSelect2').on('change', function () {
        var search2 = [];
        $.each($('#multiSelect2 option:selected'), function () {
            search2.push($(this).text());
        });
        search2 = search2.join('|');
        tblAxisRpt.column(2).search(search2, true, false).draw();
    });

    //    $('#selObsolete').on('change', function () {
    //        var searchVal = $('#selObsolete').val();
    //        if (searchVal === "None selected")
    //            getAxisReport();
    //        else
    //            tblAxisRpt.column(11).search(searchVal, true, false).draw();
    //    });

    //set flag when a Post Reviewer is selected; this will change the status to Closed on Save
    //    $('#postReviewBy').change(function () {
    //        if ($('#postReviewBy').val() != 0) {
    //            result = confirm("Changing this value will Close this record after clicking Save.");
    //        } else {
    //            result = false;
    //        }
    //    });

});                                                            // end document.ready()

// assessment comments
function showCommentModal() {
    //Get and set current selected comment
    var rowData;
    var currentRow;
    $('#tblAssessComments tbody').on('click', 'a', function () {
        var table = $('#tblAssessComments').DataTable();
        if (table.data().length > 0) {
            currentRow = $(this).closest('tr');
            rowData = table.row(currentRow).data();
        }
    });

    //add a timeout to make sure rowData has completed
    setTimeout(function () {
        $('#assessComment').val(rowData.Comments + '\t\t' + rowData.CreatedBy + '\t' + formatDate2(rowData.CreatedDate));
    }, 1000);

    $('#cmntHeader').html("Assessment Comment");
    $('#assessComment').show();
    $('#detailComment').hide();
    $('#implementComment').hide();
    $('#allComment').hide();
    $('#taskComment').hide();

    $('#commentModal').modal({
        backdrop: 'static',
        show: true
    });
}

// detail comments
function showCommentModal2() {
    //Get and set current selected comment
    var rowData;
    var currentRow;
    $('#tblDetailComments tbody').on('click', 'a', function () {
        var table = $('#tblDetailComments').DataTable();
        if (table.data().length > 0) {
            currentRow = $(this).closest('tr');
            rowData = table.row(currentRow).data();
        }
    });

    //add a timeout to make sure rowData has completed
    setTimeout(function () {
        $('#detailComment').val(rowData.Comments + '\t\t' + rowData.CreatedBy + '\t' + formatDate2(rowData.CreatedDate));
    }, 1000);

    $('#cmntHeader').html("Detail Comment");
    $('#assessComment').hide();
    $('#detailComment').show();
    $('#implementComment').hide();
    $('#allComment').hide();
    $('#taskComment').hide();
    $('#commentModal').modal({
        backdrop: 'static',
        show: true
    });
}

// implementation comments
function showCommentModal3() {
    //Get and set current selected comment
    var rowData;
    var currentRow;
    $('#tblImplComments tbody').on('click', 'a', function () {
        var table = $('#tblImplComments').DataTable();
        if (table.data().length > 0) {
            currentRow = $(this).closest('tr');
            rowData = table.row(currentRow).data();
        }
    });

    //add a timeout to make sure rowData has completed
    setTimeout(function () {
        $('#implementComment').val(rowData.Comments + '\t\t' + rowData.CreatedBy + '\t' + formatDate2(rowData.CreatedDate));
    }, 1000);

    $('#cmntHeader').html("Implementation Comment");
    $('#assessComment').hide();
    $('#detailComment').hide();
    $('#implementComment').show();
    $('#allComment').hide();
    $('#taskComment').hide();
    $('#commentModal').modal({
        backdrop: 'static',
        show: true
    });
}

// all comments
function showCommentModal4() {
    //Get and set current selected comment
    var rowData;
    var currentRow;
    $('#tblComments tbody').on('click', 'a', function () {
        var table = $('#tblComments').DataTable();
        if (table.data().length > 0) {
            currentRow = $(this).closest('tr');
            rowData = table.row(currentRow).data();
        }
    });

    //add a timeout to make sure rowData has completed
    setTimeout(function () {
        $('#allComment').val(rowData.Comments + '\t\t' + rowData.CreatedBy + '\t' + formatDate2(rowData.CreatedDate));
    }, 1000);

    $('#cmntHeader').html("All Comments");
    $('#assessComment').hide();
    $('#detailComment').hide();
    $('#implementComment').hide();
    $('#allComment').show();
    $('#taskComment').hide();
    $('#commentModal').modal({
        backdrop: 'static',
        show: true
    });
}

// task comments
function showCommentModal5() {
    //Get and set current selected comment
    var rowData;
    var currentRow;
    $('#tblTaskComments tbody').on('click', 'a', function () {
        var table = $('#tblTaskComments').DataTable();
        if (table.data().length > 0) {
            currentRow = $(this).closest('tr');
            rowData = table.row(currentRow).data();
        }
    });

    //add a timeout to make sure rowData has completed
    setTimeout(function () {
        $('#taskComment').val(rowData.Comments + '\t\t' + rowData.CreatedBy + '\t' + formatDate2(rowData.CreatedDate));
    }, 1000);

    $('#cmntHeader').html("Task Comments");
    $('#assessComment').hide();
    $('#detailComment').hide();
    $('#implementComment').hide();
    $('#allComment').hide();
    $('#taskComment').show();
    $('#commentModal').modal({
        backdrop: 'static',
        show: true
    });
}

function filterResults() {
    //Show search results heading
    $('#lblSearch').show();

    var changeRecordFilter = new Object();

    var filterbyId = $('#filterbyId').val();
    var f_status = $('#f_status').val();
    var f_type = $('#f_type').val();
    var f_requestedby = $('#f_requestedby').val();

    var f_assignToId = $('#f_assignToId').val();
    //  var  assignedToArray = $("input[name='f_assignToId[]']:checked");
    // var assignedToArray =  $('#f_assignToId').val();

    var f_busline = $('#f_busline').val();
    var f_bus_priority = $('#f_bus_priorityId').val();
    var f_begCD = $('#begCD').val();
    var f_endCD = $('#endCD').val();
    var f_begDD = $('#begDD').val();
    var f_endDD = $('#endDD').val();

    changeRecordFilter.Change_Record_Id = filterbyId;
    changeRecordFilter.Change_Status_Id = f_status;
    changeRecordFilter.Change_Type_Id = f_type;
    changeRecordFilter.Bus_Line_Id = f_busline;
    changeRecordFilter.Business_Priority_Id = f_bus_priority;
    changeRecordFilter.Requested_By_Id = f_requestedby;

    changeRecordFilter.Assigned_To_Id = f_assignToId;
    // changeRecordFilter.Assigned_To_Id = assignedToArray;

    changeRecordFilter.BegCreateDate = f_begCD;
    changeRecordFilter.EndCreateDate = f_endCD;
    changeRecordFilter.BegDueDate = f_begDD;
    changeRecordFilter.EndDueDate = f_endDD;

    tblFilter = $('#tblFilter').DataTable({
        info: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 10,
        processing: true,
        destroy: true,
        ajax: {
            url: "api/data/GetChangeRecordsFiltered",
            data: changeRecordFilter
        },
        columns: [
                   { data: "Change_Record_Id", title: "Change#" },
                   { data: "Change_Short_Desc", title: "Description" },
                   { data: "Status", title: "Status" },
                   { data: "Type", title: "Type" },
                   { data: "Business_Priority", title: "Business Priority" },
                   { data: "Change_Bus_Descr", title: "Business Description" },
                   { data: "RequestedByName", title: "Requested By" },
                   { data: "AssignedTo", title: "Assigned To" },
                ],
        columnDefs: [
                    {
                        render: function (data, type, row) {
                            return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                        },
                        targets: [0]
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            var fullname = data;
                            var names = fullname.split(' ');
                            var formatName;
                            if (names.length == 2)
                                formatName = names[1] + ', ' + names[0];
                            else
                                formatName = fullname;
                            return formatName;
                        },
                        targets: [6]
                    }
                    ]
    });
}

function addUpdate() {
    //reset variable
    isDirty = false;

    /************************************************ Validation**************************************************/
    // validate other sources 
    if ($('#source').val() !== '--None--' && $('#sourceid').val() === '') {
        $('#error').html("<strong>! You need to select a Source Id for the selected Source.</strong>").show();
        setTimeout(function () {
            $('#error').fadeOut();
        }, 3000);
        return false;
    }

    //validate source for projects
    if ($('#otherSrc').val() === "Project" && $('#selOtherSrc').val() == 0) {
        $('#error').html("<strong>! You need to select a Title for the selected Source.</strong>").show();
        setTimeout(function () {
            $('#error').fadeOut();
        }, 3000);
        return false;
    }

    // validate source for strategic initiatives
    if ($('#otherSrc').val() === "Strategic" && $('#selOtherSrc2').val() == 0) {
        $('#error').html("<strong>! You need to select a Title for the selected Source.</strong>").show();
        setTimeout(function () {
            $('#error').fadeOut();
        }, 3000);
        return false;
    }


    // title is a required field
    if ($('#shortdesc').val() === "") {
        $('#errorTitle').show();
        setTimeout(function () {
            $("#errorTitle").fadeOut();
        }, 3000);
        return false;
    }

    //only accept numerics for source ids text fields
    var sourceid = $('#sourceid').val();
    if (isNaN(sourceid)) {
        $('#error').html("<strong>! This field only accepts numbers. </strong>").fadeIn(1000);
        setTimeout(function () {
            $('#error').fadeOut();
        }, 3000);
        return false;
    }

    //Planned end date should be later than planned start date
    var planstart = $('#startdatepicker').val();
    var planend = $('#enddatepicker').val();
    // if (new Date(planstart).getDate() > new Date(planend).getDate()) {
    if (new Date(planstart) > new Date(planend)) {
        $('#error').html('!<strong> Planned End Date has to be later than Planned Start Date').show();
        setTimeout(function () {
            $("#error").fadeOut();
        }, 3000);
        return false;
    }

    //Actual end date should be later than actual start date
    var workend = $('#workenddatepicker').val();
    var workstart = $('#workstartdatepicker').val();
    //  if (new Date(workstart).getDate() > new Date(workend).getDate()) {
    if (new Date(workstart) > new Date(workend)) {
        $('#error').html('!<strong> Actual End Date has to be later than Actual Start Date').show();
        setTimeout(function () {
            $("#error").fadeOut();
        }, 3000);
        return false;
    }

    //Do not allow a user to save a change request that has an unassigned assessment task 
    var assessby = $('#assessby').val();
    if (assessby == 0) {
        ShowMessage("error", "! The Assignee field in the Assessment section is a required field.");
        return false;
    }

    //Do not allow someone to add a new request without assigning a Change Manager
    var assignedto = $('#assignedto').val();
    if (assignedto == 0) {
        ShowMessage("error", "! The Change Manager field in the Request section is a required field.");
        return false;
    }

    //Make sure all change tasks (including assessment) are closed before saving to "Complete", "Closed"  status 
    var chg_status = $('#status').val();
    if (chg_status == 4 || chg_status == 6) {
        var filteredData = tblchangetasks
            .column(6)
            .data()
            .filter(function (value, index) {
                return value === "Open" ? true : false;
            });
        if ((filteredData[0] === "Open") && (chg_status == 4 || chg_status == 6)) {
            $('#error').html('<strong>! Cannot move to this Status until the Assessment and all related tasks are closed.</strong>').fadeIn(1000); ;
            setTimeout(function () {
                $('#error').fadeOut();
            }, 5000);
            return false;
        }

        if ($('#completedby').val() == 0) {
            ShowMessage('error', '! Completed By field needs to be completed .');
            return false;
        }

        if ($('#approvedby').val() == 0 || $('#approveddate').val() == '') {
            ShowMessage('error', '! The Approved By and Approved Date fields need to be completed.');
            return false;
        }

        if ($('#workstartdatepicker').val() == '' || $('#workenddatepicker').val() == '') {
            ShowMessage('error', '! The Actual Start Time and Actual End Time both need to be completed.');
            return false;
        }
    }

    //Cannot move to Rejected status unless the Assessment or any other change task is Closed
    if (chg_status == 5) {
        var filteredData1 = tblchangetasks
            .column(6)
            .data()
            .filter(function (value, index) {
                return value === "Open" ? true : false;
            });
        if ((filteredData1[0] === "Open") && (chg_status == 5)) {
            $('#error').html('<strong>! Cannot move to this Status until the Assessment and all related tasks are closed.</strong>').fadeIn(1000); ;
            setTimeout(function () {
                $('#error').fadeOut();
            }, 5000);

            return false;
        }
    }

    //Cannot have an Open Assessment with the Status of anything but Requested
    if (($('#taskStatus1').val() == 1) && ($('#status').val() != 1)) {
        ShowMessage('error', '! You cannot have an Open Assessment with this Status.');
        return false;
    }

    //Post Review needs to be completed when changing status to Closed
    if (chg_status == 6 && $('#postReviewBy').val() == 0) {
        ShowMessage('error', "! Post Review By needs to be completed.");
        return false;
    }

    //Post Review Date needs to be completed when changing status to Completed
    if (chg_status == 6 && $('#postReviewDate').val() == 0) {
        ShowMessage('error', "! Post Review Date needs to be completed.");
        return false;
    }

    /******************************Reset Fields on Status Changes***********************/

    //Clear out these fields if status moves from Approved upward
    if (confirmStatus == true) {
        $('#approvedby').html('');
        $('#approveddate').html('');
    }

    //If status is moved from Completed, Closed on Upward then clear out the relevant fields
    if (confirmStatus2 == true) {
        $('#workstartdatepicker').val('');
        $('#workenddatepicker').val('');
        $('#completedby').val(0);
        $('#postReviewBy').val(0);
        $('#postReviewDate').val('');
    }

    //Clear out the post review date if there is no post Reviewer selected
    if ($('#postReviewBy').val() == 0)
        $('#postReviewDate').val('');

    /***************************************************************************************/
    //User must enter a post review date if a post reviewer is selected
    //    if ($('#postReviewBy').val() != 0 && $('#postReviewDate').val() === '') {
    //        ShowMessage('error', '! A post review date is required before saving this record.');
    //        return false;
    //    }

    //User must enter a completed by field when closing a record
    //    if ($('#postReviewBy').val() != 0 || $('#postReviewDate').val() != '') {
    //        if ($('#completedby').val() == 0) {
    //            ShowMessage('error', '! Completed by field needs to be completed .');
    //            return false;
    //        }
    //    }


    /******************** End Validation ***********************************************/

    //Save all change record properties in an object to send to post/put web service 
    var properties = new Object();
    // properties.Change_Stage_Id = $( '#stage' ).val();
    properties.Change_Record_Id = id; //current record
    properties.Change_Short_Desc = $('#shortdesc').val();
    properties.CreateDate = $('#crdate').val();
    properties.CreatedBy = $('#crby').val();
    properties.Requested_By_Id = $('#requestedby').val();
    properties.SourceType = $('#source').val();
    properties.SourceVal = $('#sourceid').val();
    properties.OtherSourceType = $('#otherSrc').val();

    if ($('#otherSrc').val() === "Project")
        properties.OtherSourceVal = $('#selOtherSrc').val();
    else if ($('#otherSrc').val() === "Strategic")
        properties.OtherSourceVal = $('#selOtherSrc2').val();
    else
    //--None-- is assigned to either Project or Strategic Title
        properties.OtherSourceVal = 0;

    properties.Change_Type_Id = $('#type').val();
    properties.Change_Priority_Id = $('#priority').val();
    properties.Business_Priority_Id = $('#buspriority').val();
    properties.Bus_Line_Approver_Id = $('#blapprover').val();
    // properties.Bus_Line_Contact_Id = $( '#blcontact' ).val();
    properties.Change_Long_Desc = $('#description').text();
    properties.Business_Case = $('#businesscase').text();
    properties.Category_Id = $('#category').val();
    properties.Business_Impact_Id = $('#busimpact').val();
    properties.Change_Impact_Id = $('#impact').val();
    properties.Change_Risk_Id = $('#risk').val();
    properties.Bus_NonImplement_Effects = $('#busnonimplement').val();
    properties.PostReviewCompletedDate = $('#postReviewDate').val();
    properties.PostReviewCompletedBy_Id = $('#postReviewBy').val();
    // properties.Technical_Assessment = $('#notes').text();
    properties.Change_NonImplement_Effects = $('servimplement').val();
    properties.ChangePlan = $('#changeplan').val();
    properties.BackoutPlan = $('#backoutplan').val();
    properties.TestPlan = $('#testplan').val();

    var startdt = $('#startdatepicker').val();
    var endtimedt = $('#enddatepicker').val();
    var actualstartdt = $('#workstartdatepicker').val();
    var actualendtime = $('#workenddatepicker').val();

    properties.PlannedStartDate = startdt;
    properties.WorkStartDate = actualstartdt;
    properties.PlannedEndDate = endtimedt;
    properties.WorkEndDate = actualendtime;

    properties.Resources = $('#txtResources').text();
    properties.Request_By_Date = $('#requestbydatepicker').val();
    //  properties.Comments = $('#comments').text();

    properties.Change_Status_Id = $('#status').val();
    properties.Assigned_To_Id = $('#assignedto').val();
    properties.Change_Completed_By = $('#completedby').val();
    properties.Change_Completed_Date = $('#completedate').val();
    properties.Change_Start_Date = $('#startdate').val();
    properties.AssessmentBy_Id = $('#assessby').val();
    properties.AssessmentBy_Date = $("#assessbyDate").val();
    properties.Bus_Line_Id = $('#bus_line').val();
    properties.Reject_Reason_Id = $('#rejectReason').val();

    //Add approval user id and date for approved records
    var change_status_id = $('#status').val();
    var approvedby = $('#approvedby').val();
    var approveddate = $('#approveddate').val();

    if (change_status_id == 3 && approvedby == "" && approveddate == "") {
        $('#approveddate').val(formatDate2(new Date()));
        $('#approvedby').val(currentUserName);
    }
    else if (change_status_id == 1 || change_status_id == 2 || change_status_id == 5) {
        $('#approveddate').val("");
        $('#approvedby').val("");
    }

    properties.Approval_By = $('#approvedby').val();
    var approvalDate = new Date($('#approveddate').val());
    properties.Approval_Date = formatDate2(approvalDate);

    //If record id is already available go to update method else create a new record
    if (id !== 0) {
        $.ajax({
            url: 'api/data/UpdateChangeRecord',
            method: 'put',
            data: properties
        }).done(function (e) {
            //Reset confirmStatus and confirmStatus2 flags to default
            confirmStatus = false;
            confirmStatus2 = false;

            $('#errorInsert').hide();
            $('#errorUpdate').hide();
            $('#errorSelect').hide();
            $('#successInsert').hide();
            $('#successUpdate').fadeIn(1000);
            setTimeout(function () {
                $("#successUpdate").fadeOut();
            }, 5000);

            //Hide validation error message
            $('#errorTitle').hide();

            //Send email when Change Manager is assigned to a record and it's not the same change manager
            var employeeId = $('#assignedto').val();
            if (recAssignToChange == true && employeeId != 0 && (histCR.assignedto != employeeId)) {
                recAssignToChange = false;
                var chgrecid = id;
                var changeRecordEmail = new Object();
                changeRecordEmail.employeeId = employeeId;
                changeRecordEmail.changeRecordId = chgrecid;
                changeRecordEmail.serverName = servername;
                $.ajax({
                    url: "api/data/AssignRecord",
                    method: "get",
                    data: changeRecordEmail
                }).done(function (data) {
                    //            $('#success').html("Change Record " + data.changeRecordId + " was sent to Assignee at <strong>" + data.email + "</strong> successfully!").show()
                    //            setTimeout(function(){
                    //                $('#success').fadeOut();
                    //            }, 3000);                
                }).fail(function (data) {
                    //            $('#error').html("<strong>! Failed to assign Change Record.</strong>").show()
                    //            setTimeout(function(){
                    //                $('#error').fadeOut();
                    //            }, 3000);
                });
            }  //end send email 

            // set assessment change task fields that come from the change record ui and get saved to the change task table
            var properties2 = new Object();
            //Since your updating this will always be the last assessment value
            properties2.Change_Task_Id = ch_task_id_assess;
            properties2.Change_Record_Id = id;
            properties2.LongDesc = $('#shortdesc').val();  //comes from change record UI
            properties2.Assigned_To = $('#assessby').val(); //comes from change record UI
            properties2.CompleteDate = $('#assessbyDate').val(); //comes from change record UI
            properties2.Type_Id = 4; //hardcode for assessment type task
            properties2.DueDate = $('#duedate1').val(); //comes from change record UI
            properties2.Task_Status_Id = $('#taskStatus1').val(); //comes from change record UI

            //update change task fields with values from change record ui
            $.ajax({
                url: 'api/data/UpdateChangeTask2',
                method: 'put',
                data: properties2
            }).done(function (data) {
                setTimeout(function () {
                    //Refresh change record
                    populateRecord(id);
                }, 1000);

                //Send an email to the Assignee for each change assessment task assigned to them on update
                var employeeId = $('#assessby').val();
                if (taskAssignToChange_assess == true && employeeId != 0 && employeeId != histCR.assessby) {
                    taskAssignToChange_assess = false;
                    var chgrecid = id;
                    var changeRecordEmail = new Object();
                    changeRecordEmail.employeeId = employeeId;
                    changeRecordEmail.changeRecordId = chgrecid;
                    changeRecordEmail.changeExternalTaskId = extChangeTaskId_assess;
                    changeRecordEmail.changeTaskId = ch_task_id_assess;
                    changeRecordEmail.serverName = servername;
                    changeRecordEmail.changeTask_Type_Id = ch_task_typeId;
                    $.ajax({
                        url: "api/data/AssignTask",
                        method: "get",
                        data: changeRecordEmail
                    }).done(function (data) {
                        //                        $('#success').html("<strong>Change Task " + data.changeTaskId + "</strong> was sent to Assignee at <strong>" + data.email + "</strong> successfully!").show()
                        //                        setTimeout(function () {
                        //                            $('#success').fadeOut();
                        //                        }, 3000);
                    }).fail(function (data) {
                        //                        $('#error').html("<strong>! Failed to assign Change Task. Please select a valid Assignee.</strong>").show()
                        //                        setTimeout(function () {
                        //                            $('#error').fadeOut();
                        //                        }, 3000);
                    });
                }

                //Send an email to Change Manager to to notify them the the record has been Assessed
                var assignedtoE = $('#assignedto').val();
                var statusAssess = $('#status').val();
                var taskStatus1_Assess = $('#taskStatus1').val();
                var assessby = $('#assessby').val();
                if ((parseInt(statusAssess) == 2) && (assignedtoE != 0) && (parseInt(taskStatus1_Assess) == 2) && (histCR.status != parseInt(statusAssess))) {
                    var empId = assignedtoE;
                    var cr_Id = $('#requestnum').val();
                    var cre = {};
                    cre.changeRecordId = cr_Id;
                    cre.serverName = servername;
                    cre.employeeId = empId;
                    $.ajax({
                        url: 'api/data/AssessedEmail',
                        method: 'get',
                        data: cre
                    }).done(function (data) {
                        $('#success').html("<strong>An email confirmation was sent to the Change Manager.</strong>").fadeIn(1000);
                        setTimeout(function () {
                            $('#success').fadeOut();
                        }, 5000);
                    }).fail(function (statusText, errorThrown, xhr) {
                        $('#error').html("<strong>Email confirmation was not sent.</strong>").fadeIn(1000);
                        setTimeout(function () {
                            $('#error').fadeOut();
                        }, 5000);
                        return false;
                    });
                }

                //Send an email to Change Manager to to notify them the the record has been Completed
                var assignedtoC = $('#assignedto').val();
                var statusComplete = $('#status').val();
                if (statusComplete == 4 && $('#assignedto').val() != 0) {
                    var empId1 = $('#assignedto').val();
                    var cr_Id1 = $('#requestnum').val();
                    var cre1 = {};
                    cre1.changeRecordId = cr_Id1;
                    cre1.serverName = servername;
                    cre1.employeeId = empId1;
                    $.ajax({
                        url: 'api/data/CompletedEmail',
                        method: 'get',
                        data: cre1
                    }).done(function (data) {
                        $('#success').html("<strong>An email confirmation was sent to the Change Manager.</strong>").fadeIn(1000);
                        setTimeout(function () {
                            $('#success').fadeOut();
                        }, 5000);
                    }).fail(function (statusText, errorThrown, xhr) {
                        $('#error').html("<strong>Email confirmation was not sent.</strong>").fadeIn(1000);
                        setTimeout(function () {
                            $('#error').fadeOut();
                        }, 5000);
                        return false;
                    });
                }

                //Send an email to Change Manager to notify them the the record has been Closed
                var assignedtoT = $('#assignedto').val();
                if ($('#status').val() == 6 && $('#assignedto').val() != 0) {
                    var empId2 = $('#assignedto').val();
                    var cr_Id2 = $('#requestnum').val();
                    var requestedbyId = $('#requestedby').val();
                    var cre2 = {};
                    cre2.changeRecordId = cr_Id2;
                    cre2.serverName = servername;
                    cre2.employeeId = empId2;
                    cre2.requestedById = requestedbyId;
                    $.ajax({
                        url: 'api/data/ClosedEmail',
                        method: 'get',
                        data: cre2
                    }).done(function (data) {
                        $('#success').html("<strong>An email confirmation was sent to the Change Manager.</strong>").fadeIn(1000);
                        setTimeout(function () {
                            $('#success').fadeOut();
                        }, 5000);
                    }).fail(function (statusText, errorThrown, xhr) {
                        $('#error').html("<strong>Email confirmation was not sent.</strong>").fadeIn(1000);
                        setTimeout(function () {
                            $('#error').fadeOut();
                        }, 5000);
                        return false;
                    });
                }

                //                // Set technical assessment change task fields that come from the change record ui and get saved to the changetasks table
                //                var properties5 = new Object();
                //                if (t_ch_task_id_assess !== null && t_ch_task_id_assess !== 0)
                //                    properties5.Change_Task_Id = t_ch_task_id_assess;
                //                else
                //                    properties5.Change_Task_Id = 0;
                //                properties5.Change_Record_Id = id;
                //                properties5.LongDesc = $('#techNotes').val();  //comes from change record UI
                //                properties5.Assigned_To = $('#t_assessby').val(); //comes from change record UI
                //                properties5.CompleteDate = $('#t_assessbyDate').val(); //comes from change record UI
                //                properties5.Type_Id = 8; //hardcode for assessment type task
                //                properties5.DueDate = $('#t_duedate').val(); //comes from change record UI
                //                properties5.Task_Status_Id = $('#t_status').val(); //comes from change record UI
                //                $.ajax({
                //                    url: 'api/data/UpdateChangeTask3',
                //                    method: 'put',
                //                    data: properties5
                //                }).done(function (data) {
                //                    //Refresh change record
                //                    populateRecord(id);
                //                }).fail(function () {
                //                    ShowMessage("error", "! Failed to update the Technical Assessment Task");
                //                });
            }).fail(function () {
                ShowMessage("error", "! Failed to update the Assessment Task");
            });
        }).fail(function (e) {
            $('#errorUpdate').fadeIn(1000);
            $('#errorSelect').hide();
            $('#successInsert').hide();
            $('#successUpdate').hide();
            $('#errorInsert').hide();
            setTimeout(function () {
                $("#errorUpdate").fadeOut();
            }, 5000);
        });
    } else {
        $.ajax({
            url: 'api/data/PostChangeRecord',
            method: 'post',
            data: properties
        }).done(function (data) {
            id = data;
            $('#errorInsert').hide();
            $('#errorUpdate').hide();
            $('#errorSelect').hide();
            $('#successUpdate').hide();
            $('#successInsert').fadeIn(1000);
            setTimeout(function () {
                $("#successInsert").fadeOut();
            }, 5000);
            $('#errorTitle').hide();

            //Send an email when a new record is assigned and saved
            var employeeId = $('#assignedto').val();
            if (recAssignToChange == true) {
                recAssignToChange = false;
                var chgrecid = id;
                var changeRecordEmail = new Object();
                changeRecordEmail.employeeId = employeeId;
                changeRecordEmail.changeRecordId = chgrecid;
                changeRecordEmail.serverName = servername;
                $.ajax({
                    url: "api/data/AssignRecord",
                    method: "get",
                    data: changeRecordEmail
                }).done(function (data) {
                    //            $('#success').html("Change Record " + data.changeRecordId + " was sent to Assignee at <strong>" + data.email + "</strong> successfully!").show()
                    //            setTimeout(function(){
                    //                $('#success').fadeOut();
                    //            }, 3000);                                           
                }).fail(function (data) {
                    //            $('#error').html("<strong>! Failed to assign Change Record.</strong>").show()
                    //            setTimeout(function(){
                    //                $('#error').fadeOut();
                    //            }, 3000);
                });
            }

            // Set assessment change task fields that come from the change record ui and get saved to the changetasks table
            var properties3 = new Object();
            properties3.Change_Task_Id = 0;  //Since your adding a new task this will always be zero
            properties3.Change_Record_Id = id;
            properties3.LongDesc = $('#shortdesc').val();  //comes from change record UI
            properties3.Assigned_To = $('#assessby').val(); //comes from change record UI
            properties3.CompleteDate = $('#assessbyDate').val(); //comes from change record UI
            properties3.Type_Id = 4; //hardcode for assessment type task
            properties3.DueDate = $('#duedate1').val(); //comes from change record UI
            properties3.Task_Status_Id = $('#taskStatus1').val(); //comes from change record UI

            //Add assessment task details from the change record to the change task table
            $.ajax({
                url: 'api/data/PostChangeTask2',
                method: 'post',
                data: properties3
            })
            .done(function (data) {
                //Get new change task id for assessment task
                var new_change_task_id = data;

                //Send an email if a assessment change task is assigned to an employee on the creation of a new assessment task 
                var employeeId = $('#assessby').val();
                if (taskAssignToChange_assess == true && histCR.assessby != employeeId) {
                    taskAssignToChange_assess = false;
                    var chgrecid = id;
                    var changeRecordEmail = new Object();
                    changeRecordEmail.employeeId = employeeId;
                    changeRecordEmail.changeRecordId = chgrecid;
                    changeRecordEmail.changeTaskId = new_change_task_id; // Assign new change task id
                    changeRecordEmail.serverName = servername;
                    changeRecordEmail.changeTask_Type_Id = 4;

                    //Get external task id to display in email when creating a new task
                    $.ajax({
                        url: "api/data/GetExternalTaskId",
                        method: "get",
                        data: changeRecordEmail
                    }).done(function (data) {
                        //Assign new external task id
                        changeRecordEmail.changeExternalTaskId = data;
                        $.ajax({
                            url: "api/data/AssignTask",
                            method: "get",
                            data: changeRecordEmail
                        })
                        .done(function (data) {
                            //                            $('#success').html("Change Task " + data.changeTaskId + " was sent to Assignee at <strong>" + data.email + "</strong> successfully!").show()
                            //                            setTimeout(function () {
                            //                                $('#success').fadeOut();
                            //                            }, 3000);
                        })
                        .fail(function (data) {
                            //                            $('#error').html("<strong>! Failed to assign Change Task.</strong>").show()
                            //                            setTimeout(function () {
                            //                                $('#error').fadeOut();
                            //                            }, 3000);
                        });
                    }).fail(function (data) {
                        $('#error').html("<strong>! Failed to get External Task Id.</strong>").show()
                        setTimeout(function () {
                            $('#error').fadeOut();
                        }, 3000);
                    });
                }

                //Refresh change record and related change tasks to set the last assessment task added as the current assessment task on the current record
                populateRecord(id);

                //                // Set technical assessment change task fields that come from the change record ui and get saved to the changetasks table
                //                var properties4 = new Object();
                //                properties4.Change_Task_Id = 0;  //Since your adding a new task this will always be zero
                //                properties4.Change_Record_Id = id;
                //                properties4.LongDesc = $('#techNotes').val();  //comes from change record UI
                //                properties4.Assigned_To = $('#t_assessby').val(); //comes from change record UI
                //                properties4.CompleteDate = $('#t_assessbyDate').val(); //comes from change record UI
                //                properties4.Type_Id = 8; //hardcode for assessment type task
                //                properties4.DueDate = $('#t_duedate').val(); //comes from change record UI
                //                properties4.Task_Status_Id = $('#t_status').val(); //comes from change record UI
                //                $.ajax({
                //                    url: 'api/data/PostChangeTask3',
                //                    method: 'post',
                //                    data: properties4
                //                }).done(function (data) {
                //                    //Refresh change record
                //                    populateRecord(id);
                //                }).fail(function () {
                //                    ShowMessage("error", "! Failed to add the Technical Assessment Task");
                //                });
            })
            .fail(function () {
                ShowMessage("error", "! Failed to add the  Assessment Task");
            });
        }).fail(function () {
            $('#successInsert').hide();
            $('#successUpdate').hide();
            $('#errorUpdate').hide();
            $('#errorSelect').hide();
            $('#errorInsert').fadeIn(1000);
            setTimeout(function () {
                $("#errorInsert").fadeOut();
            }, 5000);
        });
    }
} //End add/update function

//Get url variables 
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }

    return vars;
}

//current user's security permissions
function GetUserPermissions(type, applicationname) {
    //Reset userSecurity list
    userSecurity = [];

    var sec = new Object();
    sec.type = type;
    sec.application_name = applicationname;

    $.ajax({
        url: 'api/data/GetSecuritySettings'
                , method: 'post'
                , data: sec
    }).done(function (data) {
        var listitems;
        $.each(data, function (key, value) {
            userSecurity.push(value)
        });

        //Display Business Priority dropdown only for Admins
        if (userSecurity.length !== 0) {
            if (userSecurity[0].IsAdmin == true) {
                $('#buspriority').prop("disabled", false);
            }
            else {
                $('#buspriority').prop("disabled", true);
            }
        } else {

            //Disable buttons and link on main page for unauthorized users.
            $('#btnAdmin').prop("disabled", true);
            $('#btnAllRequests').prop("disabled", true);
            $('#btnReports').prop("disabled", true);
            $('#logo').prop("disabled", true);
            $('#cmpp_link').prop("disabled", true);

            $('#error').html("<strong>! You are not registered to access this application.</strong>").fadeIn(1000);
            //setTimeout(function () {
            //   $('#error').fadeOut();
            // }, 5000);
            return false;
        }
    })
        .fail(function (xhr, textStatus, errorThrown) {
            // console.log( "Error: " + xhr.status + ": " + xhr.statusText );
            $('#error').html("! User Authentication failed.").fadeIn(1000);
            setTimeout(function () {
                $('#error').fadeOut();
            }, 5000);
            return false;
        });
}

function backToChangeManagerMain() {

    //clear out title and link/document fields, fileupload 
    $('#addLinkTitle').val("");
    $('#addLinkValue').val("");
    $('#fileUpload').empty();

    goToChangeManagerHome();
}

//clear all strategic initiative inputs
function clearSI() {
    $('#siId').val("");
    $('#siTitle').val("");
    $('#siCreatedBy').val("");
    $('#siFY').val("");
    $('#siOwner').val("");
    $('#siDescr').text("");
    $('#siActive').prop('checked', false);
}

//Get all strategic initiatives
function getAllSI() {
    $('#divStrategic').show();
    $('#divSI').show();
    $('#divProjects').hide();
    $('#divProjectTbl').hide();

    $('#tblSI').DataTable({
        cache: false,
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        responsive: false,
        destroy: true,
        filter: false,
        //  order: [[4, "desc"]],
        ajax: 'api/data/GetStrategicInitiatives?Type=' + 1,
        columns: [
                  { data: "Strategic_Id", "title": "Id" }
                , { data: "Strategic_Title", "title": "Title" }
                , { data: "Strategic_CreatedBy", "title": "Created By" }
                , { data: "Strategic_Owner", "title": "Owner" }
                , { data: "Strategic_FiscalYear", "title": "FiscalYear" }
                , { data: "Strategic_Descr", "title": "Description" }
                , { data: "Strategic_Active", "title": "Completed", "visible": false }
                ],
        columnDefs: [
                  {
                      render: function (data, type, row) {
                          return '<a  id="" onclick="getAllSIById(' + data + ');" href="#" >' + data + '</a>'
                      },
                      targets: [0]
                  },
        ]
    });   //end datatable
} //end function

//Get individual strategic initiative
function getAllSIById(id) {
    $.ajax({
        url: 'api/data/GetStrategicInitiativesById?Id=' + id + "&Type=" + 2,
        method: 'get'
    }).done(function (data) {
        $('#siId').val(data.Strategic_Id);
        $('#siTitle').val(data.Strategic_Title);
        $('#siCreatedBy').val(data.Strategic_CreatedBy);
        $('#siFY').val(data.Strategic_FiscalYear);
        $('#siOwner').val(data.Strategic_Owner);
        $('#siDescr').text(data.Strategic_Descr);
        $('#siActive').val(data.Strategic_Active);

        //Hide all strategic initiatives
        $('#divSI').hide();

        //Show all change records related to the selected strategic initiative
        $('#divSI_CR').show();

        GetStrateicInitiativesById_CR(data.Strategic_Id);

    }).fail(function () {
        //alert('fail to get strategic initiatives by id');
    });
}

//Validate strategic initiative fields
function validateSI() {
    var isValid = true;
    var errMessage = "! Please enter valid data for the following fields:  <br/>";

    if ($('#siTitle').val() === "") {
        $('#error').html(errMessage += "<strong>Title</strong> <br />").fadeIn(1000);
        setTimeout
            (function () {
                $("#error").fadeOut();
            }, 5000
                );
        isValid = false;
    }

    if ($('#siFY').val() === "") {
        $('#error').html(errMessage += "<strong>Fiscal Year</strong> <br />").fadeIn(1000);
        setTimeout
            (function () {
                $("#error").fadeOut();
            }, 5000
                );
        isValid = false;
    }

    if ($('#siOwner').val() === "") {
        $('#error').html(errMessage += "<strong>Owner</strong> <br />").fadeIn(1000);
        setTimeout
            (function () {
                $("#error").fadeOut();
            }, 5000
                );
        isValid = false;
    }
    return isValid;
}

//Validate project fields
function validateProject() {
    var isValid = true;
    var errMessage = "! Please enter valid data for the following fields:  <br/>";

    if ($('#p_Title').val() === "") {
        $('#error').html(errMessage += "<strong>Title</strong> <br />").fadeIn(1000);
        setTimeout
            (function () {
                $("#error").fadeOut();
            }, 5000
                );
        isValid = false;
    }

    if ($('#p_FY').val() === "") {
        $('#error').html(errMessage += "<strong>Fiscal Year</strong> <br />").fadeIn(1000);
        setTimeout
            (function () {
                $("#error").fadeOut();
            }, 5000
                );
        isValid = false;
    }

    if ($('#p_Owner').val() === "") {
        $('#error').html(errMessage += "<strong>Owner</strong> <br />").fadeIn(1000);
        setTimeout
            (function () {
                $("#error").fadeOut();
            }, 5000
                );
        isValid = false;
    }
    return isValid;
}

//clear all project inputs
function clearProjectInputs() {
    $('#p_Id').val("");
    $('#p_Title').val("");
    $('#p_CreatedBy').val("");
    $('#p_FY').val("");
    $('#p_Owner').val("");
    $('#txtpDescr').text("");
    $('#pckComplete').prop('checked', false);
    $('#pStartDate').val('');
    $('#pEndDate').val('');
    $('#selBL').val(0);
    $('#selPS').val(0);
}

//Get all projects
function getAllProjects() {
    $('#divProjects').show();
    $('#divProjectTbl').show();
    $('#divStrategic').hide();
    $('#divSI').hide();

    $('#tblProjects').DataTable({
        cache: false,
        info: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 10,
        processing: true,
        responsive: false,
        destroy: true,
        filter: false,
        //  order: [[4, "desc"]],
        ajax: 'api/data/Get_Projects?Type=' + 1,
        columns: [
                  { data: "Project_Id", "title": "Id" }
                , { data: "Project_Title", "title": "Title" }
                , { data: "Project_CreatedBy", "title": "Created By" }
                , { data: "Project_Owner", "title": "Owner" }
                , { data: "Project_FiscalYear", "title": "FiscalYear" }
                , { data: "Project_Descr", "title": "Description" }
                , { data: "Project_Start_Date", "title": "Start Date" }
                , { data: "Project_End_Date", "title": "End Date" }
                , { data: "Project_Completed", "title": "Completed", "visible": false }
                , { data: "Project_Status_Descr", "title": "Project Status" }
                , { data: "Change_Bus_Descr", "title": "Business Line" }

                ],
        columnDefs: [
                  {
                      render: function (data, type, row) {
                          return '<a  id="" onclick="getAllProjectsById(' + data + ');" href="#" >' + data + '</a>'
                      },
                      targets: [0]
                  },
                  {
                      render: function (data, type, row) {
                          return formatDate1(data);
                      },
                      targets: [6, 7]
                  }
        ]
    });    //end datatable
} //end function

//Get individual projects  
function getAllProjectsById(id) {
    $.ajax({
        url: 'api/data/Get_Projects_By_Id?Id=' + id + "&Type=" + 2,
        method: 'get'
    }).done(function (data) {
        $('#p_Id').val(data.Project_Id);
        $('#p_Title').val(data.Project_Title);
        $('#p_CreatedBy').val(data.Project_CreatedBy);
        $('#p_FY').val(data.Project_FiscalYear);
        $('#p_Owner').val(data.Project_Owner);
        $('#txtpDescr').text(data.Project_Descr);
        $('#pckComplete').val(data.Project_Completed);

        formatDate(data.Project_Start_Date, $('#pStartDate'));
        // $( '#pStartDate' ).val( data.Project_Start_Date );
        formatDate(data.Project_End_Date, $('#pEndDate'));
        // $( '#pEndDate' ).val( data.Project_End_Date );

        $('#selPS').val(data.Project_Status_Id);
        $('#selBL').val(data.Project_Bus_Line_Id);

        //Hide all projects table
        $('#divProjectTbl').hide();
        //Show all change records related to the selected project
        $('#divCRProjects');

        GetProjectsById_CR(data.Project_Id);

    }).fail(function () {

        //alert('fail to get projects by id');
    });
}

//Group change records with their project
function GetProjectsById_CR(projectId) {
    tblCRProject = $('#tblCRProject').DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        destroy: true,
        ajax: 'api/data/GetProjectsById_CR?projectId=' + projectId,
        columns: [
                    { data: "Project_Id", title: "Project Id" },
                    { data: "Project_Title", title: "Project Title" },
                    { data: "Change_Record_Id", title: "Change Record Id" },
                    { data: "Change_Short_Desc", title: "Title" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                },
                targets: [2]
            }
        ]
    });

    $('#divCRProjects').show();
    $('#btnBackPrjct').show();
}

//Group change records with their strategic initiative
function GetStrateicInitiativesById_CR(strategicId) {
    tblSI_CR = $('#tblSI_CR').DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        destroy: true,
        ajax: 'api/data/GetStrateicInitiativesById_CR?strategicId=' + strategicId,
        columns: [
                    { data: "Strategic_Id", title: "Strategic Id" },
                    { data: "Strategic_Title", title: "Strategic Title" },
                    { data: "Change_Record_Id", title: "Change Record Id" },
                    { data: "Change_Short_Desc", title: "Title" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                },
                targets: [2]
            }
        ]
    });

    $('#divSI_CR').show();
    $('#btnBackSI').show();
}

//Used for adding a new doc to the database from the Related Documents and Tasks tab when the Upload button is clicked
function addRelatedDoc(uploadfilepath) {
    //Use filename for title of related doc
    var pathFilename = uploadfilepath.split("\\");
    var filename = pathFilename[pathFilename.length - 1];

    //Save all change document properties in an object to send to post/put web service 
    var properties = new Object();
    properties.Change_Record_Id = id;
    properties.DocTitle = $('#addLinkTitle').val();
    properties.DocType = $('#addLinkType').val();

    if (properties.DocType === "Link")
        properties.DocLocation = $('#addLinkValue').val();

    if (properties.DocType === "File")
        properties.DocLocation = uploadfilepath;

    properties.CreateDate = new Date($.now());

    $.ajax({
        url: 'api/data/PostChangeDocument',
        method: 'post',
        data: properties
    })
        .done(function (e) {
            getRelatedDocs();
            $('#errorInsert').hide();
            $('#errorUpdate').hide();
            $('#errorSelect').hide();
            $('#successInsert').hide();

            //Clear out fileupload entry
            var fileuploadclear = $('#fileUpload');
            fileuploadclear.replaceWith(fileuploadclear.clone(true));

            $('#success').html("Added related document successfully.").fadeIn(1000);
            setTimeout
            (function () {
                $("#success").fadeOut();
            }, 5000
                );
        })
        .fail(function (e) {
            $('#errorSelect').hide();
            $('#successInsert').hide();
            $('#successUpdate').hide();
            $('#errorInsert').hide();

            $('#error').html("Failed to Add Related Document.").fadeIn(1000);
            setTimeout(function () {
                $("#error").fadeOut();
            }, 5000);
        });
}

function showChangeRequests() {
    tblchangeadmin = $('#tblchangeadmin').DataTable({
        // scrollX: true,       
        // autoWidth: false,
        // responsive: true,
        info: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        processing: true,
        destroy: true,
        ajax: "api/data/GetAllChangeRequests?Type=3",
        columns: [
                    { data: "Change_Num", title: "Change#" },
                    { data: "Change_Short_Desc", title: "Description" },
                    { data: "Type", title: "Type" },
                    { data: "RequestedByName", title: "Requested By" },
                    { data: "AssignedTo", title: "Assigned To" },
                    { data: "Business_Priority", title: "Business Priority" },
                    { data: "Status", title: "Status" },
                    { data: "TotalTasks", title: "Open Tasks" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                },
                targets: [0]
            },
            {
                render: function (data, type, row) {
                    var fullname = data;
                    var names = fullname.split(' ');
                    var formatName;
                    if (names.length == 2)
                        formatName = names[1] + ', ' + names[0];
                    else
                        formatName = fullname;

                    return formatName;
                },
                targets: [2]
            },
              {
                  render: function (data, type, row) {

                      return '<a id="" onclick="gotoRelated(' + row.Change_Num + ' );">' + data + '</a>';
                  },
                  targets: [7]
              }
        ],
        drawCallback: function (settings) {
        }
    });  //end tblchangeadmin 
}

function showMyChangeRequests() {
    tblMyRequests = $('#tblMyRequests').DataTable({
        // scrollX: true,       
        // autoWidth: false,
        // responsive: true,
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        destroy: true,
        ajax: "api/data/GetAllChangeRequests?Type=6",
        columns: [
                    { data: "Change_Num", title: "Change#" },
                    { data: "Change_Short_Desc", title: "Description" },
                    { data: "Type", title: "Type" },
                    { data: "RequestedByName", title: "Requested By" },
                    { data: "Business_Priority", title: "Business Priority" },
                    { data: "Status", title: "Status" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                },
                targets: [0]
            },
            {
                render: function (data, type, row) {
                    var fullname = data;
                    var names = fullname.split(' ');
                    var formatName;
                    if (names.length == 2)
                        formatName = names[1] + ', ' + names[0];
                    else
                        formatName = fullname;

                    return formatName;
                },
                targets: [2]
            }
        ],
        drawCallback: function (settings) {

        }
    }); //end tblMyRequests 
}

function showOpenAssessments() {
    tblOpenAssessments = $('#tblOpenAssessments').DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pageLength: 5,
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        processing: true,
        destroy: true,
        ajax: "api/data/GetAllChangeRequests?Type=7",
        columns: [
                    { data: "Change_Num", title: "Change#" },
                    { data: "Change_Short_Desc", title: "Description" },
                    { data: "Type", title: "Type" },
                    { data: "RequestedByName", title: "Requested By" },
                    { data: "AssignedTo", title: "Assigned To" },
                    { data: "Business_Priority", title: "Business Priority" },
                    { data: "Status", title: "Status" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                },
                targets: [0]
            },
            {
                render: function (data, type, row) {
                    var fullname = data;
                    var names = fullname.split(' ');
                    var formatName;
                    if (names.length == 2)
                        formatName = names[1] + ', ' + names[0];
                    else
                        formatName = fullname;

                    return formatName;
                },
                targets: [2]
            }
        ],
        drawCallback: function (settings) {

        }
    }); //end 

}

function showRejectedReasons() {
    tblRejectReasons = $('#tblRejectReasons').DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        pageLength: 5,
        lengthChange: true,
        processing: true,
        destroy: true,
        ajax: "api/data/GetAllChangeRequests?Type=8",
        columns: [
                    { data: "Change_Num", title: "Change#" },
                    { data: "Change_Short_Desc", title: "Description" },
                    { data: "Type", title: "Type" },
                    { data: "RequestedByName", title: "Requested By" },                  
                    { data: "Business_Priority", title: "Business Priority" },
                    { data: "Status", title: "Status" }
        ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                },
                targets: [0]
            },
            {
                render: function (data, type, row) {
                    var fullname = data;
                    var names = fullname.split(' ');
                    var formatName;
                    if (names.length == 2)
                        formatName = names[1] + ', ' + names[0];
                    else
                        formatName = fullname;

                    return formatName;
                },
                targets: [2]
            }
        ],
        drawCallback: function (settings) {

        }
    }); //end 

}

function showChangeRecords() {
    tblchangerecord = $('#tblchangerecord').DataTable({
        info: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        // pageLength: 5,
        processing: true,
        destroy: true,
        ajax: "api/data/GetAllChangeRecords?Type=4",
        columns: [
                        { data: "Change_Num", title: "Change#" },
                        { data: "Change_Short_Desc", title: "Description" },
                        { data: "Type", title: "Type" },
                        { data: "RequestedByName", title: "Requested By" },
                        { data: "AssignedTo", title: "Assigned To" },
                        { data: "Business_Priority", title: "Business Priority" },
                        { data: "Status", title: "Status" },
                        { data: "TotalTasks", title: "Open Tasks" }
            ],
        columnDefs: [
                {
                    render: function (data, type, row) {
                        return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                    },
                    targets: [0]
                },
                 {
                     render: function (data, type, row) {
                         var fullname = data;
                         var names = fullname.split(' ');
                         var formatName;
                         if (names.length == 2)
                             formatName = names[1] + ', ' + names[0];
                         else
                             formatName = fullname;

                         return formatName;
                     },
                     targets: [2]
                 },
                 {
                     render: function (data, type, row) {
                         return '<a id="implementlink" onclick="gotoRelated(' + row.Change_Num + ' );">' + data + '</a>';
                     },
                     targets: [7]
                 }
            ]
    }); //end tblchangerecord
}

function showMyChangeRecords() {
    tblMyRecords = $('#tblMyRecords').DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        destroy: true,
        ajax: "api/data/GetAllChangeRecords?Type=5",
        columns: [
                        { data: "Change_Num", title: "Change#" },
                        { data: "Change_Short_Desc", title: "Description" },
                        { data: "Type", title: "Type" },
                        { data: "RequestedByName", title: "Requested By" },
                        { data: "Business_Priority", title: "Business Priority" },
                        { data: "Status", title: "Status" }
            ],
        columnDefs: [
                {
                    render: function (data, type, row) {
                        return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                    },
                    targets: [0]
                },
                 {
                     render: function (data, type, row) {
                         var fullname = data;
                         var names = fullname.split(' ');
                         var formatName;
                         if (names.length == 2)
                             formatName = names[1] + ', ' + names[0];
                         else
                             formatName = fullname;

                         return formatName;
                     },
                     targets: [3]
                 },

            ],
        drawCallback: function (settings) {

        }
    });   //end tblMyRecords
}

function populateProperties() {
    //  Populate the change state values for change tasks
    //    $.ajax( {
    //        url: 'api/data/GetBusLineApprovers'
    //    } )
    //    .done( function ( data ) {
    //        $select = $( '#blapprover' );
    //        var listitems;
    //        $.each( data, function ( key, employee ) {
    //            listitems += '<option value=' + employee.Id + '>' + employee.LastFirst + '</option>';
    //        } );
    //        $select.append( listitems );
    //    } )
    //    .fail( function ( xhr, textStatus, errorThrown ) {
    //        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    //    } );

    //Populate the change state values for change tasks
    $.ajax({
        url: 'api/data/GetChangeStateTaskValues'
    })
    .done(function (data) {
        var $select = $('#taskstate');
        //$select.empty();

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the category values for change record
    $.ajax({
        url: 'api/data/GetCategoryValues'
    })
    .done(function (data) {
        var $select = $('#category');
        //$select.empty();

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the service impact values for change record
    $.ajax({
        url: 'api/data/GetImpactValues'
    })
    .done(function (data) {
        //$select.empty();
        var $select = $('#impact');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the business impact values for change record
    $.ajax({
        url: 'api/data/GetBusinessImpactValues'
    })
    .done(function (data) {
        var $select = $('#busimpact');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the priority values for change record
    $.ajax({
        url: 'api/data/GetPriorityValues'
    })
    .done(function (data) {
        var $select = $('#priority');
        //$select.empty();

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the business priority values for change record
    $.ajax({
        url: 'api/data/GetBusPriorityValues'
    })
    .done(function (data) {
        var $select = $('#buspriority');
        var $select1 = $('#f_bus_priorityId');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
        $select1.append(listitems);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the risk values for change record
    $.ajax({
        url: 'api/data/GetRiskValues'
    })
    .done(function (data) {
        var $select = $('#risk');
        //$select.empty();
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
        var $select = $('#type');
        var $f_select = $('#f_type');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
        $f_select.append(listitems);

        //  Set Type default to 'Normal' when creating a new request
        $('#type').val(1);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the source type values for change record
    $.ajax({
        url: 'api/data/GetSourceTypeValues'
    })
    .done(function (data) {
        var $select = $('#source');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the other source type values for change record
    $.ajax({
        url: 'api/data/GetOtherSourceTypeValues'
    })
    .done(function (data) {
        var $select = $('#otherSrc');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate the status values
    $.ajax({
        url: 'api/data/GetStatusValues'
    })
    .done(function (data) {
        var $select = $('#status');
        var $select1 = $('#selPrevious');
        var $select2 = $('#selNew');
        var $f_select_status = $('#f_status');
        $f_select_status.append("<option value='0'>--None--</option>");

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
        $select1.append(listitems);
        $select2.append(listitems);

        $f_select_status.append(listitems);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });


    //Populate PivProd Employees
    $.ajax({
        url: 'api/data/GetEmployeesPivProd'
    })
    .done(function (data) {
        //    $selectCont = $( '#blcontact' );
        var $selectApprovers = $('#blapprover');
        var $selectRequestedBy = $('#requestedby');
        var $f_selectRequestedBy = $('#f_requestedby');

        var listitems;
        $.each(data, function (key, employee) {
            listitems += '<option value=' + employee.Id + '>' + employee.LastFirst + '</option>';
        });
        //  $selectCont.append( listitems );
        $selectApprovers.append(listitems);
        $selectRequestedBy.append(listitems);
        $f_selectRequestedBy.append(listitems);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate PivProd IT Employees
    $.ajax({
        url: 'api/data/GetITEmployeesPivProd'
    }).done(function (data) {
        var $select = $('#assignedto');
        var $selectTask = $('#taskassignedto');
        var $selectCompleteBy = $('#completedby');
        var $selectPostReview = $('#postReviewBy');
        var $selectAssessBy = $('#assessby');
        var $selectT_AssessBy = $('#t_assessby');
        var $selectOwner = $('#owner');
        var $selectTrainBy = $('#trainby');
        var $selectProdBy = $('#selprodby');
        var $f_selectAssignToId = $('#f_assignToId');

        var $multiSelect2 = $('#multiSelect2');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + value.Id + '>' + value.LastFirst + '</option>';
        });
        $select.append(listitems);
        $selectTask.append(listitems);
        $selectCompleteBy.append(listitems);
        $selectPostReview.append(listitems);
        $selectAssessBy.append(listitems);
        $selectT_AssessBy.append(listitems);
        $selectOwner.append(listitems);
        $selectTrainBy.append(listitems);
        $selectProdBy.append(listitems);

        $f_selectAssignToId.append(listitems);

        $multiSelect2.append(listitems);
        $multiSelect2.multiselect('rebuild');

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the task type values for change tasks
    $.ajax({
        url: 'api/data/GetTypes'
    })
    .done(function (data) {
        var $select = $('#tasktype');

        var listitems;
        $.each(data, function (key, value) {

            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the dev stage values for change tasks
    $.ajax({
        url: 'api/data/GetDevStageValues'
    })
    .done(function (data) {
        var $select = $('#devStage');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the dev type values for change tasks
    $.ajax({
        url: 'api/data/GetDevTypeValues'
    })
    .done(function (data) {
        var $select = $('#devType');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the task status values for change tasks
    $.ajax({
        url: 'api/data/GetTaskStatusValues'
    })
    .done(function (data) {
        var $select = $('#taskStatus');
        var $select1 = $('#taskStatus1');

        var $select2 = $('#t_status');

        var listitems;

        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
        $select2.append(listitems);

        //Populate assessment statuses    
        $select1.append('<option value=' + 1 + '>' + data[1] + '</option>');
        $select1.append('<option value=' + 2 + '>' + data[2] + '</option>');

    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the dev category values for change tasks
    $.ajax({
        url: 'api/data/GetDevCategoryValues'
    })
    .done(function (data) {
        var $select = $('#devCategory');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the business line values for change record
    $.ajax({
        url: 'api/data/GetBusLineValues'
    })
    .done(function (data) {

        var $select = $('#bus_line');
        $f_select_busline = $('#f_busline');
        var selBL = $('#selBL');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + value.Id + '>' + value.Name + '</option>';
        });
        $select.append(listitems);
        $f_select_busline.append(listitems);
        selBL.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the axis type values for change record
    $.ajax({
        url: 'api/data/GetAXISTypeValues'
    })
    .done(function (data) {
        // $select.empty();
        var $select = $('#ax_types');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the axis status values for change record
    $.ajax({
        url: 'api/data/GetAXIS_StatusValues'

    })
    .done(function (data) {
        // $select.empty();
        var $select = $('#ax_status');
        var $selectMultiSelect = $('#multiSelect');

        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
        $selectMultiSelect.append(listitems);
        $selectMultiSelect.multiselect('rebuild');
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });

    //Populate the project status values
    $.ajax({
        url: 'api/data/GetProject_StatusValues'
    })
    .done(function (data) {
        var $select = $('#selPS');
        var listitems;
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        $select.append(listitems);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });
}

function calcRisk(failprob, impact) {
    switch (failprob * impact) {
        case 1:
        case 2:
            $('#riskcalc').text("High");
            $('#riskcalc').addClass("lbl_riskcalc_high").removeClass("lbl_riskcalc_med").removeClass("lbl_riskcal_low");
            break;
        case 3:
        case 4:
        case 5:
            $('#riskcalc').text("Medium");
            $('#riskcalc').addClass("lbl_riskcalc_med").removeClass("lbl_riskcalc_high").removeClass("lbl_riskcal_low");

            break;
        case 6:
        case 7:
        case 8:
        case 9:
        default:
            $('#riskcalc').text("Low");
            $('#riskcalc').addClass("lbl_riskcalc_low").removeClass("lbl_riskcalc_high").removeClass("lbl_riskcal_low");

            break;
    }
}

//Populates data for the record or request  
function populateRecord(changerec_id) {
    //hide axis reports bundle view
    $('#divRptAxis').hide();
    //  $('#divFilters').hide();

    //show link button
    $('#btnLink').show();
    id = changerec_id;
    $.ajax({
        url: 'api/data/GetChangeRecordDetailsById?id=' + id,
        type: 'get'
    }).done(function (data) {
        //$( '#stage' ).val( data.Change_Stage_Id );
        formatDate(data.CreateDate, $('#crdate'));
        $('#crby').val(data.CreatedBy);
        $('#shortdesc').val(data.Change_Short_Desc);
        $('#requestnum').val(id);
        $('#description').text(data.Change_Long_Desc);
        $('#requestedby').val(data.Requested_By_Id);
        $('#category').val(data.Category_Id);
        $('#status').val(data.Change_Status_Id);
        //Create a historical variable to keep track of status
        histCR.status = data.Change_Status_Id;
        $('#risk').val(data.Change_Risk_Id);
        $('#type').val(data.Change_Type_Id);
        $('#priority').val(data.Change_Priority_Id);
        $('#buspriority').val(data.Business_Priority_Id);
        $('#busimpact').val(data.Business_Impact_Id);
        $('#impact').val(data.Change_Impact_Id);
        $('#description').text(data.Change_Desc);
        $('#comments').text(data.Comments);
        $('#busnonimplement').text(data.Bus_NonImplement_Effects);
        $('#notes').text(data.Technical_Assessment);

        if (data.Request_By_Date != null)
            formatDate(data.Request_By_Date, $('#requestbydatepicker'))
        else
            $('#requestbydatepicker').val("");

        $('#startdatepicker').val(formatDate3(data.PlannedStartDate));
        $('#enddatepicker').val(formatDate3(data.PlannedEndDate));
        $('#workstartdatepicker').val(formatDate3(data.WorkStartDate));
        $('#workenddatepicker').val(formatDate3(data.WorkEndDate));

        //Completed Date
        if (data.WorkEndDate != null) {
            formatDate(data.WorkEndDate, $('#completedate'));
        }
        else {
            $('#completedate').val("");
        }

        //Start Date
        if (data.Change_Start_Date != null)
            formatDate(data.Change_Start_Date, $('#startdate'));
        else
            $('#startdate').val("");

        //Post Review Date
        if (data.PostReviewCompletedDate != null)
            formatDate(data.PostReviewCompletedDate, $('#postReviewDate'));
        else
            $('#postReviewDate').val("");

        $('#changeplan').text(data.ChangePlan);
        $('#backoutplan').text(data.BackoutPlan);
        $('#testplan').text(data.TestPlan);
        $('#otherSrc').val(data.OtherSourceType);

        if (data.OtherSourceType === "Project") {
            $('#divTitle').show();
            $('#divTitle2').hide();
            $('#selOtherSrc').val(data.OtherSourceVal);
        } else if (data.OtherSourceType === "Strategic") {
            $('#divTitle2').show();
            $('#divTitle').hide();
            $('#selOtherSrc2').val(data.OtherSourceVal);
        } else if (data.OtherSourceType === "--None--") {
            $('#selOtherSrc').empty();
            $('#selOtherSrc').append('<option value="0">--None--</option>');
            $('#selOtherSrc2').empty();
            $('#selOtherSrc2').append('<option value="0">--None--</option>');
        }

        $('#source').val(data.SourceType);
        $('#sourceid').val(data.SourceVal);
        $('#description').text(data.Change_Long_Desc);
        $('#businesscase').text(data.Business_Case);
        //   $( '#blcontact' ).val( data.Bus_Line_Contact_Id );
        $('#blapprover').val(data.Bus_Line_Approver_Id);
        $('#assignedto').val(data.Assigned_To_Id);
        //Create a historical variable to keep track of Assigned_To_Id value
        histCR.assignedto = data.Assigned_To_Id;
        $('#txtResources').val(data.Resources);
        $('#completedby').val(data.Change_Completed_By);
        //Create a historical variable to keep track of Change_Completed_By value
        histCR.completedby = data.Change_Completed_By;
        $('#postReviewBy').val(data.PostReviewCompletedBy_Id);
        //Create a historical variable to keep track of PostReviewCompletedBy_Id value
        histCR.postReviewBy = data.PostReviewCompletedBy_Id;
        $('#assessby').val(data.AssessmentBy_Id);
        //Create a historical variable to keep track of AssessmentBy_Id value
        histCR.assessby = data.AssessmentBy_Id;
        $('#bus_line').val(data.Bus_Line_Id);
        $('#rejectReason').val(data.Reject_Reason_Id);

        if (data.AssessmentBy_Date != null)
            formatDate(data.AssessmentBy_Date, $('#assessbyDate'));
        else
            $('#assessbyDate').val('');

        $('#approvedby').val(data.Approval_By);
        if (data.Approval_Date != null) {
            var approvaldate = data.Approval_Date;
            // var formatApprdate = new Date( approvaldate );
            $('#approveddate').val(formatDate2(approvaldate));
        } else {
            $('#approveddate').val("");
        }

        //Calculate risk based on impact and probability of failure
        calcRisk($('#risk').val(), $('#busimpact').val());

        //Change label on page load to request or record
        var reqStatus = data.Change_Status_Id;
        if (reqStatus < 3)
            $('#ReqRecNav').html("Change Request #" + id)
        else
            $('#ReqRecNav').html("Change Record #" + id);

        //Display request section and navbuttons and hide main screen                  
        $('#requestdetails').show();
        $('#navbuttons').show();
        $('#main').hide();
        $('#divLanding').hide();

        //Hide "add change task" button 
        $('#spanTask').hide();

        if (boolAssessed) {
            //Show assessment task tab and hide "add change task" button
            $('#tabs a[href="#assess"]').tab('show');
            $('#spanTask').hide();
            boolAssessed = false;
        }
        else if (boolRelated) {
            //Show related tab show "add change task" button   
            $('#tabs a[href="#related"]').tab('show');
            $('#spanTask').show();
            boolRelated = false;
        }
        else {
            //Show request tab as default
            $('#tabs a[href="#request"]').tab('show');
        }

        //Refresh all relevant tables for change requests/records  
        getChangeRecordHistoryDataTable();
        getRelatedDocs();

        showChangeRecords();
        showChangeRequests();
        showOpenAssessments(); //under change requests tab 
        showRejectedReasons(); //under change requests tab
        showMyChangeRecords();
        showMyChangeRequests();

        /*this assigns the status, due date, and comments field for the assessment tasks to variables
        ch_task_status, ch_task_duedate, ch_task_worknotes, respectively and put them in the Change Task table */
        getChangeTasks();

        //Get all comments for the selected change record
        getAllComments();

        //Display reject reason if record in Reject Status is selected
        if ($('#status').val() == 5) {
            $('#rejectReason').empty();

            // Populate the reject reasons for change record
            $.ajax({
                url: 'api/data/GetRejectReasons'
            })
            .done(function (data) {
                $select = $('#rejectReason');
                var listitems;
                $.each(data, function (key, value) {
                    listitems += '<option value=' + key + '>' + value + '</option>';
                });
                $select.append(listitems);
            })
            .fail(function (xhr, textStatus, errorThrown) {
                // console.log("Error: " + xhr.status + ": " + xhr.statusText);
            });

            //Display reject reason
            $('#divReject').show();
        } else {
            $('#divReject').hide();
        }

        //hide admin screens if click from project table
        $('#divAdmin').hide();
    }).fail(function () {
        $('#errorSelect').fadeIn(1000);
        $('#errorInsert').hide();
        $('#errorUpdate').hide();
        $('#errorSelect').hide();
        $('#successInsert').hide();
        $('#successUpdate').hide();
        setTimeout(function () {
            $("#errorSelect").fadeOut();
        }, 5000);
    });
} //end populateRecord

//Use this function to populate status, duedate in the assessment tab when clicking email link
function populateAssessmentDetails() {
    $('#taskStatus1').val(ch_task_status);
    $('#duedate1').val(formatDate1(ch_task_duedate));

    //assessment comments
    $('#tasknotes1').val(ch_task_worknotes);
}

//Use this function to populate status, duedate, completedate in the tech assess section when clicking email link
function populateTechAssessDetails() {
    $('#t_assessby').val(t_assignedto);
    $('#t_status').val(t_ch_task_status);
    $('#t_duedate').val(formatDate1(t_ch_task_duedate));
    $('#t_assessbyDate').val(formatDate1(t_ch_task_completedate));
    $('#techNotes').val(t_technotes);
}

/*Get "all" change tasks for each change record from related tab */
function getChangeTasks() {
    tblchangetasks = $("#tblChangeTasks").DataTable({
        //   responsive: true,
        pageLength: 5,
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        processing: true,
        destroy: true,
        filter: false,
        ajax: "api/data/GetAllTasksForChangeId?id=" + id,
        columns: [
              { data: "Change_Task_Id", "title": "Task Id", "visible": false }
            , { data: "Change_Record_Id", "title": "Change#", "visible": false }
            , { data: "AssignedToTask", "title": "Assigned To" }
            , { data: "External_Task_Id", "title": "Task Id" }
            , { data: "LongDesc", "title": "Description" }
            , { data: "TypeDescription", "title": "Type" }
            , { data: "Task_Status_Desc", "title": "Status" }
            , { data: "CreateDate", "title": "Created" }
            , { data: "DueDate", "title": "Due" }
            , { data: null, "title": "Delete" }
            , { data: "Task_Status_Id", "title": "Task Status", "visible": false }
            , { data: "Type_Id", "title": "Type", "visible": false }
            , { data: "CompleteDate", "title": "Completed Date", "visible": false }
            , { data: "Assigned_To", "title": "Assigned To", "visible": false }
            ],
        columnDefs: [
             {
                 render: function (data, type, row) {
                     assignedToTask = data;
                     histCT.assignedToTask = assignedToTask;
                     return data;
                 },
                 targets: [2]
             },
            {
                render: function (data, type, row) {
                    if (row.Type_Id !== 4)
                        return '<a id="taskid_' + data + '" onclick="getTaskDetails(' + row.Change_Task_Id + "," + row.Type_Id + ')" >' + data + '</a>';
                    else
                        return '<a id="taskid_' + data + '" onclick="goToAssessment(' + row.Change_Record_Id + ')" >' + data + '</a>';
                },
                targets: [3]
            },
             {
                 render: function (data, type, row) {
                     var selectDate = new Date(data);
                     selectDate = ((selectDate.getMonth() + 1) + '/' + selectDate.getDate() + '/' + selectDate.getFullYear());

                     if (selectDate === "12/31/1969")
                         selectDate = ""
                     else
                         selectDate = selectDate;

                     return selectDate;
                 },
                 targets: [7, 8]
             },
              {
                  render: function (data, type, row) {
                      return '<center><button class="btn btn-primary" onclick="deleteTask(' + row.Change_Task_Id + ')">Delete</button><center>';
                  },
                  targets: [9]
              },
              {
                  render: function (data, type, row) {
                      if (row.Type_Id == 4) {

                          ch_task_status = row.Task_Status_Id;
                          ch_task_duedate = row.DueDate;
                          //    ch_task_worknotes = row.WorkNotes;

                          ch_task_typeId = row.Type_Id;
                          ch_task_id_assess = row.Change_Task_Id;
                          extChangeTaskId_assess = row.External_Task_Id;

                          //Populate assessement status, duedate fields on cr assessment tab from ct
                          populateAssessmentDetails();

                          //show assessment comments in grid
                          getAssessComments();

                          //show implementation comments in grid
                          getImplComments();

                          //show details comments in grid
                          getDetailComments();
                      }

                      if (row.Type_Id == 8) {
                          t_assignedto = row.Assigned_To;
                          t_ch_task_status = row.Task_Status_Id;
                          t_ch_task_duedate = row.DueDate;
                          t_ch_task_completedate = row.CompleteDate;
                          t_technotes = row.LongDesc;
                          t_ch_task_typeId = row.Type_Id;
                          t_ch_task_id_assess = row.Change_Task_Id;
                          t_extChangeTaskId_assess = row.External_Task_Id;

                          //Populate tech assess status, due date, and complete date fields from ct to cr ui
                          populateTechAssessDetails();
                      }
                      return data
                  },
                  targets: [11]
              }
            ]
    });
}

/*Get "all" my change tasks */
function getMyChangeTasks() {
    tblMyTasks = $("#tblMyTasks").DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        // responsive: true,
        destroy: true,
        order: [1],
        ajax: "api/data/GetAllTasks?Type=4",
        columns: [
              { data: "Change_Task_Id", "title": "Task Id_Real", "visible": false }
            , { data: "Change_Record_Id", "title": "Change#", "width": "150px" }
            , { data: "External_Task_Id", "title": "Task Id" }
            , { data: "LongDesc", "title": "Description" }
            , { data: "TypeDescription", "title": "Type" }
            , { data: "CreateDate", "title": "Created" }
            , { data: "DueDate", "title": "Due" }
            , { data: "Type_Id", "title": "Type ", "visible": false }
            , { data: "Business_Priority", "title": "Business Priority" }
            ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a id="record_id" onclick="populateRecord(' + data + ');"  >' + data + '</a>';
                },
                targets: [1]
            },
            {
                render: function (data, type, row) {

                    if (row.Type_Id != 4)
                        return '<a id="taskid_' + data + '" onclick="getTaskDetails2( ' + row.Change_Task_Id + ',' + row.Change_Record_Id + ',' + row.Type_Id + ')" >' + data + '</a>';
                    else
                        return '<a id="taskid_' + data + '" onclick="goToAssessment( ' + row.Change_Record_Id + ')" >' + data + '</a>';
                },
                targets: [2]
            },
            {
                render: function (data, type, row) {
                    var selectDate = new Date(data);
                    selectDate = ((selectDate.getMonth() + 1) + '/' + selectDate.getDate() + '/' + selectDate.getFullYear());
                    if (selectDate === "12/31/1969")
                        selectDate = ""
                    else
                        selectDate = selectDate;
                    return selectDate;
                },
                targets: [5, 6]
            },
            ]
    });
}

/*Get "all" change tasks for all change records from change tasks tab*/
function getAllChangeTasks() {
    tblAllTasks = $("#tblAllTasks").DataTable({
        info: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        //pageLength: 10,
        processing: true,
        //responsive: true,
        destroy: true,
        order: [],
        ajax: "api/data/GetAllTasks?Type=1",
        columns: [
              { data: "Change_Record_Id", "title": "Change#", "visible": true, "width": "150px" }
            , { data: "Change_Task_Id", "title": "Task Id", "visible": false }
            , { data: "External_Task_Id", "title": "Task Id", "visible": true }
            , { data: "LongDesc", "title": "Description" }
            , { data: "TypeDescription", "title": "Type" }
            , { data: "CreateDate", "title": "Created" }
            , { data: "DueDate", "title": "Due" }
            , { data: "Task_Status_Desc", "title": "Status" }
            , { data: "AssignedToTask", "title": "Assigned To" }
            , { data: "Type_Id", "title": "Type", "visible": false }
            ],
        columnDefs: [
            {
                render: function (data, type, row) {
                    return '<a id="record_id" onclick="populateRecord(' + data + ');"  >' + data + '</a>';
                },
                targets: [0]
            },
            {
                render: function (data, type, row) {

                    if (row.Type_Id != 4)
                        return '<a  id="" onclick="getTaskDetails1( ' + row.Change_Task_Id + ',' + row.Change_Record_Id + ',' + row.Type_Id + ')" >' + data + '</a>';
                    else
                        return '<a  id="" onclick="goToAssessment( ' + row.Change_Record_Id + ')" >' + data + '</a>';
                },
                targets: [2]
            },
            {
                render: function (data, type, row) {
                    var selectDate = new Date(data);
                    selectDate = ((selectDate.getMonth() + 1) + '/' + selectDate.getDate() + '/' + selectDate.getFullYear());

                    if (selectDate === "12/31/1969")
                        selectDate = ""
                    else
                        selectDate = selectDate;
                    return selectDate;
                },
                targets: [5, 6]
            },
            ],
        drawCallback: function (settings) {
        }
    });
}

function deleteTask(changed_task_id) {
    bootbox.confirm({
        title: "Delete Change Task?",
        message: "Are you sure you want to delete this Change Task? This cannot be undone.",
        className: "center-modal-header",
        buttons: {
            cancel: {
                label: 'Cancel'
            },
            confirm: {
                label: 'Confirm'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: 'api/data/DeactivateChangeTask?change_task_id=' + changed_task_id,
                    method: 'put'
                }).done(function () {

                    //Refresh all change task tables
                    getChangeTasks();
                    getMyChangeTasks();
                    getAllChangeTasks();

                    $('#success').html("The Change Task was deleted.").fadeIn(1000);
                    setTimeout(function () {
                        $('#success').fadeOut();
                    }, 3000);

                }).fail(function () {
                    $('#error').html("Failed to delete change task.").fadeIn(1000);
                    setTimeout(function () {
                        $("#error").fadeOut();
                    }, 5000);
                });
            }
        }
    });
}

/*Get change task "details" for each change record from Related Tab*/
function getTaskDetails(taskid, taskTypeId) {

    //Switch label to Bundle Number for AXIS tasks 
    if (taskTypeId == 5) {
        $('#lblTitle').text("*Bundle Number");
    }
    else {
        $('#lblTitle').text("*Title");
    }

    var taskType_Id = taskTypeId;
    task_id = taskid;
    $.ajax({
        url: 'api/data/GetTaskForChangeId?changeid=' + id + '&taskid=' + task_id
    })
    .done(function (data) {
        //Add change record number to task modal title
        var title = "Change Task " + data.External_Task_Id + " of Change Record #" + id;
        $(".modal-header #myModalLabel").text(title);

        //populate all the fields
        $('#changeTaskId').val(data.Change_Task_Id);
        $('#extChangeTaskId').val(data.External_Task_Id);
        $('#longdesc').val(data.LongDesc);
        $('#taskassignedto').val(data.Assigned_To);
        $('#taskstate').val(data.Task_State_Id);
        formatDate(data.CreateDate, $('#taskcrdate'));
        $('#taskcrby').val(data.CreatedBy);
        formatDate(data.EditDate, $('#lasteditdate'));
        $('#lasteditby').val(data.LastEditUser);
        $('#tasktype').val(data.Type_Id);
        $('#taskStatus').val(data.Task_Status_Id);
        // $('#tasknotes').val(data.WorkNotes);
        $('#devType').val(data.Dev_Type_Id);
        $('#devCategory').val(data.Dev_Category_Id);
        $('#devStage').val(data.Dev_Stage_Id);
        $('#devDescription').val(data.Dev_Description);
        $('#activityDescr').val(data.Activity_Descr);
        $('#qId').val(data.Quote_Id);
        $('#qInvoice').val(data.Invoice_No);
        var amount = data.Amount;
        if (amount == 0) {
            $('#qAmount').val("");
        } else {
            $('#qAmount').val(amount);
        }

        var glaccount = data.GL_Account;
        if (glaccount == 0) {
            $('#glAccount').val("");
        } else {
            $('#glAccount').val(glaccount);
        }
        formatDate(data.Quote_Requested, $('#qRequested'));
        formatDate(data.Quote_Received, $('#qReceived'));
        formatDate(data.Quote_Approved, $('#qApproved'));
        formatDate(data.Software_Delivered, $('#sDelivered'));
        formatDate(data.Software_Implemented, $('#sImplemented'));
        $('#qAnnMaintFee').val(data.AnnMaintFee);
        formatDate(data.AnnFeeDueDate, $('#qAnnFeeDueDate'));
        $('#ax_types').val(data.AXIS_Type_Id);
        $('#ax_status').val(data.AXIS_Status_Id);
        $('#txtCampanaDescr').text(data.Campana_Descr);
        $('#txtUserDescr').text(data.User_Descr);
        $('#owner').val(data.Axis_Owner_Id);
        formatDate(data.Loaded_To_Test, $('#ltt_date'));
        formatDate(data.Loaded_To_Train, $('#lttr_date'));
        $('#trainby').val(data.Loaded_To_TrainBy);
        if (data.Emergency_Load == 1)
            $('#ckELR').prop("checked", "checked");
        $('#txtEMRReason').val(data.Emergency_Load_Reason);
        formatDate(data.Loaded_To_Prod, $('#ltp_date'));
        $('#selprodby').val(data.Loaded_To_ProdBy);
        if (data.Obsolete == 1)
            $('#ckObsolete').prop("checked", "checked");
        $('#txtObsReason').val(data.Obsolete_Reason);
        $('#ticketNum').val(data.TicketNum);

        if (data.DueDate != null) {
            formatDate(data.DueDate, $('#duedate'));
        }
        else
            $('#duedate').val('');

        if (data.CompleteDate != null) {
            formatDate(data.CompleteDate, $('#completeddate'));
        }
        else
            $('#completeddate').val('');

        if (data.Task_Start_Date != null) {
            formatDate(data.Task_Start_Date, $('#task_startdate'));
        }
        else
            $('#task_startdate').val('');

        if (data.FullReleaseRequired == 1)
            $('#ckVendorRelease').prop("checked", "checked");

        if (data.Declined_Date != null) {
            formatDate(data.Declined_Date, $('#declinedDate'));
        }
        else
            $('#declinedDate').val('');

        //End populate all the fields

        //Show the development fields on task load
        if ($('#tasktype').val() == 1)
            $('#divDevFields').show();
        else
            $('#divDevFields').hide();

        //Show the activity fields on task load
        if ($('#tasktype').val() == 3)
            $('#divActivity').show();
        else
            $('#divActivity').hide();

        //Show the vendor quote fields on task load
        if ($('#tasktype').val() == 2)
            $('#divQuoteFields').show();
        else
            $('#divQuoteFields').hide();

        //Show the axis bundle fields on task load
        if ($('#tasktype').val() == 5)
            $('#divAxisBundle').show();
        else
            $('#divAxisBundle').hide();

        //Adjust modal size 
        $('#myModal .modal-dialog').addClass("modalSize");

        //Stop modal window from closing
        $('#myModal').modal({
            backdrop: "static"
        });

        //Clear out modal after its closed
        $('.modal').on('hidden.bs.modal', function () {
            $(this).find("input,textarea,select")
                        .val('')
                        .end()
                        .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end();
        });

        getTaskComments(id, task_id);

    })
    .fail(function (xhr, textStatus, errorThrown) {
        $('#taskinsertsuccess').hide();
        $('#taskupdatesuccess').hide();
        $('#taskupdatefail').hide();
        $('#taskinsertfail').hide();
        $('#taskselectfail').fadeIn(1000);

        setTimeout(function () {
            $("#taskselectfail").fadeOut();
        }, 5000);
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });
}

/*Get change task "details" for each change record from Change tasks tab*/
function getTaskDetails1(taskid, ch_rec_id, taskTypeId) {

    //Switch label to Bundle Number for AXIS tasks 
    if (taskTypeId == 5) {
        $('#lblTitle').text("*Bundle Number");
    }
    else {
        $('#lblTitle').text("*Title");
    }

    var taskType_Id = taskTypeId;
    task_id = taskid
    id = ch_rec_id;
    $.ajax({
        url: 'api/data/GetTaskForChangeId?changeid=' + id + '&taskid=' + task_id
    })
    .done(function (data) {
        //Add change record number to task modal title
        var title = "Change Task " + data.External_Task_Id + " of Change Record #" + id;
        $(".modal-header #myModalLabel").text(title);
        $('#extChangeTaskId').val(data.External_Task_Id);
        $('#changeTaskId').val(data.Change_Task_Id);
        $('#longdesc').val(data.LongDesc);
        $('#taskassignedto').val(data.Assigned_To);
        $('#taskstate').val(data.Task_State_Id);
        formatDate(data.CreateDate, $('#taskcrdate'));
        $('#taskcrby').val(data.CreatedBy);
        $('#duedate').val(data.DueDate);
        formatDate(data.EditDate, $('#lasteditdate'));
        $('#lasteditby').val(data.LastEditUser);
        $('#tasktype').val(data.Type_Id);
        $('#taskStatus').val(data.Task_Status_Id);
        //   $('#tasknotes').val(data.WorkNotes);
        $('#devType').val(data.Dev_Type_Id);
        $('#devCategory').val(data.Dev_Category_Id);
        $('#devStage').val(data.Dev_Stage_Id);
        $('#devDescription').val(data.Activity_Descr);
        $('#qId').val(data.Quote_Id);
        $('#qInvoice').val(data.Invoice_No);
        var amount = data.Amount;
        if (amount == 0) {
            $('#qAmount').val("");
        } else {
            $('#qAmount').val(amount);
        }
        var glaccount = data.GL_Account;
        if (glaccount == 0) {
            $('#glAccount').val("");
        } else {
            $('#glAccount').val(glaccount);
        }
        formatDate(data.Quote_Requested, $('#qRequested'));
        formatDate(data.Quote_Received, $('#qReceived'));
        formatDate(data.Quote_Approved, $('#qApproved'));
        formatDate(data.Software_Delivered, $('#sDelivered'));
        formatDate(data.Software_Implemented, $('#sImplemented'));
        $('#qAnnMaintFee').val(data.AnnMaintFee);
        formatDate(data.AnnFeeDueDate, $('#qAnnFeeDueDate'));
        $('#ax_types').val(data.AXIS_Type_Id);
        $('#ax_status').val(data.AXIS_Status_Id);
        $('#txtCampanaDescr').text(data.Campana_Descr);
        $('#txtUserDescr').text(data.User_Descr);
        $('#owner').val(data.Axis_Owner_Id);
        formatDate(data.Loaded_To_Test, $('#ltt_date'));
        formatDate(data.Loaded_To_Train, $('#lttr_date'));
        $('#trainby').val(data.Loaded_To_TrainBy);
        if (data.Emergency_Load == 1)
            $('#ckELR').prop("checked", "checked");
        $('#txtEMRReason').val(data.Emergency_Load_Reason);

        formatDate(data.Loaded_To_Prod, $('#ltp_date'));
        $('#selprodby').val(data.Loaded_To_ProdBy);
        if (data.Obsolete == 1)
            $('#ckObsolete').prop("checked", "checked");
        $('#txtObsReason').val(data.Obsolete_Reason);
        $('#ticketNum').val(data.TicketNum);

        if (data.FullReleaseRequired == 1)
            $('#ckVendorRelease').prop("checked", "checked");
        if (data.DueDate != null) {
            formatDate(data.DueDate, $('#duedate'));
        }
        else
            $('#duedate').val('');

        if (data.CompleteDate != null) {
            formatDate(data.CompleteDate, $('#completeddate'));
        }
        else
            $('#completeddate').val('');

        if (data.Task_Start_Date != null) {
            formatDate(data.Task_Start_Date, $('#task_startdate'));
        }
        else
            $('#task_startdate').val('');

        if (data.Declined_Date != null) {
            formatDate(data.Declined_Date, $('#declinedDate'));
        }
        else
            $('#declinedDate').val('');

        //Show the development fields on task load
        if ($('#tasktype').val() == 1)
            $('#divDevFields').show();
        else
            $('#divDevFields').hide();

        //Show the vendor quote fields on task load
        if ($('#tasktype').val() == 2)
            $('#divQuoteFields').show();
        else
            $('#divQuoteFields').hide();

         //Show the activity fields on task load
        if ($('#tasktype').val() == 3)
            $('#divActivity').show();
        else
            $('#divActivity').hide();

        //Show the axis bundle fields on task load
        if ($('#tasktype').val() == 5)
            $('#divAxisBundle').show();
        else
            $('#divAxisBundle').hide();

        //Adjust modal size 
        $('#myModal .modal-dialog').addClass("modalSize");

        //Stop modal window from closing
        $('#myModal').modal({
            backdrop: "static"
        });
        //Clear out modal after its closed
        $('.modal').on('hidden.bs.modal', function () {
            $(this).find("input,textarea,select")
                        .val('')
                        .end()
                        .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end();
        });
        getTaskComments(id, task_id);
       
    })
    .fail(function (xhr, textStatus, errorThrown) {
        $('#taskinsertsuccess').hide();
        $('#taskupdatesuccess').hide();
        $('#taskupdatefail').hide();
        $('#taskinsertfail').hide();
        $('#taskselectfail').fadeIn(1000);

        setTimeout(function () {
            $("#taskselectfail").fadeOut();
        }, 5000);
    });
}

/*Get change task "details" for each task id in My Tasks tab*/
function getTaskDetails2(taskid, ch_rec_id, taskTypeId) {

    //Switch label to Bundle Number for AXIS tasks 
    if (taskTypeId == 5) {
        $('#lblTitle').text("*Bundle Number");
    }
    else {
        $('#lblTitle').text("*Title");
    }

    var taskType_Id = taskTypeId;
    task_id = taskid
    id = ch_rec_id;
    $.ajax({
        url: 'api/data/GetTaskForChangeId?changeid=' + id + '&taskid=' + task_id
    })
    .done(function (data) {

        if (data.Change_Task_Id != 0) {
            //Add change record number to task modal title
            var title = "Change Task " + data.External_Task_Id + " of Change Record #" + id;
            $(".modal-header #myModalLabel").text(title);
        }
        else {
            title = "! This Change Task has been Deleted";
            $(".modal-header #myModalLabel").text(title).addClass("alert alert-danger text-center").fadeIn(1000);
            setTimeout(function () {
                $(".modal-header #myModalLabel").fadeOut();
                $('#myModal').modal('hide');
                return false;
            }, 5000);
        }

        $('#extChangeTaskId').val(data.External_Task_Id);
        $('#changeTaskId').val(data.Change_Task_Id);
        $('#longdesc').val(data.LongDesc);
        $('#taskassignedto').val(data.Assigned_To);
        $('#taskstate').val(data.Task_State_Id);
        formatDate(data.CreateDate, $('#taskcrdate'));
        $('#taskcrby').val(data.CreatedBy);
        $('#duedate').val(data.DueDate);
        formatDate(data.EditDate, $('#lasteditdate'));
        $('#lasteditby').val(data.LastEditUser);
        $('#tasktype').val(data.Type_Id);
        $('#taskStatus').val(data.Task_Status_Id);
        //    $('#tasknotes').val(data.WorkNotes);
        $('#devType').val(data.Dev_Type_Id);
        $('#devCategory').val(data.Dev_Category_Id);
        $('#devStage').val(data.Dev_Stage_Id);
        $('#devDescription').val(data.Dev_Description);
        $('#activityDescr').val(data.Activity_Descr);
        $('#qId').val(data.Quote_Id);
        $('#qInvoice').val(data.Invoice_No);
        var amount = data.Amount;
        if (amount == 0) {
            $('#qAmount').val("");
        } else {
            $('#qAmount').val(amount);
        }
        var glaccount = data.GL_Account;
        if (glaccount == 0) {
            $('#glAccount').val("");
        } else {
            $('#glAccount').val(glaccount);
        }
        formatDate(data.Quote_Requested, $('#qRequested'));
        formatDate(data.Quote_Received, $('#qReceived'));
        formatDate(data.Quote_Approved, $('#qApproved'));
        formatDate(data.Software_Delivered, $('#sDelivered'));
        formatDate(data.Software_Implemented, $('#sImplemented'));
        $('#qAnnMaintFee').val(data.AnnMaintFee);
        formatDate(data.AnnFeeDueDate, $('#qAnnFeeDueDate'));
        $('#ax_types').val(data.AXIS_Type_Id);
        $('#ax_status').val(data.AXIS_Status_Id);
        $('#txtCampanaDescr').text(data.Campana_Descr);
        $('#txtUserDescr').text(data.User_Descr);
        $('#owner').val(data.Axis_Owner_Id);
        formatDate(data.Loaded_To_Test, $('#ltt_date'));
        formatDate(data.Loaded_To_Train, $('#lttr_date'));
        $('#trainby').val(data.Loaded_To_TrainBy);
        if (data.Emergency_Load == 1)
            $('#ckELR').prop("checked", "checked");
        $('#txtEMRReason').val(data.Emergency_Load_Reason);

        formatDate(data.Loaded_To_Prod, $('#ltp_date'));
        $('#selprodby').val(data.Loaded_To_ProdBy);
        if (data.Obsolete == 1)
            $('#ckObsolete').prop("checked", "checked");
        $('#txtObsReason').val(data.Obsolete_Reason);
        $('#ticketNum').val(data.TicketNum);

        if (data.FullReleaseRequired == 1)
            $('#ckVendorRelease').prop("checked", "checked");
        if (data.DueDate != null) {
            formatDate(data.DueDate, $('#duedate'));
        }
        else
            $('#duedate').val('');

        if (data.CompleteDate != null) {
            formatDate(data.CompleteDate, $('#completeddate'));
        }
        else
            $('#completeddate').val('');

        if (data.Task_Start_Date != null) {
            formatDate(data.Task_Start_Date, $('#task_startdate'));
        }
        else
            $('#task_startdate').val('');

        if (data.Declined_Date != null) {
            formatDate(data.Declined_Date, $('#declinedDate'));
        }
        else
            $('#declinedDate').val('');

        //Show the development fields on task load
        if ($('#tasktype').val() == 1)
            $('#divDevFields').show();
        else
            $('#divDevFields').hide();

         //Show the activity fields on task load
        if ($('#tasktype').val() == 3)
            $('#divActivity').show();
        else
            $('#divActivity').hide();

        //Show the vendor quote fields on task load
        if ($('#tasktype').val() == 2)
            $('#divQuoteFields').show();
        else
            $('#divQuoteFields').hide();

        //Show the axis bundle fields on task load
        if ($('#tasktype').val() == 5)
            $('#divAxisBundle').show();
        else
            $('#divAxisBundle').hide();

        //Open and Adjust modal size 
        $('#myModal .modal-dialog').addClass("modalSize");

        //Stop modal window from closing
        $('#myModal').modal({
            backdrop: "static"
        });

        //Clear out modal after its closed
        $('.modal').on('hidden.bs.modal', function () {
            $(this).find("input,textarea,select")
                        .val('')
                        .end()
                        .find("input[type=checkbox], input[type=radio]")
                        .prop("checked", "")
                        .end();
        });

        //if this is being called from an email link use different arguments
        if (ch_record_id != null)
        //show all comments associcated with a change task when clicked from email link
            getTaskComments(ch_record_id, ch_task_id)
        else
        //show all comments associcated with a change task when clicked from My tasks
            getTaskComments(id, task_id);
    })
    .fail(function (xhr, textStatus, errorThrown) {
        $('#taskinsertsuccess').hide();
        $('#taskupdatesuccess').hide();
        $('#taskupdatefail').hide();
        $('#taskinsertfail').hide();
        $('#taskselectfail').fadeIn(1000);

        setTimeout(function () {
            $("#taskselectfail").fadeOut();
        }, 5000);
        // console.log("Error: " + xhr.status + ": " + xhr.statusText);
    });
}

/*Get change record history for each change record */
function getChangeRecordHistoryDataTable() {
    tblchangehistory = $('#tblchangehistory').DataTable({
        //  scrollX: true,
        info: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        //  pageLength: 5,
        processing: true,
        responsive: true,
        destroy: true,
        //autoWidth: false,
        order: [[2, 'desc']],
        ajax: "api/data/GetChangeRecordHistoryById?id=" + id,
        columns: [
        //{ data: "Change_Record_Id", "title": "test header"},
                    {data: "Source", "title": "Source" },
                    { data: "Field", "title": "Field" },
                    { data: "ChangeDate", "title": "Change Date" },
                    { data: "Previous", "title": "Previous" },
                    { data: "New", "title": "New" },
                    { data: "ChangedBy", "title": "Changed By" }
        ]
    }); //end datatables
}

/*Get related docs for each change record */
function getRelatedDocs() {
    tblRelatedDocs = $("#tblRelatedDocs").DataTable({
        info: true,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        pagingType: 'full_numbers',
        paging: true,
        lengthChange: true,
        pageLength: 5,
        processing: true,
        responsive: false,
        destroy: true,
        filter: false,
        order: [[4, "desc"]],
        ajax: "api/data/GetDocsAndLinksForChangeId?id=" + id,
        columns: [
              { data: "DocTitle", "title": "Name" }
            , { data: "DocType", "title": "Type" }
            , { data: "Change_Record_Id", "title": "Change Record ID" }
            , { data: "DocLocation", "title": "Location" }
            , { data: "Change_Doc_Id", "title": "Id", "visible": false }
            , { data: null, "title": "Remove", "className": "checkcenter" }
            ]
            ,
        columnDefs: [
            {
                render: function (data, type, row) {

                    doc_location = data;

                    return '<a id="recordid" href="' + data + '" target ="_blank">' + data + '</a>'
                },
                targets: [3]
            },
            {
                render: function (data, type, row) {
                    return "<button  class='btn btn-primary' id='btnRemove_" + data.Change_Doc_Id + "' onclick='RemoveRelatedDoc(" + data.Change_Doc_Id + ")';>Delete</buton>"
                }, targets: [-1]
            }
            ]
    });
}

//On delete button click, delete the related doc
function RemoveRelatedDoc(docid) {
    bootbox.confirm({
        title: "Delete Document/Link ?",
        message: "Are you sure you want to delete this Document/Link ? This cannot be undone.",
        className: "center-modal-header",
        buttons: {
            cancel: {
                label: 'Cancel'
            },
            confirm: {
                label: 'Confirm'
            }
        },
        callback: function (result) {
            if (result) {
                if (docid !== 0) {
                    var properties = new Object();
                    properties.Change_Doc_Id = docid;
                    $.ajax({
                        url: 'api/data/RemoveRelatedDoc',
                        method: 'delete',
                        data: properties
                    }).done(function (data) {
                        getRelatedDocs();
                        $('#errorInsert').hide();
                        $('#errorUpdate').hide();
                        $('#errorSelect').hide();
                        $('#successInsert').hide();
                        if (data === "Document/Link was successfully deleted.") {
                            $('#success').html("Document/Link was successfully deleted.").fadeIn(1000);
                            setTimeout(function () {
                                $("#success").fadeOut();
                            }, 5000);
                        }
                        else {
                            $('#error').html(data).fadeIn(1000);
                            setTimeout(function () {
                                $("#error").fadeOut();
                            }, 2000);
                        }
                    }).fail(function (data) {
                        $('#error').html(data).fadeIn(1000);
                        $('#errorSelect').hide();
                        $('#successInsert').hide();
                        $('#successUpdate').hide();
                        $('#errorInsert').hide();

                        setTimeout(function () {
                            $("#error").fadeOut();
                        }, 5000);
                    });
                }
            }
        }
    });
}

function formatDate(date, selector) {
    if (date != null) {
        var selectedDate = new Date(date);
        var datepart = (selectedDate.getMonth() + 1) + '/' + selectedDate.getDate() + '/' + selectedDate.getFullYear();
        selector.val(datepart);
    } else {
        selector.val("");
    }
}

//This returns date format in mm/dd/yyyy
function formatDate1(data) {
    var selectDate = new Date(data);
    selectDate = ((selectDate.getMonth() + 1) + '/' + selectDate.getDate() + '/' + selectDate.getFullYear());

    //take care of null dates
    if (selectDate === "12/31/1969")
        selectDate = ""
    else
        selectDate = selectDate;
    return selectDate;
}

//This returns date format in mm/dd/yyy/hh/mm/ss
function formatDate2(date) {
    if (date != null) {
        var selectDate = new Date(date);
        selectDate = ((selectDate.getMonth() + 1) + '/' + selectDate.getDate() + '/' + selectDate.getFullYear() +
                   " " + selectDate.getHours() + ":" + selectDate.getMinutes() + ":" + selectDate.getSeconds());
    }
    return selectDate;
}

//This returns date format in mm-dd-yyy hh:mm:ss
function formatDate3(date) {
    if (date != null) {
        var selectDate = new Date(date);
        selectDate = ((selectDate.getMonth() + 1) + '-' + selectDate.getDate() + '-' + selectDate.getFullYear() +
                   "  " + hourFormat(selectDate.getHours()) + ":" + minuteFormat(selectDate.getMinutes()));
    }
    return selectDate;
}

function hourFormat(curr_hour) {
    curr_hour = curr_hour + "";
    if (curr_hour.length == 1) {
        curr_hour = "0" + curr_hour;
    }
    return curr_hour;
}

function minuteFormat(curr_min) {
    curr_min = curr_min + "";
    if (curr_min.length == 1) {
        curr_min = "0" + curr_min;
    }
    return curr_min;
}

function secondFormat(curr_sec) {
    curr_sec = curr_sec + "";
    if (curr_sec.length == 1) {
        curr_sec = "0" + curr_sec;
    }
    return curr_sec
}

function formatTime(datetime, selector) {
    var selectedDate = new Date(datetime);
    var time = selectedDate.toLocaleTimeString().toUpperCase();
    selector.val(time);
}

//Go back to change manager home page
function goToChangeManagerHome() {
    $('#main').show();
    $('#navbuttons').hide();
    $('#requestdetails').hide();

    // $('#btnFilter').hide();
    // $('#btnResetFilter').hide();
    // $('.nav-tabs a[href="#myAssign"]').tab('show');


    //refresh the grids
    showChangeRecords();
    showChangeRequests();
    showMyChangeRecords();
    showMyChangeRequests();
    getMyChangeTasks();
    getAllChangeTasks();
}

//Go to the related tab from open tasks 
function gotoRelated(changerecordid) {
    boolRelated = true;
    populateRecord(changerecordid);
}

//Go to the assessment tab either from mychangetask, changetasks, or related tasks tabs, and from email link
function goToAssessment(changerecordid) {
    boolAssessed = true;
    populateRecord(changerecordid);
}

//Populate title dropdown with project titles
function populateProjectValues() {
    var listitems;
    listitems = '<option value="0">--None--</option>';
    var selectProjectId = $('#selOtherSrc');
    selectProjectId.empty();
    $.ajax({
        url: 'api/data/GetProjectValues',
        method: 'get'
    }).done(function (data) {
        // alert( 'success' );    
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        selectProjectId.append(listitems);
    }).fail(function () {
        alert('fail');
    });
}

//Populate title dropdown with strategic titles
function populateStrategicValues() {
    var listitems;
    listitems = '<option value="0">--None--</option>';
    var selectStrategicId = $('#selOtherSrc2');
    selectStrategicId.empty();
    $.ajax({
        url: 'api/data/GetStrategicValues'
    }).done(function (data) {
        $.each(data, function (key, value) {
            listitems += '<option value=' + key + '>' + value + '</option>';
        });
        selectStrategicId.append(listitems);
    }).fail(function () {
        alert('fail');
    });
}

/*Get assessement comments */
function getAssessComments() {
    var cr_id = id;
    tblAssessComments = $('#tblAssessComments').DataTable({
        // scrollX: true,
        // pagingType: 'full_numbers',
        // autoWidth: false,
        // lengthChange: true,   
        info: true,
        paging: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        processing: true,
        destroy: true,
        searching: true,
        order: [[3, 'desc']],
        ajax: "api/data/GetAssessComments?cr_id=" + cr_id,
        columns: [
    { data: "TypeDescription", title: "Type" },
    { data: "Comments", title: "Comment", width: '250px' },
    { data: "CreatedBy", title: "Created By" },
    { data: "CreatedDate", title: "CreatedDate" },
    { data: "Change_Record_Id", title: "Change Record Id" }
],
        columnDefs: [
        {
            render: function (data, type, row) {
                var formatDate = formatDate2(data);
                return formatDate;
            },
            targets: [3]
        },
        {
            render: function (data, type, row) {
                return type === 'display' && data.length > 50 ?
                    "<a id=''  href='#' onclick='showCommentModal();'>" + data.substr(0, 50) + '…' + "</a>"
                  : "<a id=''  href='#' onclick='showCommentModal();'>" + data + "</a>";
            },
            targets: [1]
        }
    ]
    });             //end datatables
}

/*Get details comments */
function getDetailComments() {
    var cr_id = id;
    var ct_type_id = 6;
    tblDetailComments = $('#tblDetailComments').DataTable({
        info: true,
        paging: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        processing: true,
        destroy: true,
        searching: true,
        order: [[3, 'desc']],
        ajax: "api/data/GetComments2?cr_id=" + cr_id + "&ct_type_id=" + ct_type_id,
        columns: [
    { data: "TypeDescription", title: "Type" },
    { data: "Comments", title: "Comment", width: '250px' },
    { data: "CreatedBy", title: "Created By" },
    { data: "CreatedDate", title: "CreatedDate" },
    { data: "Change_Record_Id", title: "Change Record Id" }
],
        columnDefs: [
        {
            render: function (data, type, row) {
                var formatDate = formatDate2(data);
                return formatDate;
            },
            targets: [3]
        },
         {
             render: function (data, type, row) {
                 return type === 'display' && data.length > 50 ?
                    "<a id=''  href='#' onclick='showCommentModal2();'>" + data.substr(0, 50) + '…' + "</a>"
                  : "<a id=''  href='#' onclick='showCommentModal2();'>" + data + "</a>";
             },
             targets: [1]
         }
    ]
    });      //end datatables
}

/*Get implementation comments */
function getImplComments() {
    var cr_id = id;
    var ct_type_id = 7;
    tblImplComments = $('#tblImplComments').DataTable({
        info: true,
        paging: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        processing: true,
        destroy: true,
        searching: true,
        order: [[3, 'desc']],
        ajax: "api/data/GetComments2?cr_id=" + cr_id + "&ct_type_id=" + ct_type_id,
        columns: [
                    { data: "TypeDescription", title: "Type" },
                    { data: "Comments", title: "Comment", width: '250px' },
                    { data: "CreatedBy", title: "Created By" },
                    { data: "CreatedDate", title: "CreatedDate" },
                    { data: "Change_Record_Id", title: "Change Record Id" }
        ],
        columnDefs: [
                        {
                            render: function (data, type, row) {
                                var formatDate = formatDate2(data);
                                return formatDate;
                            },
                            targets: [3]
                        },
                        {
                            render: function (data, type, row) {
                                return type === 'display' && data.length > 50 ?
                    "<a id=''  href='#' onclick='showCommentModal3();'>" + data.substr(0, 50) + '…' + "</a>"
                  : "<a id=''  href='#' onclick='showCommentModal3();'>" + data + "</a>";
                            },
                            targets: [1]
                        }
                    ]
    });      //end datatables
}

/*Get all comments (comments tab) for a single change record */
function getAllComments() {
    var cr_id = id;
    tblComments = $('#tblComments').DataTable({
        // scrollX: true,
        // pagingType: 'full_numbers',
        // lengthChange: true,
        // autoWidth: false,
        // order: [[2, 'desc']],
        info: true,
        paging: true,
        pageLength: 25,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        processing: true,
        destroy: true,
        searching: true,
        order: [[3, 'desc']],
        ajax: "api/data/GetAllComments?cr_id=" + cr_id,
        columns: [
    { data: "TypeDescription", title: "Type" },
    { data: "Comments", title: "Comment", width: '250px' },
    { data: "CreatedBy", title: "Created By" },
    { data: "CreatedDate", title: "CreatedDate" },
    { data: "Change_Record_Id", title: "Change Record Id", visible: false },
    { data: "ExternalTaskId", title: "Change Task Id" },
    { data: "Change_Task_Id", title: "Change Task Id", visible: false },
    { data: "Type_Id", title: "Type Id", visible: false }

],
        columnDefs: [
        {
            render: function (data, type, row) {
                var formatDate = formatDate2(data);
                return formatDate;
            },
            targets: [3]
        },
        {
            render: function (data, type, row) {
                if (data == 0)
                    return '';
                else
                    return '<a id="taskid_' + data + '" onclick="getTaskDetails1(' + row.Change_Task_Id + "," + row.Change_Record_Id + "," + row.Type_Id + ')" >' + data + '</a>';
            },
            targets: [5]
        },

         {
             render: function (data, type, row) {
                 return type === 'display' && data.length > 50 ?
                    "<a id=''  href='#' onclick='showCommentModal4();'>" + data.substr(0, 50) + '…' + "</a>"
                  : "<a id=''  href='#' onclick='showCommentModal4();'>" + data + "</a>";
             },
             targets: [1]
         }
    ]
    });             //end datatables
}

/*Get change task comments */
function getTaskComments(recordId, tsk_id) {
    var taskComment = {};
    var cr_id = recordId;
    // var ct_type_id = taskTypeId;
    var ct_task_id = tsk_id;

    taskid = task_id;
    tblTaskComments = $('#tblTaskComments').DataTable({
        // scrollX: true,
        // autoWidth: true,
        pagingType: 'simple',
        order: [[3, 'desc']],
        lengthChange: false,
        info: false,
        paging: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 15, 20, -1], [5, 10, 15, 20, "All"]],
        processing: true,
        destroy: true,
        searching: false,
        ajax: "api/data/GetComments?cr_id=" + cr_id + "&ct_task_id=" + ct_task_id,
        columns: [
                    { data: "TypeDescription", title: "Type" },
                    { data: "Comments", title: "Comment", width: '250px' },
                    { data: "CreatedBy", title: "Created By" },
                    { data: "CreatedDate", title: "CreatedDate" },
                    { data: "ExternalTaskId", title: "Task Id" }
        //  { data: "Change_Record_Id", title: "Change Record Id" },                      
        //  { data: "Change_Task_Id", title: "Change Task Id", visible: false }
        ],
        columnDefs: [
        {
            render: function (data, type, row) {
                var formatDate = formatDate2(data);
                return formatDate;
            },
            targets: [3]
        },
        {
            render: function (data, type, row) {
                return type === 'display' && data.length > 50 ?
                                "  <a id=''  href='#' onclick='showCommentModal5();'>" + data.substr(0, 50) + '…' + "</a>"
                                : "<a id=''  href='#' onclick='showCommentModal5();'>" + data + "</a>";
            },
            targets: [1]
        }
        ]
    });
}

function ShowMessage(type, msg) {
    if (type == "success") {
        $('#success').html("<strong>" + msg + "</strong>").fadeIn(1000);
        setTimeout(function () {
            $('#success').fadeOut();
        }, 3000);
    }
    else if (type == "error") {
        $('#error').html("<strong>" + msg + "</strong>").fadeIn(1000);
        setTimeout(function () {
            $("#error").fadeOut();
        }, 5000);
    } else if (type == "error_status") {
        $('#error_status').html("<strong>" + msg + "</strong>").fadeIn(1000);
        setTimeout(function () {
            $("#error_status").fadeOut();
        }, 5000);
    } else if (type == "task_error") {
        $('#task_error').html("<strong>" + msg + "</strong>").fadeIn(1000);
        setTimeout(function () {
            $("#task_error").fadeOut();
        }, 5000);
    } else if (type == "task_success") {
        $('#task_success').html("<strong>" + msg + "</strong>").fadeIn(1000);
        setTimeout(function () {
            $("#task_success").fadeOut();
        }, 3000);
    }
}


function getAxisReport() {
    tblAxisRpt = $('#tblAxisRpt').DataTable({
        //cache: false,
        info: true,
        lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        pagingType: 'full_numbers',
        paging: false,
        lengthChange: true,
        pageLength: 10,
        processing: true,
        destroy: true,
        order: [[3, "asc"], [4, "asc"]],
        ajax: {
            url: "api/data/Get_AXIS_Bundle_Rpts",
            data: ''
        },
        columns: [
                   { data: "Long_Desc", title: "Bundle #" },
                   { data: "User_Descr", title: "Description" },
                   { data: "Last_First", title: "Assigned To" },
                   { data: "Change_Record_Id", title: "Change Record" },
                   { data: "ExternalTaskId", title: "Change Task" },
                   { data: "Change_Task_Id", title: "Change Task", "visible": false },
                   { data: "Type_Id", "title": "Type", "visible": false },
                   { data: "L_to_Test", title: "Load to Test" },
                   { data: "L_to_Train", title: "Load to Train" },
                   { data: "L_to_Prod", title: "Load to Prod" },
                   { data: "AXIS_Status_Descr", title: "Status" },
                   { data: "Obsolete", title: "Obsolete" }
                ],
        columnDefs: [
                    {
                        render: function (data, type, row) {
                            var thenum = data.replace(/\D/g, '');
                            return thenum;
                        },
                        targets: [0]
                    }
                    ,
                    {
                        render: function (data, type, row) {
                            return '<a  id="record_id" onclick="populateRecord(' + data + ');" href="#" >' + data + '</a>'
                        },
                        targets: [3]
                    }
                    ,
                        {
                            render: function (data, type, row) {
                                return '<a  id="" onclick="getTaskDetails1( ' + row.Change_Task_Id + ',' + row.Change_Record_Id + ',' + row.Type_Id + ')" >' + data + '</a>';

                            },
                            targets: [4]
                        },
                    {
                        render: function (data, type, row) {
                            return formatDate1(data);
                        },
                        targets: [7, 8, 9]
                    },
                     {
                         render: function (data, type, row) {
                             if (data == true)
                                 return "Yes";
                             else
                                 return "No";
                         },
                         targets: [11]
                     } 
                   ],
                   drawCallback: function(){
//                       $.fn.dataTableExt.afnFiltering.push(
//	                        function( oSettings, aData, iDataIndex ) {		                    
//		                        var statusVal = aData[10] === "Closed" ? false : true;  
//                                return statusVal;              
//	                        }
//                           );
                   }
    });           
}