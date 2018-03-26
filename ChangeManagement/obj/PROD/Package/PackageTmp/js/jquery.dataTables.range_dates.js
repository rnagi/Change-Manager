/**
* Filter a column on a specific date range. Note that you will likely need 
* to change the id's on the inputs and the columns in which the start and 
* end date exist.
*
*  @name Date range filter
*  @summary Filter the table based on two dates in different columns
*  @author _guillimon_
*
*  @example
*    $(document).ready(function() {
*        var table = $('#example').DataTable();
*         
*        // Add event listeners to the two range filtering inputs
*        $('#min').keyup( function() { table.draw(); } );
*        $('#max').keyup( function() { table.draw(); } );
*    } );
*/

//$.fn.dataTableExt.afnFiltering.push(
//	function (oSettings, aData, iDataIndex) {
//	    //filter datatable using values from date inputs
//	    var ltpf = $('#ltpf').val();
//	    var ltpt = $('#ltpt').val();
//	    var dt_ltpf = "";
//	    var dt_ltpt = "";

//	    if (ltpf === "") {
//	        dt_ltpf = "";
//	    }
//	    else {
//	        dt_ltpf = new Date(ltpf);
//	    }

//	    if (ltpt === "") {
//	        dt_ltpt = "";
//	    }
//	    else {
//	        dt_ltpt = new Date(ltpt);
//	        dt_ltpt.getTime();
//	    }

//	    if (oSettings.sTableId === "tblAxisRpt") {

//	        if (dt_ltpf === "" && dt_ltpt === "")
//	            return true;

//	        if (aData[9] !== null && aData[9] !== "") {
//	            dt_Prod = new Date(aData[9]);
//	            time_Prod = dt_Prod.getTime();
//	        } else {
//	            return false;
//	        }

//	        if (dt_ltpf !== "") {
//	            var time_from = dt_ltpf.getTime();
//	            if ((time_from <= time_Prod) && (dt_ltpt === "")) {
//	                return true;
//	            }
//	        }

//	        if (dt_ltpt !== "") {
//	            var time_to = dt_ltpt.getTime();
//	            if ((time_to >= time_Prod) && (dt_ltpf === "")) {
//	                return true;
//	            }
//	        }

//	        if (dt_ltpf !== "" && dt_ltpt !== "") {
//	            var time_from = dt_ltpf.getTime();
//	            var time_to = dt_ltpt.getTime();
//	            if ((time_Prod >= time_from) && (time_Prod <= time_to)) {
//	                return true;
//	            }
//	        }
//	    }
//	}
//);