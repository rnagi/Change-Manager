using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChangeManagement.Models
{
    public class AXIS_Bundle
    {
        public Int64 AXIS_Bundle_Id { get; set; }
        public string User_Descr { get; set; }
        public Int64 Change_Record_Id { get; set; }
        public DateTime? L_to_Test { get; set; }
        public DateTime? L_to_Train { get; set; }
        public DateTime? L_to_Prod { get; set; }
        public string AXIS_Status_Descr { get; set; }
        public string Long_Desc { get; set; }
        public Int32 Assigned_To_Id { get; set; }
        public string Last_First { get; set; }
        public Int64 Change_Task_Id { get; set; }
        public Int32 Type_Id { get; set; }
        public Int64 ExternalTaskId { get; set; }
        public bool Obsolete { get; set; }
    }
}