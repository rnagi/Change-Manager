using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections;


namespace ChangeManagement.Models
{
    public class SecuritySelectParams
    {
        public string type { get; set; }
        public string application_name { get; set; }
        public string level { get; set; }
    }

    public class UserSecurityRecord
    {
        public int applicationsecid { get; set; }
        public string employeeid { get; set; }
        public string application_name { get; set; }
        public bool AllowView { get; set; }
        public bool AllowAdd { get; set; }
        public bool AllowUpdate { get; set; }
        public bool AllowDelete { get; set; }
        public bool IsAdmin { get; set; }
        public string username { get; set; }
        public string ApplicationButtonName { get; set; }
    }

    public class ChangeRecordDetail
    {
        //ChangeRecord table columns
        public Int64 Change_Record_Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreateDate { get; set; }
        public string LastEditBy { get; set; }
        public DateTime LastEditDate { get; set; }
        public bool Deleted { get; set; }
        public bool Closed { get; set; }
        public string Change_Short_Desc { get; set; }     
        public Int64? Requested_By_Id { get; set; }
        public DateTime? Bus_Implementation_Deadline { get; set; }
        public Int32? Bus_Line_Approver_Id { get; set; }
     //   public Int32? Bus_Line_Contact_Id { get; set; }
        public Int32? Business_Priority_Id { get; set; }
        public Int32? Business_Impact_Id { get; set; }
        public string Business_Impact_Description { get; set; }
        public string Bus_NonImplement_Effects { get; set; }
        public string Business_Case { get; set; }
        public Int32? Assigned_To_Id { get; set; }
        public Int64? Service_Owner_Id { get; set; }
        public Int32? Change_Impact_Id { get; set; }
        public Int32? Change_Risk_Id { get; set; }
        public Int32? Change_Priority_Id { get; set; }
        public Int32? Category_Id { get; set; }
        public Int32? Change_Status_Id { get; set; }
        public Int32? Change_Type_Id { get; set; } 
        public string SourceType { get; set; }
        public string SourceVal { get; set; }
        public string OtherSourceType { get; set; }
        public string OtherSourceVal { get; set; }
        public DateTime? Source_Original_Date { get; set; }
        public string Change_Long_Desc { get; set; }
        public string Change_NonImplement_Effect { get; set; }
        public string Comments { get; set; }
        public string Technical_Assessment { get; set; }
        public string TestPlan { get; set; }
        public string ChangePlan { get; set; }
        public string BackoutPlan { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        public DateTime? WorkStartDate { get; set; }
        public DateTime? WorkEndDate { get; set; }
        public Int64? Change_Completed_By { get; set; }
        public DateTime? Change_Completed_Date { get; set; }
        public DateTime? Change_Start_Date { get; set; }
        public Int32 Ch_Task_State_Id { get; set; }
        public DateTime? Request_By_Date { get; set; }
        public Int32 TotalTasks { get; set; }
        public string Resources {get ; set; }
        public Int32 PostReviewCompletedBy_Id { get; set; }
        public DateTime? PostReviewCompletedDate { get; set; }
        public int AssessmentBy_Id { get; set; }
        public DateTime? AssessmentBy_Date { get; set; }
        //Used to populate main datatable with text values
        public string Change_Num { get; set; }
        public string RequestedByName { get; set; }
        public string AssignedTo { get; set; } 
        public string Category { get; set; }
        //public string State { get; set; }
        public string Priority { get; set; }    
        public string Impact { get; set; }      
        public string Status { get; set; }       
        public string Type { get; set; }        
        public string Risk { get; set; }
        public string Change_Desc { get; set; }
       // public string Stage { get; set; }
        public string Business_Approver { get; set; }
       // public string Business_Contact { get; set; }
        public string Business_Priority { get; set; }
        public string Business_Impact { get; set; }      
        public string Completed_By { get; set; }
        public string Service_Owner { get; set; }
      //  public string Change_Stage_Id { get; set; }
        public string PostReviewCompletedBy { get; set; }
        public Int32 Bus_Line_Id { get; set; }
        public string RejectReason { get; set; }
        public string Approval_By { get; set; }
        public DateTime? Approval_Date { get; set; }
        public Int64 Reject_Reason_Id { get; set; }
        public string Change_Bus_Descr { get; set; }
        public int Comment_Type { get; set; }

    }

    public class ChangeRecordHistory
    {
        //ChangeRecord table columns
        public Int32 Change_Record_Id { get; set; }
        public string Source { get; set; }
        public string Field { get; set; }
        public string ChangedBy { get; set; }
        public string ChangeDate { get; set; }
        public string Previous { get; set; }
        public string New { get; set; }
    }

