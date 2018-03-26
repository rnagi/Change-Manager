using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ChangeManagement;

namespace ChangeManagement.Controllers
{
    public class DataTableResult<ChangeRecordDetail>
    {    
        public List<ChangeRecordDetail> data { get; set; }        
    }
}