    public class ChangeTask
    {
        public Int64 Change_Task_Id { get; set; }
        public Int64 Change_Record_Id { get; set; }
        public Int32 External_Task_Id { get; set; }
        public Int32 ConfigItem_Id { get; set; }
        public Int16 Priority_Id { get; set; }
        public string TaskPriorityDesc { get; set; }
        public Int32 Task_State_Id { get; set; }
        public string StateDesc { get; set; }
        public string ShortDesc { get; set; }
        public string LongDesc { get; set; }
        public string WorkNotes { get; set; }
        public Int32 Assigned_To { get; set; }
        public string AssignedToTask { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Deleted { get; set; }
        public DateTime? CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? EditDate { get; set; }
        public string LastEditUser { get; set; }
        public DateTime? CompleteDate { get; set; }
        public DateTime? Task_Start_Date { get; set; }
        public Int32 Type_Id { get; set; }
        public string TypeDescription { get; set; }
        public Int32 Task_Status_Id { get; set; }
        public string Task_Status_Desc { get; set; }
       
        //Development Task fields in a separate table 
        public Int32 Dev_Task_Id { get; set; }
        public string Dev_Description { get; set; }
        public Int32 Dev_Type_Id { get; set; }
        public Int32 Dev_Category_Id { get; set; }
        public Int32 Dev_Stage_Id { get; set; }

        //Acitvity Task fields in a separate table 
        public Int32 Activity_Task_Id { get; set; }
        public string Activity_Descr { get; set; }

       
        //Vendor Quote fields in a separate table
        public Int64 Seq_Id { get; set; }
        public string Quote_Id { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? Quote_Received { get; set; }
        public DateTime? Quote_Requested { get; set; }
        public DateTime? Quote_Approved { get; set; }
        public DateTime? Software_Delivered {get; set;}
        public DateTime? Software_Implemented { get; set; }
        public string Invoice_No { get; set; }
        public string GL_Account { get; set; }
        public bool FullReleaseRequired { get; set; }
        public DateTime? Declined_Date { get; set; }
        public decimal? AnnMaintFee { get; set; }
        public DateTime? AnnFeeDueDate { get; set; }

        //AXIS Bundle fields in a separate table
        public Int64 AXIS_Bundle_Id { get; set; }
        public int AXIS_Type_Id { get; set; }
        public int AXIS_Status_Id { get; set; }
        public string Campana_Descr { get; set; }
        public string User_Descr { get; set; }
        public int Axis_Owner_Id { get; set; }
        public DateTime? Loaded_To_Test { get; set; }
        public DateTime? Loaded_To_Train { get; set; }
        public int Loaded_To_TrainBy { get; set; }
        public Boolean Emergency_Load { get; set; }
        public string Emergency_Load_Reason { get; set; }
        public DateTime? Loaded_To_Prod { get; set; }
        public int Loaded_To_ProdBy { get; set; }
        public Boolean Obsolete { get; set; }
        public string Obsolete_Reason { get; set; }
        public string TicketNum { get; set; }


        //Business Priority from the Change Record
        public string Business_Priority{ get; set; }
 
    }

    public class ChangeDocRecord
    {
        public Int32 Change_Doc_Id { get; set; }
        public Int32 Change_Record_Id { get; set; }
        public string DocTitle { get; set; }
        public string DocType { get; set; }
        public string DocLocation { get; set; }
        public DateTime CreateDate { get; set; }
       
    }

    public class Employees
    {
        public int Id { get; set; }
        public string LastFirst { get; set; }
    }

    public class ChangeRecordEmail
    {
        public string employeeId { set; get; }
        public string email { set; get; }
        public string changeRecordId { set; get; }
        public string changeTaskId { set; get; }
        public string changeExternalTaskId { get; set; }
        public string serverName { get; set; }
        public int changeTask_Type_Id { get; set; }     
        public int taskStatus1 {get; set;}
        public DateTime duedate1  {get; set;}
        public string tasknotes1  {get; set;}
        public string requestedById { get; set; }
    }

    public class FileMessages
    {
        public string fileSavePath { get; set; }
        public string confirmMessage { get; set; }
    }

    public class AssigneeIds
    {
        public int Type { set; get; }
        public Array EmployeeIds { set; get; }

    }

    public class StrategicInitiatives{
        public Int64 Strategic_Id { set; get; }
        public string Strategic_Title { set; get; }
        public string Strategic_CreatedBy { set; get; }
        public string Strategic_FiscalYear { set; get; }
        public string Strategic_Owner { set; get; }
        public bool Strategic_Active { set; get; }
        public string Strategic_Descr { set; get; }
    }

    public class Project
    {
        public Int64 Project_Id { set; get; }
        public string Project_Title { set; get; }
        public string Project_CreatedBy { set; get; }
        public string Project_FiscalYear { set; get; }
        public string Project_Owner { set; get; }
        public bool Project_Completed { set; get; }
        public string Project_Descr { set; get; }
        public DateTime? Project_Start_Date { set; get; }
        public DateTime? Project_End_Date { set; get; }
        public int Project_Status_Id { set; get; }
        public string Project_Status_Descr { set; get; }
        public int Project_Bus_Line_Id { get; set; }
        public string Change_Bus_Descr { get; set; }
    }

    public class ChangeRecordFilter{
        public Int64 Change_Record_Id { get; set; }    
        public Int64 Requested_By_Id { get; set; }  
     //   public List<string> Assigned_To_Id { get; set; }   
        public Int32 Assigned_To_Id { get; set; }
        public Int32 Change_Status_Id { get; set; }
        public Int32 Change_Type_Id { get; set; }
        public Int32 Bus_Line_Id { get; set; }
        public Int32 Business_Priority_Id { get; set; }
        public DateTime BegCreateDate { get; set; }
        public DateTime EndCreateDate { get; set; }
        public DateTime BegDueDate { get; set; }
        public DateTime EndDueDate { get; set; }
    }

    public class Change_Comments
    {
        public Int64 Id { get; set; }
        public string Comments { get; set; }
        public Int32 Type_Id { get; set; }
        public string TypeDescription { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public Int64 Change_Record_Id { get; set; }
        public Int64 Change_Task_Id { get; set; }
        public int ExternalTaskId { get; set; }
    }

    public class Change_Properties
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }

    public class ProjectCR
    {
        public Int64 Project_Id { get; set; }
        public string Project_Title { get; set; }
        public Int64 Change_Record_Id { get; set; }
        public string Change_Short_Desc { get; set; }
    }

    public class StrategicCR
    {
        public Int64 Strategic_Id { get; set; }
        public string Strategic_Title { get; set; }
        public Int64 Change_Record_Id { get; set; }
        public string Change_Short_Desc { get; set; }
    }

}