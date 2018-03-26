using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using Newtonsoft.Json;
using System.Web.Helpers;
using System.Web;
using System.IO;
using System.Net.Mail;
using System.Collections;
using System.Security.Principal;
using System.ServiceModel;
using ChangeManagement.Models;
  


namespace ChangeManagement.Controllers
{
    public class DataController : ApiController
    {
        private string currentUser = System.Environment.UserName;
        private string connectionString;
        private string prodCS;
        private string fileSavePath = "";
        private string filenameCS = "";
        private string filename = "";
        private string csERSDW;
        private string connDM = "";
        private Dictionary<string, string> dictImpact = new Dictionary<string, string>();

        public DataController()
        {
            connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;
            prodCS = ConfigurationManager.ConnectionStrings["PivProdReader"].ConnectionString;
            csERSDW = ConfigurationManager.ConnectionStrings["conERSDW"].ConnectionString;
            connDM = ConfigurationManager.ConnectionStrings["connDM"].ConnectionString;
        }

        #region HTTP GET

        #region Populate Fields

        [HttpGet]
        public Dictionary<int, string> GetRejectReasons()
        {
            Dictionary<int, string> rejectValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "RejectReasons"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string category = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        rejectValues.Add(id, category);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return rejectValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetChangeStateTaskValues()
        {
            Dictionary<int, string> taskValues = new Dictionary<int, string>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Task_State"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string status = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        taskValues.Add(id, status);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return taskValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetCategoryValues()
        {
            Dictionary<int, string> categoryValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Category"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string category = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        categoryValues.Add(id, category);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return categoryValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetImpactValues()
        {
            Dictionary<int, string> impactValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Impact"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string impact = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        impactValues.Add(id, impact);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return impactValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetPriorityValues()
        {
            Dictionary<int, string> priorityValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Priority"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string priority = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        priorityValues.Add(id, priority);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return priorityValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetBusPriorityValues()
        {
            Dictionary<int, string> buspriorityValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Bus_Priority"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string buspriority = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        buspriorityValues.Add(id, buspriority);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return buspriorityValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetRiskValues()
        {
            Dictionary<int, string> riskValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Risk"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string priority = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        riskValues.Add(id, priority);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return riskValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetTypeValues()
        {
            Dictionary<int, string> typeValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Type"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string type = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        typeValues.Add(id, type);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return typeValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetBusinessImpactValues()
        {
            Dictionary<int, string> busimpactValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Bus_Impact"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string busimpact = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        busimpactValues.Add(id, busimpact);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return busimpactValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetStageValues()
        {
            Dictionary<int, string> stageValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Stage"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string stage = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Name"]);
                        stageValues.Add(id, stage);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return stageValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetTypes()
        {
            Dictionary<int, string> typeValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Task_Type"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string type = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        typeValues.Add(id, type);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return typeValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetDevStageValues()
        {
            Dictionary<int, string> stageValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Dev_Stage"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string type = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        stageValues.Add(id, type);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return stageValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetDevTypeValues()
        {
            Dictionary<int, string> typeValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Dev_Type"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string type = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        typeValues.Add(id, type);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return typeValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetTaskStatusValues()
        {
            Dictionary<int, string> statusValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Task_Status"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string type = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        statusValues.Add(id, type);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return statusValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetDevCategoryValues()
        {
            Dictionary<int, string> devCategoryValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Dev_Category"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string devCategory = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        devCategoryValues.Add(id, devCategory);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return devCategoryValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetStatusValues()
        {
            // List<string> statusValues = new List<string>();
            Dictionary<int, string> statusValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_Status"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string status = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        statusValues.Add(id, status);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return statusValues;
        }

        [HttpGet]
        public List<Change_Properties> GetBusLineValues()
        {
            List<Change_Properties> propsList = new List<Change_Properties>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Business_Line"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        Change_Properties props = new Change_Properties();
                        props.Name = reader["Name"].ToString();
                        props.Id = Convert.ToInt32(reader["Id"]);
                        propsList.Add(props);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return propsList;
        }

        [HttpGet]
        public Dictionary<int, string> GetAXISTypeValues()
        {
            Dictionary<int, string> axTypeValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "AXIS_Type"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string name = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        axTypeValues.Add(id, name);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return axTypeValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetAXIS_StatusValues()
        {
            Dictionary<int, string> axStatusValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "AXIS_Status"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string name = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        axStatusValues.Add(id, name);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return axStatusValues;
        }

        [HttpGet]
        public Dictionary<string, string> GetSourceTypeValues()
        {
            //List<string> sourceTypeValues = new List<string>();
            Dictionary<string, string> sourceTypeValues = new Dictionary<string, string>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "SourceType"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string sourceid = reader["Id"].ToString();
                        string sourcetype = reader["Name"].ToString();
                        sourceTypeValues.Add(sourceid, sourcetype);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return sourceTypeValues;
        }

        [HttpGet]
        public Dictionary<string, string> GetOtherSourceTypeValues()
        {
            //List<string> sourceTypeValues = new List<string>();
            Dictionary<string, string> sourceTypeValues = new Dictionary<string, string>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "OtherSourceType"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string sourceid = reader["Id"].ToString();
                        string sourcetype = reader["Name"].ToString();
                        sourceTypeValues.Add(sourceid, sourcetype);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return sourceTypeValues;
        }

        [HttpGet]
        public Dictionary<string, string> GetProjectValues()
        {
            Dictionary<string, string> projectValues = new Dictionary<string, string>();
            string key;
            string value;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sqlQuery = "Select Project_Id, Project_Title From Projects";
                    SqlCommand command = new SqlCommand(sqlQuery, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        key = reader["Project_Id"].ToString();
                        value = reader["Project_Title"].ToString();
                        projectValues.Add(key, value);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return projectValues;
        }

        [HttpGet]
        public Dictionary<string, string> GetStrategicValues()
        {
            Dictionary<string, string> strategicValues = new Dictionary<string, string>();
            string key;
            string value;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sqlQuery = "Select Strategic_Id, Strategic_Title From Strategic_Initiatives";
                    SqlCommand command = new SqlCommand(sqlQuery, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        key = reader["Strategic_Id"].ToString();
                        value = reader["Strategic_Title"].ToString();
                        strategicValues.Add(key, value);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return strategicValues;
        }

        [HttpGet]
        public List<Employees> GetBusLineApprovers()
        {
            List<Employees> blValues = new List<Employees>();
            try
            {
                using (var connection = new SqlConnection(connDM))
                {
                    connection.Open();
                    string sql =
                    "Select 0 AS Id, '--None--' AS Name  UNION ALL SELECT Employee_ID AS [Id], LastName + '," +
                    " ' + FirstName AS [Name] FROM dbo.v_Employee WHERE (JobTitle LIKE '%Manager%' OR JobTitle LIKE '%Dir%'" +
                    " OR JobTitle LIKE '%AVP%') AND TerminatedDate IS NULL Order By Name";

                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        int id = Convert.ToInt32(reader["Id"]);
                        string name = reader["Name"].ToString();


                        Employees employee = new Employees();
                        employee.Id = id;
                        employee.LastFirst = name;
                        blValues.Add(employee);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return blValues;
        }

        [HttpGet]
        public List<Employees> GetEmployeesPivProd()
        {
            List<Employees> pivEmpValues = new List<Employees>();
            try
            {
                using (var connection = new SqlConnection(prodCS))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetPivotalEmployees";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        //string name = reader["Name"].ToString();
                        //Int64 id = Convert.ToInt64(reader["Id"]);
                        //pivEmpValues.Add(id, name);

                        string name = reader["Name"].ToString();
                        string fullName = name;
                        string formatName = "";
                        var names = fullName.Split(' ');
                        if (names.Length == 2)
                        {
                            string firstName = names[0];
                            string lastName = names[1];
                            formatName = lastName + ", " + firstName;
                        }
                        else
                        {
                            formatName = name;
                        }

                        Employees employee = new Employees();
                        employee.Id = Convert.ToInt32(reader["Id"]);
                        employee.LastFirst = formatName;
                        pivEmpValues.Add(employee);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return pivEmpValues;
        }

        public List<Employees> GetITEmployeesPivProd()
        {
            List<Employees> pivITEmpValues = new List<Employees>();
            try
            {
                using (var connection = new SqlConnection(prodCS))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetPivotalEmployees";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", 1));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string name = reader["Name"].ToString();
                        string fullName = name;
                        string formatName = "";
                        var names = fullName.Split(' ');
                        if (names.Length == 2)
                        {
                            string firstName = names[0];
                            string lastName = names[1];
                            formatName = lastName + ", " + firstName;
                        }
                        else
                        {
                            formatName = name;
                        }

                        Employees employee = new Employees();
                        employee.Id = Convert.ToInt32(reader["Id"]);
                        employee.LastFirst = formatName;
                        pivITEmpValues.Add(employee);

                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return pivITEmpValues;
        }

        [HttpGet]
        public Dictionary<int, string> GetProject_StatusValues()
        {
            Dictionary<int, string> prStatusValues = new Dictionary<int, string>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
                    command.Parameters.Add(new SqlParameter("@PropertyTableName", "Project_Status"));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        string name = reader["Name"].ToString();
                        int id = Convert.ToInt32(reader["Id"]);
                        prStatusValues.Add(id, name);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return prStatusValues;
        }


        //[HttpGet]
        //public Dictionary<Int64, string> GetRequestedByValues()
        //{
        //    Dictionary<Int64, string> requestedByValues = new Dictionary<Int64, string>();
        //    try
        //    {
        //        using (var connection = new SqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
        //            SqlCommand command = new SqlCommand(storedProc, connection);
        //            command.CommandType = CommandType.StoredProcedure;
        //            command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
        //            command.Parameters.Add(new SqlParameter("@PropertyTableName", "PivotalEmployees"));
        //            SqlDataReader reader = command.ExecuteReader();

        //            while (reader.Read())
        //            {
        //                Int64 requestedbyid = Convert.ToInt64(reader["ID"].ToString());
        //                string requestedbyname = reader["Name"].ToString();
        //                requestedByValues.Add(requestedbyid, requestedbyname);

        //            }
        //        }
        //    }
        //    catch (SqlException ex)
        //    {
        //        throw ex;
        //    }
        //    return requestedByValues;
        //}


        // [HttpGet]
        //public Dictionary<Int32, string> GetEmployees()
        //{
        //    Dictionary<Int32, string> empValues = new Dictionary<Int32, string>();
        //    try
        //    {
        //        using (var connection = new SqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
        //            SqlCommand command = new SqlCommand(storedProc, connection);
        //            command.CommandType = CommandType.StoredProcedure;
        //            command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
        //            command.Parameters.Add(new SqlParameter("@PropertyTableName", "Employees"));
        //            SqlDataReader reader = command.ExecuteReader();

        //            while (reader.Read())
        //            {
        //                string name = reader["Name"].ToString();
        //                string fullName = name;
        //                string formatName = "";
        //                var names = fullName.Split(' ');
        //                if (names.Length == 2)
        //                {
        //                    string firstName = names[0];
        //                    string lastName = names[1];
        //                    formatName = lastName + ", " + firstName;
        //                }
        //                else
        //                {
        //                    formatName = name;
        //                }

        //                Int32 id = Convert.ToInt32(reader["Id"]);
        //                empValues.Add(id, formatName);
        //            }
        //        }
        //    }
        //    catch (SqlException ex)
        //    {
        //        throw ex;
        //    }
        //    return empValues;
        //}

        //[HttpGet]
        //public IEnumerable<string> GetApprovalValues()
        //{
        //    List<string> approvalValues = new List<string>();
        //    try
        //    {
        //        using (var connection = new SqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
        //            SqlCommand command = new SqlCommand(storedProc, connection);
        //            command.CommandType = CommandType.StoredProcedure;
        //            command.Parameters.Add(new SqlParameter("@Type", "Change Management Web"));
        //            command.Parameters.Add(new SqlParameter("@PropertyTableName", "approval"));
        //            SqlDataReader reader = command.ExecuteReader();

        //            while (reader.Read())
        //            {
        //                string approval = reader["Name"].ToString();
        //                approvalValues.Add(approval);
        //            }
        //        }
        //    }
        //    catch (SqlException ex)
        //    {
        //        throw ex;
        //    }
        //    return approvalValues;
        //}

        //[HttpGet]
        //public IEnumerable<string> GetStateValues()
        //{
        //    List<string> stateValues = new List<string>();
        //    try
        //    {
        //        using (var connection = new SqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            string storedProc = "sp_ChngMgmt_GetChangeRecordProperties";
        //            SqlCommand command = new SqlCommand(storedProc, connection);
        //            command.CommandType = CommandType.StoredProcedure;
        //            command.Parameters.Add(new SqlParameter("@Type", "Change Management"));
        //            command.Parameters.Add(new SqlParameter("@PropertyTableName", "Change_State"));
        //            SqlDataReader reader = command.ExecuteReader();

        //            while (reader.Read())
        //            {
        //                string state = reader["Name"].ToString();
        //                stateValues.Add(state);
        //            }
        //        }
        //    }
        //    catch (SqlException ex)
        //    {
        //        throw ex;
        //    }
        //    return stateValues;
        //}

        #endregion End Populate Fields

        //[HttpGet]
        //public List<ChangeRecordDetail> GetAllRecordsRequests()
        //{
        //    var changelist = new List<ChangeRecordDetail>();
        //    try
        //    {
        //        using (var connection = new SqlConnection(connectionString))
        //        {
        //            connection.Open();
        //            string storedProc = "usp_ChngMgmt_GetChangeRecords";
        //            SqlCommand command = new SqlCommand(storedProc, connection);
        //            command.CommandType = CommandType.StoredProcedure;
        //            command.Parameters.Add(new SqlParameter("@Type", 1));
        //            SqlDataReader reader = command.ExecuteReader();
        //            while (reader.Read())
        //            {
        //                //Use utility function to take care of null dates
        //                DateTime? plannedstartdate = null;
        //                plannedstartdate = DateTimeReader(plannedstartdate, "Planned Start", reader);
        //                DateTime? plannedenddate = null;
        //                plannedenddate = DateTimeReader(plannedenddate, "Planned End", reader);
        //                DateTime? workstartdate = null;
        //                workstartdate = DateTimeReader(workstartdate, "Work Start", reader);
        //                DateTime? workenddate = null;
        //                workenddate = DateTimeReader(workenddate, "Work End", reader);
        //                DateTime? requestbydate = null;
        //                requestbydate = DateTimeReader(requestbydate, "Request_By_Date", reader);
        //                DateTime? bus_implement_deadline = null;
        //                bus_implement_deadline = DateTimeReader(bus_implement_deadline, "Bus Imp Deadline", reader);
        //                DateTime? source_orig_date = null;
        //                source_orig_date = DateTimeReader(source_orig_date, "Original Ticket Date", reader);
        //                DateTime? change_completed_date = null;
        //                change_completed_date = DateTimeReader(change_completed_date, "Change Complete Date", reader);
        //                DateTime? change_start_date = null;
        //                change_start_date = DateTimeReader(change_start_date, "Change_Start_Date", reader);

        //                DateTime? assessmentby_date = null;
        //                assessmentby_date = DateTimeReader(assessmentby_date, "AssessmentBy_Date", reader);

        //                ChangeRecordDetail crd = new ChangeRecordDetail();
        //                crd.Change_Record_Id = IdReader64("Change_Record_Id", reader);
        //                crd.Change_Num = reader["Change #"].ToString();
        //                crd.RequestedByName = reader["Requested By"].ToString();
        //                crd.AssignedTo = reader["Assigned To"].ToString();
        //                crd.Assigned_To_Id = IdReader32("AssignedTo_ITOps_Id", reader);
        //                crd.Category = reader["Category"].ToString();
        //                crd.Priority = reader["Priority"].ToString();
        //                crd.Impact = reader["Impact"].ToString();
        //                crd.Status = reader["Status"].ToString();
        //                crd.Type = reader["Type"].ToString();
        //                crd.Risk = reader["Risk"].ToString();
        //                crd.Change_Short_Desc = reader["Short Description"].ToString();
        //                crd.Change_Long_Desc = reader["Long Description"].ToString();
        //                //     crd.Comments = reader["Comments"].ToString();
        //                crd.PlannedStartDate = plannedstartdate;
        //                crd.PlannedEndDate = plannedenddate;
        //                crd.WorkStartDate = workstartdate;
        //                crd.WorkEndDate = workenddate;
        //                crd.Request_By_Date = requestbydate;
        //                crd.ChangePlan = reader["ChangePlan_Id"].ToString();
        //                crd.BackoutPlan = reader["BackoutPlan_Id"].ToString();
        //                crd.TestPlan = reader["TestPlan_Id"].ToString();
        //                crd.CreatedBy = reader["Created By"].ToString();
        //                crd.CreateDate = Convert.ToDateTime(reader["Create Date"].ToString());

        //                crd.SourceType = reader["Source"].ToString();
        //                crd.SourceVal = reader["Source Id"].ToString();

        //                crd.OtherSourceType = reader["OtherSourceType"].ToString();
        //                crd.OtherSourceVal = reader["OtherSourceVal"].ToString();

        //                crd.Bus_Implementation_Deadline = bus_implement_deadline;
        //                crd.Business_Approver = reader["Business Approver"].ToString();
        //                //  crd.Business_Contact = reader["Business Contact"].ToString();
        //                crd.Business_Priority = reader["Bus Priority"].ToString();
        //                crd.Business_Impact = reader["Bus Impact"].ToString();
        //                crd.Business_Impact_Description = reader["Business_Impact_Description"].ToString();
        //                crd.Bus_NonImplement_Effects = reader["Bus_NonImplement_Effects"].ToString();
        //                crd.Business_Case = reader["Business_Case"].ToString();
        //                crd.Service_Owner = reader["Service Owner"].ToString();
        //                crd.Source_Original_Date = source_orig_date;
        //                crd.Change_NonImplement_Effect = reader["Change_NonImplement_Effect"].ToString();
        //                // crd.Completed_By = reader["Completed By"].ToString();
        //                // crd.Change_Completed_By = IdReader64("Change_Completed_By", reader);
        //                crd.Change_Completed_Date = change_completed_date;
        //                crd.Change_Start_Date = change_start_date;
        //                crd.Resources = reader["Resources"].ToString();
        //                crd.PostReviewCompletedDate = DateTimeReader(crd.PostReviewCompletedDate, "Post Review Completed Date", reader);
        //                // crd.PostReviewCompletedBy_Id = IdReader32("PostReviewCompletedBy_Id", reader);
        //                // crd.Deleted = Convert.ToBoolean(reader["Deleted"]);
        //                // crd.Change_Stage_Id = reader["Stage"].ToString(); 
        //                crd.Bus_Line_Id = String.IsNullOrEmpty(reader["Bus_Line_Id"].ToString()) ? 0 : Convert.ToInt32(reader["Bus_Line_Id"]);
        //                crd.AssessmentBy_Date = assessmentby_date;
        //                // crd.RejectReason = reader["RejectReason"].ToString();

        //                changelist.Add(crd);
        //            }
        //        }
        //    }
        //    catch (SqlException ex)
        //    {
        //        throw ex;
        //    }
        //    return changelist;
        //}

        [HttpGet]
        public DataTableResult<ChangeRecordDetail> GetAllChangeRequests(int Type)
        {
            var changelist = new List<ChangeRecordDetail>();
            var dtr = new DataTableResult<ChangeRecordDetail>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeRecords";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    command.Parameters.Add(new SqlParameter("@CurrentUser", currentUser));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        //Use utility function to take care of null dates
                        DateTime? plannedstartdate = null;
                        plannedstartdate = DateTimeReader(plannedstartdate, "Planned Start", reader);
                        DateTime? plannedenddate = null;
                        plannedenddate = DateTimeReader(plannedenddate, "Planned End", reader);
                        DateTime? workstartdate = null;
                        workstartdate = DateTimeReader(workstartdate, "Work Start", reader);
                        DateTime? workenddate = null;
                        workenddate = DateTimeReader(workenddate, "Work End", reader);
                        DateTime? requestbydate = null;
                        requestbydate = DateTimeReader(requestbydate, "Request_By_Date", reader);
                        DateTime? bus_implement_deadline = null;
                        bus_implement_deadline = DateTimeReader(bus_implement_deadline, "Bus Imp Deadline", reader);
                        DateTime? source_orig_date = null;
                        source_orig_date = DateTimeReader(source_orig_date, "Original Ticket Date", reader);
                        DateTime? change_completed_date = null;
                        change_completed_date = DateTimeReader(change_completed_date, "Change Complete Date", reader);
                        DateTime? change_start_date = null;
                        change_start_date = DateTimeReader(change_start_date, "Change_Start_Date", reader);

                        ChangeRecordDetail crd = new ChangeRecordDetail();

                        crd.Change_Num = reader["Change #"].ToString();
                        crd.RequestedByName = reader["Requested By"].ToString();
                        crd.AssignedTo = reader["Assigned To"].ToString();
                        crd.Assigned_To_Id = IdReader32("AssignedTo_ITOps_Id", reader);
                        crd.Category = reader["Category"].ToString();
                        crd.Priority = reader["Priority"].ToString();
                        crd.Impact = reader["Impact"].ToString();
                        crd.Status = reader["Status"].ToString();
                        crd.Type = reader["Type"].ToString();
                        crd.Risk = reader["Risk"].ToString();
                        crd.Change_Short_Desc = reader["Short Description"].ToString();
                        crd.Change_Long_Desc = reader["Long Description"].ToString();
                        //  crd.Comments = reader["Comments"].ToString();
                        crd.PlannedStartDate = plannedstartdate;
                        crd.PlannedEndDate = plannedenddate;
                        crd.WorkStartDate = workstartdate;
                        crd.WorkEndDate = workenddate;
                        crd.Request_By_Date = requestbydate;
                        crd.ChangePlan = reader["ChangePlan_Id"].ToString();
                        crd.BackoutPlan = reader["BackoutPlan_Id"].ToString();
                        crd.TestPlan = reader["TestPlan_Id"].ToString();
                        crd.CreatedBy = reader["Created By"].ToString();
                        crd.CreateDate = Convert.ToDateTime(reader["Create Date"].ToString());

                        crd.SourceType = reader["Source"].ToString();
                        crd.SourceVal = reader["Source Id"].ToString();

                        crd.OtherSourceType = reader["OtherSourceType"].ToString();
                        crd.OtherSourceVal = reader["OtherSourceVal"].ToString();

                        crd.Bus_Implementation_Deadline = bus_implement_deadline;
                        crd.Business_Approver = reader["Business Approver"].ToString();
                        //      crd.Business_Contact = reader["Business Contact"].ToString();
                        crd.Business_Priority = reader["Bus Priority"].ToString();
                        crd.Business_Impact = reader["Bus Impact"].ToString();
                        crd.Business_Impact_Description = reader["Business_Impact_Description"].ToString();
                        crd.Bus_NonImplement_Effects = reader["Bus_NonImplement_Effects"].ToString();
                        crd.Business_Case = reader["Business_Case"].ToString();
                        crd.Service_Owner = reader["Service Owner"].ToString();
                        crd.Source_Original_Date = source_orig_date;
                        crd.Change_NonImplement_Effect = reader["Change_NonImplement_Effect"].ToString();
                        // crd.Completed_By = reader["Completed By"].ToString();
                        crd.Change_Completed_By = IdReader64("Change_Completed_By", reader);
                        crd.Change_Completed_Date = change_completed_date;
                        crd.Resources = reader["Resources"].ToString();
                        crd.PostReviewCompletedDate = DateTimeReader(crd.PostReviewCompletedDate, "Post Review Completed Date", reader);
                        crd.PostReviewCompletedBy_Id = IdReader32("PostReviewCompletedBy_Id", reader);
                        // crd.Deleted = Convert.ToBoolean(reader["Deleted"]);
                        // crd.Change_Stage_Id = reader["Stage"].ToString(); 
                        crd.Bus_Line_Id = String.IsNullOrEmpty(reader["Bus_Line_Id"].ToString()) ? 0 : Convert.ToInt32(reader["Bus_Line_Id"]);
                        //  crd.RejectReason = reader["RejectReason"].ToString();
                        crd.Approval_By = reader["Approval_By"].ToString();
                        crd.Approval_Date = DateTimeReader(crd.Approval_Date, "Approval_Date", reader);
                        // crd.Reject_Reason_Id = IdReader64("Reject_Reason_Id", reader);
                        try
                        {
                            crd.TotalTasks = IdReader32("Total Tasks", reader);
                        }
                        catch (Exception ex)
                        {

                        }

                        changelist.Add(crd);
                    }
                    dtr.data = changelist;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return dtr;

        }

        [HttpGet]
        public DataTableResult<ChangeRecordDetail> GetAllChangeRecords(int Type) //, string currentUser)
        {
            var changelist = new List<ChangeRecordDetail>();
            var dtr = new DataTableResult<ChangeRecordDetail>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeRecords";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    command.Parameters.Add(new SqlParameter("@CurrentUser", currentUser));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        //Use utility function to take care of null dates
                        DateTime? plannedstartdate = null;
                        plannedstartdate = DateTimeReader(plannedstartdate, "Planned Start", reader);
                        DateTime? plannedenddate = null;
                        plannedenddate = DateTimeReader(plannedenddate, "Planned End", reader);
                        DateTime? workstartdate = null;
                        workstartdate = DateTimeReader(workstartdate, "Work Start", reader);
                        DateTime? workenddate = null;
                        workenddate = DateTimeReader(workenddate, "Work End", reader);
                        DateTime? requestbydate = null;
                        requestbydate = DateTimeReader(requestbydate, "Request_By_Date", reader);
                        DateTime? bus_implement_deadline = null;
                        bus_implement_deadline = DateTimeReader(bus_implement_deadline, "Bus Imp Deadline", reader);
                        DateTime? source_orig_date = null;
                        source_orig_date = DateTimeReader(source_orig_date, "Original Ticket Date", reader);
                        DateTime? change_completed_date = null;
                        change_completed_date = DateTimeReader(change_completed_date, "Change Complete Date", reader);
                        DateTime? change_start_date = null;
                        change_start_date = DateTimeReader(change_start_date, "Change_Start_Date", reader);

                        ChangeRecordDetail crd = new ChangeRecordDetail();

                        crd.Change_Num = reader["Change #"].ToString();
                        crd.RequestedByName = reader["Requested By"].ToString();
                        crd.AssignedTo = reader["Assigned To"].ToString();
                        crd.Assigned_To_Id = IdReader32("AssignedTo_ITOps_Id", reader);
                        crd.Category = reader["Category"].ToString();
                        crd.Priority = reader["Priority"].ToString();
                        crd.Impact = reader["Impact"].ToString();
                        crd.Status = reader["Status"].ToString();
                        crd.Type = reader["Type"].ToString();
                        crd.Risk = reader["Risk"].ToString();
                        crd.Change_Short_Desc = reader["Short Description"].ToString();
                        crd.Change_Long_Desc = reader["Long Description"].ToString();
                        //    crd.Comments = reader["Comments"].ToString();
                        crd.PlannedStartDate = plannedstartdate;
                        crd.PlannedEndDate = plannedenddate;
                        crd.WorkStartDate = workstartdate;
                        crd.WorkEndDate = workenddate;
                        crd.Request_By_Date = requestbydate;
                        crd.ChangePlan = reader["ChangePlan_Id"].ToString();
                        crd.BackoutPlan = reader["BackoutPlan_Id"].ToString();
                        crd.TestPlan = reader["TestPlan_Id"].ToString();
                        crd.CreatedBy = reader["Created By"].ToString();
                        crd.CreateDate = Convert.ToDateTime(reader["Create Date"].ToString());

                        crd.SourceType = reader["Source"].ToString();
                        crd.SourceVal = reader["Source Id"].ToString();

                        crd.OtherSourceType = reader["OtherSourceType"].ToString();
                        crd.OtherSourceVal = reader["OtherSourceVal"].ToString();

                        crd.Bus_Implementation_Deadline = bus_implement_deadline;
                        crd.Business_Approver = reader["Business Approver"].ToString();
                        //    crd.Business_Contact = reader["Business Contact"].ToString();
                        crd.Business_Priority = reader["Bus Priority"].ToString();
                        crd.Business_Impact = reader["Bus Impact"].ToString();
                        crd.Business_Impact_Description = reader["Business_Impact_Description"].ToString();
                        crd.Bus_NonImplement_Effects = reader["Bus_NonImplement_Effects"].ToString();
                        crd.Business_Case = reader["Business_Case"].ToString();
                        crd.Service_Owner = reader["Service Owner"].ToString();
                        crd.Source_Original_Date = source_orig_date;
                        crd.Change_NonImplement_Effect = reader["Change_NonImplement_Effect"].ToString();
                        // crd.Completed_By = reader["Completed By"].ToString();
                        crd.Change_Completed_By = IdReader64("Change_Completed_By", reader);
                        crd.Change_Completed_Date = change_completed_date;
                        crd.Resources = reader["Resources"].ToString();
                        crd.TotalTasks = IdReader32("Total Tasks", reader);
                        crd.PostReviewCompletedDate = DateTimeReader(crd.PostReviewCompletedDate, "Post Review Completed Date", reader);
                        crd.PostReviewCompletedBy_Id = IdReader32("PostReviewCompletedBy_Id", reader);
                        // crd.Deleted = Convert.ToBoolean(reader["Deleted"]);
                        // crd.Change_Stage_Id = reader["Stage"].ToString();
                        crd.Bus_Line_Id = String.IsNullOrEmpty(reader["Bus_Line_Id"].ToString()) ? 0 : Convert.ToInt32(reader["Bus_Line_Id"]);
                        //  crd.RejectReason = reader["RejectReason"].ToString();
                        crd.Approval_By = reader["Approval_By"].ToString();
                        crd.Approval_Date = DateTimeReader(crd.Approval_Date, "Approval_Date", reader);
                        //   crd.Reject_Reason_Id = IdReader64("Reject_Reason_Id", reader);
                        changelist.Add(crd);
                    }
                    dtr.data = changelist;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return dtr;
        }

        [HttpGet]
        public ChangeRecordDetail GetChangeRecordDetailsById(string id)
        {
            ChangeRecordDetail changeRecord = new ChangeRecordDetail();
            var changelist = new List<ChangeRecordDetail>();

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeRecords";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", 2));
                    command.Parameters.Add(new SqlParameter("@Id", id));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        ChangeRecordDetail crd = new ChangeRecordDetail();
                        crd.Change_Num = reader["Change #"].ToString();
                        // crd.Change_Stage_Id = IdReader32("Change_Stage_Id", reader);
                        crd.Change_Record_Id = IdReader64("Change_Record_Id", reader);
                        crd.Requested_By_Id = IdReader64("Requested_By_Id", reader);
                        // crd.AssignedTo = reader["Assigned To"].ToString();
                        crd.Assigned_To_Id = IdReader32("AssignedTo_ITOps_Id", reader);
                        crd.Category_Id = IdReader32("Category_Id", reader);
                        crd.Change_Priority_Id = IdReader32("Change_Priority_Id", reader);
                        crd.Change_Impact_Id = IdReader32("Change_Impact_Id", reader);
                        crd.Change_Status_Id = IdReader32("Change_Status_Id", reader);
                        crd.Change_Type_Id = IdReader32("Change_Type_Id", reader);
                        crd.Change_Risk_Id = IdReader32("Change_Risk_Id", reader);
                        crd.Change_Short_Desc = reader["Short Description"].ToString();
                        crd.Change_Long_Desc = reader["Long Description"].ToString();
                        //  crd.Comments = reader["Comments"].ToString();
                        //All Dates
                        crd.PlannedStartDate = DateTimeReader(crd.PlannedStartDate, "Planned Start", reader);
                        crd.PlannedEndDate = DateTimeReader(crd.PlannedEndDate, "Planned End", reader);
                        crd.WorkStartDate = DateTimeReader(crd.WorkStartDate, "Work Start", reader);
                        crd.WorkEndDate = DateTimeReader(crd.WorkEndDate, "Work End", reader);
                        crd.Request_By_Date = DateTimeReader(crd.Request_By_Date, "Request_By_Date", reader);
                        crd.Bus_Implementation_Deadline = DateTimeReader(crd.Bus_Implementation_Deadline, "Bus Imp Deadline", reader);
                        crd.Source_Original_Date = DateTimeReader(crd.Source_Original_Date, "Original Ticket Date", reader);
                        crd.Change_Completed_Date = DateTimeReader(crd.Change_Completed_Date, "Change Complete Date", reader);
                        crd.Change_Start_Date = DateTimeReader(crd.Change_Start_Date, "Change_Start_Date", reader);
                        crd.PostReviewCompletedDate = DateTimeReader(crd.PostReviewCompletedDate, "Post Review Completed Date", reader);
                        crd.CreateDate = Convert.ToDateTime(reader["Create Date"].ToString());
                        crd.ChangePlan = reader["ChangePlan_Id"].ToString();
                        crd.BackoutPlan = reader["BackoutPlan_Id"].ToString();
                        crd.TestPlan = reader["TestPlan_Id"].ToString();
                        crd.CreatedBy = reader["Created By"].ToString();

                        crd.SourceType = reader["Source"].ToString();
                        crd.SourceVal = reader["Source Id"].ToString();

                        crd.OtherSourceType = reader["OtherSourceType"].ToString();
                        crd.OtherSourceVal = reader["OtherSourceVal"].ToString();

                        crd.Bus_Line_Approver_Id = IdReader32("Bus_Line_Approver_Id", reader);
                        //crd.Bus_Line_Contact_Id = IdReader32("Bus_Line_Contact_Id", reader);
                        crd.Business_Priority_Id = IdReader32("Business_Priority_Id", reader);
                        crd.Business_Impact_Id = IdReader32("Business_Impact_Id", reader);
                        crd.Business_Impact_Description = reader["Business_Impact_Description"].ToString();
                        crd.Bus_NonImplement_Effects = reader["Bus_NonImplement_Effects"].ToString();
                        crd.Business_Case = reader["Business_Case"].ToString();
                        crd.Service_Owner_Id = IdReader64("Service_Owner_Id", reader);
                        crd.Resources = reader["Resources"].ToString();
                        crd.Change_NonImplement_Effect = reader["Change_NonImplement_Effect"].ToString();
                        // crd.Completed_By = reader["Completed By"].ToString();
                        crd.Change_Completed_By = IdReader64("Change_Completed_By", reader);
                        //  crd.Technical_Assessment = reader["Technical_Assessment"].ToString();
                        crd.PostReviewCompletedDate = DateTimeReader(crd.PostReviewCompletedDate, "Post Review Completed Date", reader);
                        crd.PostReviewCompletedBy_Id = IdReader32("PostReviewCompletedBy_Id", reader);
                        crd.AssessmentBy_Id = IdReader32("AssessmentBy_Id", reader);
                        crd.AssessmentBy_Date = DateTimeReader(crd.AssessmentBy_Date, "AssessmentBy_Date", reader);
                        crd.Bus_Line_Id = String.IsNullOrEmpty(reader["Bus_Line_Id"].ToString()) ? 0 : Convert.ToInt32(reader["Bus_Line_Id"]);
                        // crd.RejectReason = reader["RejectReason"].ToString();
                        crd.Approval_By = reader["Approval_By"].ToString();
                        crd.Approval_Date = DateTimeReader(crd.Approval_Date, "Approval_Date", reader);
                        crd.Reject_Reason_Id = IdReader64("Reject_Reason_Id", reader);
                        changelist.Add(crd);
                    }
                    changeRecord = changelist.FirstOrDefault((p) => p.Change_Num == id);
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return changeRecord;
        }


        [HttpGet]
        public DataTableResult<ChangeTask> GetAllTasks(int Type)
        {
            List<ChangeTask> changeTaskList = new List<ChangeTask>();
            var results = new DataTableResult<ChangeTask>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeTasks";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    command.Parameters.Add(new SqlParameter("@CurrentUser", currentUser));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        ChangeTask task = new ChangeTask();
                        task.Change_Task_Id = Convert.ToInt32(reader["Change_Task_Id"]);
                        task.Change_Record_Id = Convert.ToInt32(reader["Change_Record_Id"]);
                        task.External_Task_Id = Convert.ToInt32(reader["ExternalTaskId"]);
                        task.TaskPriorityDesc = Convert.ToString(reader["Priority"]);
                        task.StateDesc = Convert.ToString(reader["State"]);
                        task.ShortDesc = Convert.ToString(reader["Name"]);
                        task.CreateDate = Convert.ToDateTime(reader["CreateDate"]);
                        task.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                        DateTime? duedate = null;
                        task.DueDate = DateTimeReader(duedate, "Due_Date", reader);
                        DateTime? completedate = null;
                        task.CompleteDate = DateTimeReader(completedate, "Completed_Date", reader);
                        DateTime? taskstartdate = null;
                        task.Task_Start_Date = DateTimeReader(taskstartdate, "Task_Start_Date", reader);
                        task.LongDesc = reader["Description"].ToString();
                        task.Assigned_To = IdReader32("Assigned_To_Id", reader);
                        task.AssignedToTask = reader["Assigned To Task"].ToString();
                        task.Type_Id = IdReader32("Type_Id", reader);
                        task.TypeDescription = reader["Type Description"].ToString();
                        task.Task_Status_Id = IdReader32("Task_Status_Id", reader);
                        task.Task_Status_Desc = reader["Task_Status_Desc"].ToString();
                        //    task.WorkNotes = reader["Work_Notes"].ToString();

                        task.Dev_Category_Id = IdReader32("Dev_Category_Id", reader);
                        task.Dev_Description = reader["Dev_Description"].ToString();
                        task.Dev_Stage_Id = IdReader32("Dev_Stage_Id", reader);
                        task.Dev_Type_Id = IdReader32("Dev_Type_Id", reader);

                        task.Activity_Descr = reader["Activity_Description"].ToString();

                        task.Quote_Id = reader["Quote_Id"].ToString();
                        task.Invoice_No = reader["Invoice_No"].ToString();
                        task.Amount = String.IsNullOrEmpty(reader["Amount"].ToString()) ? 0 : Convert.ToDecimal(reader["Amount"]);
                        task.GL_Account = reader["GL_Account"].ToString();
                        task.Quote_Requested = DateTimeReader(task.Quote_Requested, "Quote_Requested", reader);
                        task.Quote_Received = DateTimeReader(task.Quote_Approved, "Quote_Received", reader);
                        task.Quote_Approved = DateTimeReader(task.Quote_Approved, "Quote_Approved", reader);
                        task.Software_Delivered = DateTimeReader(task.Software_Delivered, "Software_Delivered", reader);
                        task.Software_Implemented = DateTimeReader(task.Software_Implemented, "Software_Implemented", reader);
                        task.FullReleaseRequired = reader["Full_Release_Required"] == DBNull.Value ? false : Convert.ToBoolean(reader["Full_Release_Required"]);
                        task.Declined_Date = DateTimeReader(task.Declined_Date, "Declined_Date", reader);
                        task.AnnMaintFee = String.IsNullOrEmpty(reader["AnnMaintFee"].ToString()) ? 0 : Convert.ToDecimal(reader["AnnMaintFee"]);
                        task.AnnFeeDueDate = DateTimeReader(task.AnnFeeDueDate, "AnnFeeDueDate", reader);

                        task.AXIS_Bundle_Id = IdReader32("AXIS_Bundle_Id", reader);
                        task.Axis_Owner_Id = IdReader32("AXIS_Owner_Id", reader);
                        task.AXIS_Status_Id = IdReader32("AXIS_Status_Id", reader);
                        task.AXIS_Type_Id = IdReader32("AXIS_Type_Id", reader);
                        task.Campana_Descr = reader["Campana_Descr"].ToString();
                        task.User_Descr = reader["User_Descr"].ToString();
                        task.Loaded_To_Test = DateTimeReader(task.Loaded_To_Test, "Loaded_To_Test", reader);
                        task.Loaded_To_Train = DateTimeReader(task.Loaded_To_Train, "Loaded_To_Train", reader);
                        task.Loaded_To_TrainBy = IdReader32("Loaded_To_TrainBy", reader);
                        task.Emergency_Load = reader["Emergency_Load"] == DBNull.Value ? false : Convert.ToBoolean(reader["Emergency_Load"]);
                        task.Emergency_Load_Reason = reader["Emergency_Load_Reason"].ToString();

                        task.Loaded_To_Prod = DateTimeReader(task.Loaded_To_Prod, "Loaded_To_Prod", reader);
                        task.Loaded_To_ProdBy = IdReader32("Loaded_To_ProdBy", reader);
                        task.Obsolete = reader["Obsolete"] == DBNull.Value ? false : Convert.ToBoolean(reader["Obsolete"]);
                        task.Obsolete_Reason = reader["Obsolete_Reason"].ToString();
                        task.TicketNum = reader["TicketNum"].ToString();



                        task.Business_Priority = reader["Business_Priority"].ToString();

                        changeTaskList.Add(task);
                    }
                    results.data = changeTaskList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        [HttpGet]
        public DataTableResult<ChangeTask> GetAllTasksForChangeId(string id)
        {
            List<ChangeTask> changeTaskList = new List<ChangeTask>();
            var results = new DataTableResult<ChangeTask>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeTasks";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", id));
                    command.Parameters.Add(new SqlParameter("@ChangeTaskId", null));
                    command.Parameters.Add(new SqlParameter("@Type", 2));

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        ChangeTask task = new ChangeTask();
                        task.AssignedToTask = reader["Assigned To Task"].ToString();
                        task.Change_Task_Id = Convert.ToInt32(reader["Change_Task_Id"]);
                        task.Change_Record_Id = Convert.ToInt32(reader["Change_Record_Id"]);
                        task.External_Task_Id = Convert.ToInt32(reader["ExternalTaskId"]);
                        task.TaskPriorityDesc = Convert.ToString(reader["Priority"]);
                        task.StateDesc = Convert.ToString(reader["State"]);
                        task.ShortDesc = Convert.ToString(reader["Name"]);
                        task.CreateDate = Convert.ToDateTime(reader["CreateDate"]);
                        task.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                        DateTime? duedate = null;
                        task.DueDate = DateTimeReader(duedate, "Due_Date", reader);
                        DateTime? completedate = null;
                        task.CompleteDate = DateTimeReader(completedate, "Completed_Date", reader);
                        DateTime? taskstartdate = null;
                        task.Task_Start_Date = DateTimeReader(taskstartdate, "Task_Start_Date", reader);
                        task.LongDesc = reader["Description"].ToString();
                        //   task.WorkNotes = reader["Work_Notes"].ToString();
                        task.Type_Id = IdReader32("Type_Id", reader);
                        task.TypeDescription = reader["Type Description"].ToString();
                        task.Task_Status_Id = IdReader32("Task_Status_Id", reader);
                        task.Task_Status_Desc = reader["Task_Status_Desc"].ToString();
                        task.Dev_Category_Id = IdReader32("Dev_Category_Id", reader);
                        task.Dev_Description = reader["Dev_Description"].ToString();
                        task.Dev_Stage_Id = IdReader32("Dev_Stage_Id", reader);
                        task.Dev_Type_Id = IdReader32("Dev_Type_Id", reader);
                        task.Activity_Descr = reader["Activity_Description"].ToString();
                        task.Assigned_To = IdReader32("Assigned_To_Id", reader);
                        task.Quote_Id = reader["Quote_Id"].ToString();
                        task.Invoice_No = reader["Invoice_No"].ToString();
                        task.Amount = String.IsNullOrEmpty(reader["Amount"].ToString()) ? 0 : Convert.ToDecimal(reader["Amount"]);
                        task.GL_Account = reader["GL_Account"].ToString();
                        task.Quote_Requested = DateTimeReader(task.Quote_Requested, "Quote_Requested", reader);
                        task.Quote_Received = DateTimeReader(task.Quote_Approved, "Quote_Received", reader);
                        task.Quote_Approved = DateTimeReader(task.Quote_Approved, "Quote_Approved", reader);
                        task.Software_Delivered = DateTimeReader(task.Software_Delivered, "Software_Delivered", reader);
                        task.FullReleaseRequired = reader["Full_Release_Required"] == DBNull.Value ? false : Convert.ToBoolean(reader["Full_Release_Required"]);
                        task.Declined_Date = DateTimeReader(task.Declined_Date, "Declined_Date", reader);
                        task.AnnMaintFee = String.IsNullOrEmpty(reader["AnnMaintFee"].ToString()) ? 0 : Convert.ToDecimal(reader["AnnMaintFee"]);
                        task.AnnFeeDueDate = DateTimeReader(task.AnnFeeDueDate, "AnnFeeDueDate", reader);

                        task.Software_Implemented = DateTimeReader(task.Software_Implemented, "Software_Implemented", reader);
                        task.AXIS_Bundle_Id = IdReader32("AXIS_Bundle_Id", reader);
                        task.Axis_Owner_Id = IdReader32("AXIS_Owner_Id", reader);
                        task.AXIS_Status_Id = IdReader32("AXIS_Status_Id", reader);
                        task.AXIS_Type_Id = IdReader32("AXIS_Type_Id", reader);
                        task.Campana_Descr = reader["Campana_Descr"].ToString();
                        task.User_Descr = reader["User_Descr"].ToString();
                        task.Loaded_To_Test = DateTimeReader(task.Loaded_To_Test, "Loaded_To_Test", reader);
                        task.Loaded_To_Train = DateTimeReader(task.Loaded_To_Train, "Loaded_To_Train", reader);
                        task.Loaded_To_TrainBy = IdReader32("Loaded_To_TrainBy", reader);
                        task.Emergency_Load = reader["Emergency_Load"] == DBNull.Value ? false : Convert.ToBoolean(reader["Emergency_Load"]);
                        task.Emergency_Load_Reason = reader["Emergency_Load_Reason"].ToString();

                        task.Loaded_To_Prod = DateTimeReader(task.Loaded_To_Prod, "Loaded_To_Prod", reader);
                        task.Loaded_To_ProdBy = IdReader32("Loaded_To_ProdBy", reader);
                        task.Obsolete = reader["Obsolete"] == DBNull.Value ? false : Convert.ToBoolean(reader["Obsolete"]);
                        task.Obsolete_Reason = reader["Obsolete_Reason"].ToString();
                        task.TicketNum = reader["TicketNum"].ToString();

                        changeTaskList.Add(task);
                    }
                    results.data = changeTaskList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        [HttpGet]
        public ChangeTask GetTaskForChangeId(Int64 changeid, Int64 taskid)
        {
            ChangeTask task = new ChangeTask();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeTasks";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", changeid));
                    command.Parameters.Add(new SqlParameter("@ChangeTaskId", taskid));
                    command.Parameters.Add(new SqlParameter("@Type", 3));

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        task.Change_Task_Id = IdReader64("Change_Task_Id", reader);
                        task.External_Task_Id = Convert.ToInt32(reader["ExternalTaskId"]);
                        task.LongDesc = reader["Description"].ToString();
                        task.Assigned_To = IdReader32("Assigned_To_Id", reader);
                        task.Task_State_Id = IdReader16("State_Id", reader);
                        DateTime? createdate = null;
                        task.CreateDate = DateTimeReader(createdate, "CreateDate", reader);
                        task.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                        DateTime? duedate = null;
                        task.DueDate = DateTimeReader(duedate, "Due_Date", reader);
                        DateTime? lasteditdate = null;
                        task.EditDate = DateTimeReader(lasteditdate, "LastEditDate", reader);
                        task.LastEditUser = reader["LastEditedBy"].ToString();
                        DateTime? completeddate = null;
                        task.CompleteDate = DateTimeReader(completeddate, "Completed_Date", reader);
                        DateTime? taskstartdate = null;
                        task.Task_Start_Date = DateTimeReader(taskstartdate, "Task_Start_Date", reader);
                        task.Type_Id = IdReader32("Type_Id", reader);
                        task.TypeDescription = reader["Type Description"].ToString();
                        task.Task_Status_Id = IdReader32("Task_Status_Id", reader);
                        task.Task_Status_Desc = reader["Task_Status_Desc"].ToString();

                        //   task.WorkNotes = reader["Work_Notes"].ToString();
                        task.Dev_Category_Id = IdReader32("Dev_Category_Id", reader);
                        task.Dev_Description = reader["Dev_Description"].ToString();
                        task.Dev_Stage_Id = IdReader32("Dev_Stage_Id", reader);
                        task.Dev_Type_Id = IdReader32("Dev_Type_Id", reader);
                        task.Activity_Descr = reader["Activity_Description"].ToString();
                        task.Quote_Id = reader["Quote_Id"].ToString();
                        task.Invoice_No = reader["Invoice_No"].ToString();
                        task.Amount = String.IsNullOrEmpty(reader["Amount"].ToString()) ? 0 : Convert.ToDecimal(reader["Amount"]);
                        task.GL_Account = reader["GL_Account"].ToString();
                        task.Quote_Requested = DateTimeReader(task.Quote_Requested, "Quote_Requested", reader);
                        task.Quote_Received = DateTimeReader(task.Quote_Approved, "Quote_Received", reader);
                        task.Quote_Approved = DateTimeReader(task.Quote_Approved, "Quote_Approved", reader);
                        task.Software_Delivered = DateTimeReader(task.Software_Delivered, "Software_Delivered", reader);
                        task.Software_Implemented = DateTimeReader(task.Software_Implemented, "Software_Implemented", reader);
                        task.FullReleaseRequired = reader["Full_Release_Required"] == DBNull.Value ? false : Convert.ToBoolean(reader["Full_Release_Required"]);
                        task.Declined_Date = DateTimeReader(task.Declined_Date, "Declined_Date", reader);
                        task.AnnMaintFee = String.IsNullOrEmpty(reader["AnnMaintFee"].ToString()) ? 0 : Convert.ToDecimal(reader["AnnMaintFee"]);
                        task.AnnFeeDueDate = DateTimeReader(task.AnnFeeDueDate, "AnnFeeDueDate", reader);

                        task.AXIS_Bundle_Id = IdReader32("AXIS_Bundle_Id", reader);
                        task.Axis_Owner_Id = IdReader32("AXIS_Owner_Id", reader);
                        task.AXIS_Status_Id = IdReader32("AXIS_Status_Id", reader);
                        task.AXIS_Type_Id = IdReader32("AXIS_Type_Id", reader);
                        task.Campana_Descr = reader["Campana_Descr"].ToString();
                        task.User_Descr = reader["User_Descr"].ToString();
                        task.Loaded_To_Test = DateTimeReader(task.Loaded_To_Test, "Loaded_To_Test", reader);
                        task.Loaded_To_Train = DateTimeReader(task.Loaded_To_Train, "Loaded_To_Train", reader);
                        task.Loaded_To_TrainBy = IdReader32("Loaded_To_TrainBy", reader);
                        task.Emergency_Load = reader["Emergency_Load"] == DBNull.Value ? false : Convert.ToBoolean(reader["Emergency_Load"]);
                        task.Emergency_Load_Reason = reader["Emergency_Load_Reason"].ToString();

                        task.Loaded_To_Prod = DateTimeReader(task.Loaded_To_Prod, "Loaded_To_Prod", reader);
                        task.Loaded_To_ProdBy = IdReader32("Loaded_To_ProdBy", reader);
                        task.Obsolete = reader["Obsolete"] == DBNull.Value ? false : Convert.ToBoolean(reader["Obsolete"]);
                        task.Obsolete_Reason = reader["Obsolete_Reason"].ToString();
                        task.TicketNum = reader["TicketNum"].ToString();

                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return task;
        }

        [HttpGet] //this looks like it is not being used anymore but need to test 
        public ChangeTask GetTaskByTaskId(Int64 taskid)
        {
            ChangeTask task = new ChangeTask();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeTasks";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeTaskId", taskid));
                    command.Parameters.Add(new SqlParameter("@Type", 5));
                    command.Parameters.Add(new SqlParameter("@CurrentUser", System.Environment.UserName));

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        task.Change_Record_Id = IdReader64("Change_Record_Id", reader);
                        task.Change_Task_Id = IdReader64("Change_Task_Id", reader);
                        task.External_Task_Id = Convert.ToInt32(reader["ExternalTaskId"]);
                        task.LongDesc = reader["Description"].ToString();
                        task.Assigned_To = IdReader32("Assigned_To_Id", reader);
                        task.Task_State_Id = IdReader16("State_Id", reader);
                        DateTime? createdate = null;
                        task.CreateDate = DateTimeReader(createdate, "CreateDate", reader);
                        task.CreatedBy = Convert.ToString(reader["CreatedBy"]);
                        DateTime? duedate = null;
                        task.DueDate = DateTimeReader(duedate, "Due_Date", reader);
                        DateTime? lasteditdate = null;
                        task.EditDate = DateTimeReader(lasteditdate, "LastEditDate", reader);
                        task.LastEditUser = reader["LastEditedBy"].ToString();
                        DateTime? completeddate = null;
                        task.CompleteDate = DateTimeReader(completeddate, "Completed_Date", reader);
                        DateTime? taskstartdate = null;
                        task.Task_Start_Date = DateTimeReader(taskstartdate, "Task_Start_Date", reader);
                        task.Type_Id = IdReader32("Type_Id", reader);
                        task.TypeDescription = reader["Type Description"].ToString();
                        task.Task_Status_Id = IdReader32("Task_Status_Id", reader);
                        task.Task_Status_Desc = reader["Task_Status_Desc"].ToString();

                        //    task.WorkNotes = reader["Work_Notes"].ToString();
                        task.Dev_Category_Id = IdReader32("Dev_Category_Id", reader);
                        task.Dev_Description = reader["Dev_Description"].ToString();
                        task.Dev_Stage_Id = IdReader32("Dev_Stage_Id", reader);
                        task.Dev_Type_Id = IdReader32("Dev_Type_Id", reader);
                        task.Activity_Descr = reader["Activity_Description"].ToString();
                        task.Quote_Id = reader["Quote_Id"].ToString();
                        task.Invoice_No = reader["Invoice_No"].ToString();
                        task.Amount = String.IsNullOrEmpty(reader["Amount"].ToString()) ? 0 : Convert.ToDecimal(reader["Amount"]);
                        task.GL_Account = reader["GL_Account"].ToString();
                        task.Quote_Requested = DateTimeReader(task.Quote_Requested, "Quote_Requested", reader);
                        task.Quote_Received = DateTimeReader(task.Quote_Approved, "Quote_Received", reader);
                        task.Quote_Approved = DateTimeReader(task.Quote_Approved, "Quote_Approved", reader);
                        task.Software_Delivered = DateTimeReader(task.Software_Delivered, "Software_Delivered", reader);
                        task.Software_Implemented = DateTimeReader(task.Software_Implemented, "Software_Implemented", reader);
                        task.FullReleaseRequired = reader["Full_Release_Required"] == DBNull.Value ? false : Convert.ToBoolean(reader["Full_Release_Required"]);
                        task.Declined_Date = DateTimeReader(task.Declined_Date, "Declined_Date", reader);
                        task.AnnMaintFee = String.IsNullOrEmpty(reader["AnnMaintFee"].ToString()) ? 0 : Convert.ToDecimal(reader["AnnMaintFee"]);
                        task.AnnFeeDueDate = DateTimeReader(task.AnnFeeDueDate, "AnnFeeDueDate", reader);

                        task.AXIS_Bundle_Id = IdReader32("AXIS_Bundle_Id", reader);
                        task.Axis_Owner_Id = IdReader32("AXIS_Owner_Id", reader);
                        task.AXIS_Status_Id = IdReader32("AXIS_Status_Id", reader);
                        task.AXIS_Type_Id = IdReader32("AXIS_Type_Id", reader);
                        task.Campana_Descr = reader["Campana_Descr"].ToString();
                        task.User_Descr = reader["User_Descr"].ToString();
                        task.Loaded_To_Test = DateTimeReader(task.Loaded_To_Test, "Loaded_To_Test", reader);
                        task.Loaded_To_Train = DateTimeReader(task.Loaded_To_Train, "Loaded_To_Train", reader);
                        task.Loaded_To_TrainBy = IdReader32("Loaded_To_TrainBy", reader);
                        task.Emergency_Load = reader["Emergency_Load"] == DBNull.Value ? false : Convert.ToBoolean(reader["Emergency_Load"]);
                        task.Emergency_Load_Reason = reader["Emergency_Load_Reason"].ToString();

                        task.Loaded_To_Prod = DateTimeReader(task.Loaded_To_Prod, "Loaded_To_Prod", reader);
                        task.Loaded_To_ProdBy = IdReader32("Loaded_To_ProdBy", reader);
                        task.Obsolete = reader["Obsolete"] == DBNull.Value ? false : Convert.ToBoolean(reader["Obsolete"]);
                        task.Obsolete_Reason = reader["Obsolete_Reason"].ToString();
                        task.TicketNum = reader["TicketNum"].ToString();
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return task;
        }


        [HttpGet]
        public DataTableResult<ChangeDocRecord> GetDocsAndLinksForChangeId(string id)
        {
            List<ChangeDocRecord> changeDocList = new List<ChangeDocRecord>();
            var results = new DataTableResult<ChangeDocRecord>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "SELECT * FROM Change_Docs WHERE Change_Id = @ChangeRecordId";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", id));

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        ChangeDocRecord doc = new ChangeDocRecord();
                        doc.Change_Doc_Id = Convert.ToInt32(reader["Change_Doc_Id"]);
                        doc.Change_Record_Id = Convert.ToInt32(reader["Change_Id"]);
                        doc.CreateDate = Convert.ToDateTime(reader["CreateDate"]); //.ToString("MM/dd/yyyy");
                        doc.DocLocation = Convert.ToString(reader["Doc_Location"]);
                        doc.DocTitle = Convert.ToString(reader["Doc_Title"]);
                        doc.DocType = Convert.ToString(reader["Doc_Type"]);
                        changeDocList.Add(doc);
                    }
                    results.data = changeDocList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        [HttpGet]
        public DataTableResult<ChangeRecordHistory> GetChangeRecordHistoryById(string id)
        {
            //ChangeRecordHistory changeRecordHistory = new ChangeRecordHistory();
            //var changelist = new List<ChangeRecordHistory>();
            //  var dtr = new DataTableResult<ChangeRecordDetail>(); 
            List<ChangeRecordHistory> changehistlist = new List<ChangeRecordHistory>();
            var results = new DataTableResult<ChangeRecordHistory>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetChangeHistory";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeId", id));
                    command.Parameters.Add(new SqlParameter("@SourceTable", null));

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        ChangeRecordHistory histrec = new ChangeRecordHistory();
                        histrec.Change_Record_Id = Convert.ToInt32(reader["Change_Record_Id"]);
                        histrec.ChangeDate = Convert.ToString(reader["ChangeDate"]);
                        histrec.ChangedBy = Convert.ToString(reader["Changedby"]);
                        histrec.Field = Convert.ToString(reader["Field"]).Replace("_", " ").Replace(" Id", "");
                        histrec.Source = Convert.ToString(reader["Source"]).Replace("_", " ");
                        histrec.Previous = Convert.ToString(reader["Previous"]);
                        histrec.New = Convert.ToString(reader["New"]);

                        changehistlist.Add(histrec);
                    }
                    results.data = changehistlist;
                    //changeRecord = changelist.FirstOrDefault((p) => p.Change_Num == id);
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        [HttpGet]
        public ChangeRecordEmail GetEmployeeEmail([FromUri] ChangeRecordEmail changeRecordEmail)
        {
            try
            {
                using (var connection = new SqlConnection(prodCS))
                {
                    connection.Open();
                    string sqlQuery = "Select Work_Email From Employee where Employee_Id IN (" + Convert.ToInt64(changeRecordEmail.employeeId) + ")";
                    // string sqlQuery = "Select Work_Email From Employee where Employee_Id IN (" + Convert.ToInt64(changeRecordEmail.employeeId) + "," + Convert.ToInt64(changeRecordEmail.requestedById) + ")";
                    SqlCommand command = new SqlCommand(sqlQuery, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        changeRecordEmail.email = reader["Work_Email"].ToString();
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return changeRecordEmail;
        }

        [HttpGet]
        public string GetExternalTaskId([FromUri] ChangeRecordEmail changeRecordEmail)
        {
            string extchangeTaskId = "";
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sproc = "usp_ChngMgmt_GetChangeTasks";
                    SqlCommand command = new SqlCommand(sproc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", Convert.ToInt64(changeRecordEmail.changeRecordId)));
                    command.Parameters.Add(new SqlParameter("@Type", 6));

                    SqlDataReader reader = command.ExecuteReader();


                    while (reader.Read())
                    {
                        extchangeTaskId = reader["External_Task_Id"].ToString();
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return extchangeTaskId;
        }

        [HttpGet]
        public ChangeRecordEmail AssignRecord([FromUri] ChangeRecordEmail changeRecordEmail)
        {
            var ch_rec_email = GetEmployeeEmail(changeRecordEmail);

            Uri myUri = new Uri("http://" + changeRecordEmail.serverName + "/changemanagement/views/changeapp.html#id=" + changeRecordEmail.changeRecordId);

            //Send email 
            string to = ch_rec_email.email;
            if (to != null)
            {
                string from = "appmgmt@nyaaa.com";
                MailMessage message = new MailMessage(from, to);
                message.Subject = "Change Record Assignment";
                message.Body = @"You have been assigned to Change Record " + changeRecordEmail.changeRecordId
                                + " in the Change Management Application.  You can click the link below to view the record.  \n" + myUri;
                SmtpClient client = new SmtpClient("10.196.76.9");

                // Credentials are necessary if the server requires the client 
                // to authenticate before it will send e-mail on the client's behalf.
                client.UseDefaultCredentials = true;
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    string msg = ex.Message;
                }
            }
            return ch_rec_email;
        }

        [HttpGet]
        public ChangeRecordEmail AssignTask([FromUri] ChangeRecordEmail changeRecordEmail)
        {
            Uri myUri = new Uri("http://" + changeRecordEmail.serverName + "/changemanagement/views/changeapp.html#task_id=" +
                   changeRecordEmail.changeTaskId + "&id=" + changeRecordEmail.changeRecordId +
                   "&change_task_type_id=" + changeRecordEmail.changeTask_Type_Id);

            var ch_rec_email = GetEmployeeEmail(changeRecordEmail);
            //Send email 
            string to = ch_rec_email.email;
            if (to != null)
            {
                string from = "appmgmt@nyaaa.com";
                MailMessage message = new MailMessage(from, to);
                message.Subject = "Change Task Assignment";
                message.Body = @"You have been assigned to Change Task " + changeRecordEmail.changeExternalTaskId
                                + " of Change Record " + changeRecordEmail.changeRecordId +
                                " in the Change Management Application. You can click the link below to view the task \n" + myUri;
                SmtpClient client = new SmtpClient("10.196.76.9");

                // Credentials are necessary if the server requires the client 
                // to authenticate before it will send e-mail on the client's behalf.
                client.UseDefaultCredentials = true;
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    string msg = ex.Message;
                }
            }
            return changeRecordEmail;
        }

        [HttpGet]
        public ChangeRecordEmail CompletedEmail([FromUri] ChangeRecordEmail cre)
        {
            var ch_rec_email = GetEmployeeEmail(cre);
            Uri myUri = new Uri("http://" + cre.serverName + "/changeManagement/views/changeapp.html#id=" + cre.changeRecordId);
            //Send email 
            string to = ch_rec_email.email;
            if (to != null)
            {
                string from = "appmgmt@nyaaa.com";
                MailMessage message = new MailMessage(from, to);
                message.Subject = "Change Record Completed";
                message.Body = @"Change Record " + cre.changeRecordId + " in the Change Manager application has been Completed. "
                 + "You can click the link below to view the record.  \n" + myUri;
                SmtpClient client = new SmtpClient("10.196.76.9");

                // Credentials are necessary if the server requires the client 
                // to authenticate before it will send e-mail on the client's behalf.
                client.UseDefaultCredentials = true;
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    string msg = ex.Message;
                }
            }
            return ch_rec_email;
        }

        [HttpGet]
        public ChangeRecordEmail AssessedEmail([FromUri] ChangeRecordEmail cre)
        {
            var ch_rec_email = GetEmployeeEmail(cre);
            Uri myUri = new Uri("http://" + cre.serverName + "/changeManagement/views/changeapp.html#id=" + cre.changeRecordId);

            //Send email 
            string to = ch_rec_email.email;
            if (to != null)
            {
                string from = "appmgmt@nyaaa.com";
                MailMessage message = new MailMessage(from, to);
                message.Subject = "Change Record Assessed";
                message.Body = @"Change Record " + cre.changeRecordId + " in the Change Manager application has been Assessed. "
                 + "You can click the link below to view the record.  \n" + myUri;
                SmtpClient client = new SmtpClient("10.196.76.9");

                // Credentials are necessary if the server requires the client 
                // to authenticate before it will send e-mail on the client's behalf.
                client.UseDefaultCredentials = true;
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    string msg = ex.Message;
                }
            }
            return ch_rec_email;
        }

        [HttpGet]
        public ChangeRecordEmail ClosedEmail([FromUri] ChangeRecordEmail cre)
        {
            var assignedto = GetEmployeeEmail(cre);
            //  var requestedby = GetEmployeeEmail(cre);
            Uri myUri = new Uri("http://" + cre.serverName + "/changeManagement/views/changeapp.html#id=" + cre.changeRecordId);

            //Send email 
            // string[] to = {assignedto.email , requestedby.email};
            string[] to = { assignedto.email };
            if (to != null)
            {
                string from = "appmgmt@nyaaa.com";

                MailMessage message = new MailMessage();
                foreach (var m in to)
                {
                    message.To.Add(m);
                    message.From = new MailAddress(from);
                    message.Subject = "Change Record Closed";
                    message.Body = @"Change Record " + cre.changeRecordId + " in the Change Manager application has been Closed.";
                    // + You can click the link below to view the record.  \n" + myUri;
                    SmtpClient client = new SmtpClient("10.196.76.9");
                    // Credentials are necessary if the server requires the client 
                    // to authenticate before it will send e-mail on the client's behalf.
                    client.UseDefaultCredentials = true;
                    try
                    {
                        client.Send(message);
                    }
                    catch (Exception ex)
                    {
                        string msg = ex.Message;
                    }
                }

            }
            return assignedto;
        }

        [HttpGet]
        public DataTableResult<StrategicInitiatives> GetStrategicInitiatives(int Type)
        {
            var siList = new List<StrategicInitiatives>();
            var dtr = new DataTableResult<StrategicInitiatives>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetStrategicInitiatives";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        StrategicInitiatives si = new StrategicInitiatives();
                        si.Strategic_Id = Convert.ToInt32(reader["Strategic_Id"]);
                        si.Strategic_Title = reader["Strategic_Title"].ToString();
                        si.Strategic_CreatedBy = System.Environment.UserName;
                        si.Strategic_Descr = reader["Strategic_Descr"].ToString();
                        si.Strategic_FiscalYear = reader["Strategic_FiscalYear"].ToString();
                        si.Strategic_Owner = reader["Strategic_Owner"].ToString();
                        si.Strategic_Active = Convert.ToBoolean(reader["Strategic_Active"]);

                        siList.Add(si);
                    }
                    dtr.data = siList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return dtr;
        }

        [HttpGet]
        public StrategicInitiatives GetStrategicInitiativesById(int Type, int Id)
        {
            var si = new StrategicInitiatives();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetStrategicInitiatives";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    command.Parameters.Add(new SqlParameter("@Strategic_Id", Id));
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        si.Strategic_Id = Convert.ToInt32(reader["Strategic_Id"]);
                        si.Strategic_Title = reader["Strategic_Title"].ToString();
                        si.Strategic_CreatedBy = reader["Strategic_CreatedBy"].ToString();
                        si.Strategic_Descr = reader["Strategic_Descr"].ToString();
                        si.Strategic_FiscalYear = reader["Strategic_FiscalYear"].ToString();
                        si.Strategic_Owner = reader["Strategic_Owner"].ToString();
                        si.Strategic_Active = Convert.ToBoolean(reader["Strategic_Active"]);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return si;
        }

        [HttpGet]
        public DataTableResult<Project> Get_Projects(int Type)
        {
            var pList = new List<Project>();
            var dtr = new DataTableResult<Project>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_Get_Projects";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        Project p = new Project();
                        p.Project_Id = Convert.ToInt32(reader["Project_Id"]);
                        p.Project_Title = reader["Project_Title"].ToString();
                        p.Project_CreatedBy = reader["Project_CreatedBy"].ToString();
                        p.Project_Descr = reader["Project_Descr"].ToString();
                        p.Project_FiscalYear = reader["Project_FiscalYear"].ToString();
                        p.Project_Owner = reader["Project_Owner"].ToString();
                        p.Project_Completed = Convert.ToBoolean(reader["Project_Completed"]);
                        p.Project_Start_Date = DateTimeReader(p.Project_Start_Date, "Project_Start_Date", reader);
                        p.Project_End_Date = DateTimeReader(p.Project_End_Date, "Project_End_Date", reader);
                        p.Project_Status_Id = Convert.ToInt32(reader["Project_Status_Id"]);
                        p.Project_Status_Descr = reader["Project_Status_Descr"].ToString();
                        p.Project_Bus_Line_Id = Convert.ToInt32(reader["Project_Bus_Line_Id"]);
                        p.Change_Bus_Descr = reader["Change_Bus_Descr"].ToString();


                        pList.Add(p);
                    }
                    dtr.data = pList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return dtr;
        }

        [HttpGet]
        public Project Get_Projects_By_Id(int Type, int Id)
        {
            var p = new Project();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_Get_Projects";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    command.Parameters.Add(new SqlParameter("@Project_Id", Id));
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        p.Project_Id = Convert.ToInt32(reader["Project_Id"]);
                        p.Project_Title = reader["Project_Title"].ToString();
                        p.Project_CreatedBy = reader["Project_CreatedBy"].ToString();
                        p.Project_Descr = reader["Project_Descr"].ToString();
                        p.Project_FiscalYear = reader["Project_FiscalYear"].ToString();
                        p.Project_Owner = reader["Project_Owner"].ToString();
                        p.Project_Completed = Convert.ToBoolean(reader["Project_Completed"]);
                        p.Project_Start_Date = DateTimeReader(p.Project_Start_Date, "Project_Start_Date", reader);
                        p.Project_End_Date = DateTimeReader(p.Project_End_Date, "Project_End_Date", reader);
                        p.Project_Status_Id = Convert.ToInt32(reader["Project_Status_Id"]);
                        p.Project_Bus_Line_Id = Convert.ToInt32(reader["Project_Bus_Line_Id"]);
                        p.Change_Bus_Descr = reader["Change_Bus_Descr"].ToString();
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return p;
        }

        [HttpGet]
        public DataTableResult<ProjectCR> GetProjectsById_CR(string projectId)
        {
            var pList = new List<ProjectCR>();
            var dtr = new DataTableResult<ProjectCR>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetProjectsById_CR";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@OtherSourceVal", projectId));

                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        ProjectCR p = new ProjectCR();
                        p.Project_Id = String.IsNullOrEmpty(reader["Project_Id"].ToString()) ? 0 : Convert.ToInt64(reader["Project_Id"]);
                        p.Project_Title = reader["Project_Title"].ToString();
                        p.Change_Record_Id = String.IsNullOrEmpty(reader["Change_Record_Id"].ToString()) ? 0 : Convert.ToInt64(reader["Change_Record_Id"]);
                        p.Change_Short_Desc = reader["Change_Short_Desc"].ToString();
                        pList.Add(p);
                    }

                    dtr.data = pList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return dtr;
        }

        [HttpGet]
        public DataTableResult<StrategicCR> GetStrateicInitiativesById_CR(string strategicId)
        {
            var sList = new List<StrategicCR>();
            var dtr = new DataTableResult<StrategicCR>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_GetStrategicInitiativesById_CR";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@OtherSourceVal", strategicId));

                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        StrategicCR s = new StrategicCR();
                        s.Strategic_Id = String.IsNullOrEmpty(reader["Strategic_Id"].ToString()) ? 0 : Convert.ToInt64(reader["Strategic_Id"]);
                        s.Strategic_Title = reader["Strategic_Title"].ToString();
                        s.Change_Record_Id = String.IsNullOrEmpty(reader["Change_Record_Id"].ToString()) ? 0 : Convert.ToInt64(reader["Change_Record_Id"]);
                        s.Change_Short_Desc = reader["Change_Short_Desc"].ToString();
                        sList.Add(s);
                    }
                    dtr.data = sList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return dtr;
        }

        [HttpGet]
        public DataTableResult<ChangeRecordDetail> GetChangeRecordsFiltered([FromUri] ChangeRecordFilter changeRecordFilter)
        {
            List<ChangeRecordDetail> CR_List = new List<ChangeRecordDetail>();
            var dtr = new DataTableResult<ChangeRecordDetail>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_Filter";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;

                    if (changeRecordFilter.Change_Record_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Change_Record_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Change_Record_Id", "('" + changeRecordFilter.Change_Record_Id + "')"));

                    if (changeRecordFilter.Change_Status_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Change_Status_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Change_Status_Id", "('" + changeRecordFilter.Change_Status_Id + "')"));

                    if (changeRecordFilter.Change_Type_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Change_Type_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Change_Type_Id", "('" + changeRecordFilter.Change_Type_Id + "')"));

                    if (changeRecordFilter.Bus_Line_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Bus_Line_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Bus_Line_Id", "('" + changeRecordFilter.Bus_Line_Id + "')"));

                    if (changeRecordFilter.Business_Priority_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Business_Priority_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Business_Priority_Id", "('" + changeRecordFilter.Business_Priority_Id + "')"));

                    if (changeRecordFilter.Requested_By_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Requested_By_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Requested_By_Id", "('" + changeRecordFilter.Requested_By_Id + "')"));

                    //if (changeRecordFilter.Assigned_To_Id.Count == 0)
                    //    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", "NONE"));
                    //else
                    //    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", "('" + changeRecordFilter.Assigned_To_Id + "')"));

                    if (changeRecordFilter.Assigned_To_Id == 0)
                        command.Parameters.Add(new SqlParameter("@Assigned_To_Id", "NONE"));
                    else
                        command.Parameters.Add(new SqlParameter("@Assigned_To_Id", "('" + changeRecordFilter.Assigned_To_Id + "')"));

                    if (changeRecordFilter.BegCreateDate >= Convert.ToDateTime("1/1/1753") && changeRecordFilter.BegCreateDate <= Convert.ToDateTime("12/31/9999"))
                        command.Parameters.Add(new SqlParameter("@BegCreateDate", changeRecordFilter.BegCreateDate));
                    else
                        command.Parameters.Add(new SqlParameter("@BegCreateDate", DBNull.Value));

                    if (changeRecordFilter.EndCreateDate >= Convert.ToDateTime("1/1/1753") && changeRecordFilter.EndCreateDate <= Convert.ToDateTime("12/31/9999"))
                        command.Parameters.Add(new SqlParameter("@EndCreateDate", changeRecordFilter.EndCreateDate));
                    else
                        command.Parameters.Add(new SqlParameter("@EndCreateDate", DBNull.Value));

                    if (changeRecordFilter.BegDueDate >= Convert.ToDateTime("1/1/1753") && changeRecordFilter.BegDueDate <= Convert.ToDateTime("12/31/9999"))
                        command.Parameters.Add(new SqlParameter("@BegDueDate", changeRecordFilter.BegDueDate));
                    else
                        command.Parameters.Add(new SqlParameter("@BegDueDate", DBNull.Value));

                    if (changeRecordFilter.EndDueDate >= Convert.ToDateTime("1/1/1753") && changeRecordFilter.EndDueDate <= Convert.ToDateTime("12/31/9999"))
                        command.Parameters.Add(new SqlParameter("@EndDueDate", changeRecordFilter.EndDueDate));
                    else
                        command.Parameters.Add(new SqlParameter("@EndDueDate", DBNull.Value));

                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        ChangeRecordDetail crd = new ChangeRecordDetail();
                        crd.Change_Record_Id = IdReader64("Change_Record_Id", reader);
                        crd.Change_Short_Desc = reader["Change_Short_Desc"].ToString();
                        crd.Status = reader["Status_Desc"].ToString();
                        crd.Type = reader["Type_Description"].ToString();
                        crd.Business_Priority = reader["Priority_Desc"].ToString();
                        crd.Change_Bus_Descr = reader["Change_Bus_Descr"].ToString();

                        crd.RequestedByName = reader["Requested By"].ToString();
                        crd.AssignedTo = reader["Assigned To"].ToString();

                        CR_List.Add(crd);
                    }
                    dtr.data = CR_List;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return dtr;
        }

        //This method gets all CHANGE TASK COMMENTS from the Change_Comment table 
        [HttpGet]
        public DataTableResult<Change_Comments> GetComments(int cr_id, int ct_task_id)
        {
            List<Change_Comments> commentList = new List<Change_Comments>();
            var results = new DataTableResult<Change_Comments>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sproc = "usp_ChngMgmt_GetComments";

                    SqlCommand command = new SqlCommand(sproc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", cr_id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_id", ct_task_id));
                    command.Parameters.Add(new SqlParameter("@Type", 1));
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        Change_Comments ct = new Change_Comments();
                        ct.Comments = reader["Comments"].ToString();
                        ct.TypeDescription = reader["Type_Description"].ToString();
                        ct.CreatedBy = reader["CreatedBy"].ToString();
                        ct.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);
                        ct.ExternalTaskId = Convert.ToInt32(reader["ExternalTaskId"]);
                        commentList.Add(ct);
                    }
                    results.data = commentList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        //This method gets ALL COMMENTS from Change_Comments table
        [HttpGet]
        public DataTableResult<Change_Comments> GetAllComments(int cr_id)
        {
            List<Change_Comments> commentList = new List<Change_Comments>();
            var results = new DataTableResult<Change_Comments>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sproc = "usp_ChngMgmt_GetComments";

                    SqlCommand command = new SqlCommand(sproc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", cr_id));
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        Change_Comments ct = new Change_Comments();
                        ct.Comments = reader["Comments"].ToString();
                        ct.TypeDescription = reader["Type_Description"].ToString();
                        ct.CreatedBy = reader["CreatedBy"].ToString();
                        ct.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);
                        ct.Change_Record_Id = Convert.ToInt64(reader["Change_Record_Id"]);
                        ct.ExternalTaskId = String.IsNullOrEmpty(reader["ExternalTaskId"].ToString()) ? 0 : Convert.ToInt32(reader["ExternalTaskId"]);
                        ct.Type_Id = Convert.ToInt32(reader["Type_Id"]);
                        ct.Change_Task_Id = Convert.ToInt64(reader["Change_Task_Id"]);
                        commentList.Add(ct);
                    }
                    results.data = commentList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        //This method gets all the ASSESSMENT comments from the Change_Comment table 
        [HttpGet]
        public DataTableResult<Change_Comments> GetAssessComments(int cr_id)
        {
            List<Change_Comments> commentList = new List<Change_Comments>();
            var results = new DataTableResult<Change_Comments>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT * FROM Change_Comments CC" +
                        " JOIN  Task_Type TT ON TT.Type_Id = CC.Type_Id" +
                        " WHERE CC.Type_Id= " + 4 +
                        " AND Change_Record_Id = " + cr_id;
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        Change_Comments cc = new Change_Comments();
                        cc.Comments = reader["Comments"].ToString();
                        cc.TypeDescription = reader["Type_Description"].ToString();
                        cc.CreatedBy = reader["CreatedBy"].ToString();
                        cc.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);
                        cc.Change_Record_Id = Convert.ToInt64(reader["Change_Record_Id"]);
                        cc.Change_Task_Id = Convert.ToInt64(reader["Change_Task_Id"]);
                        commentList.Add(cc);
                    }
                    results.data = commentList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        //This method gets the DETAILS and IMPLEMENTATION comments from the Change_Comment table 
        [HttpGet]
        public DataTableResult<Change_Comments> GetComments2(int cr_id, int ct_type_id)
        {
            List<Change_Comments> commentList = new List<Change_Comments>();
            var results = new DataTableResult<Change_Comments>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sql = "SELECT * FROM Change_Comments CC" +
                        " JOIN  Task_Type TT ON TT.Type_Id = CC.Type_Id" +
                        " WHERE CC.Type_Id= " + ct_type_id +
                        " AND Change_Record_Id = " + cr_id;
                    SqlCommand command = new SqlCommand(sql, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        Change_Comments ct = new Change_Comments();
                        ct.Comments = reader["Comments"].ToString();
                        ct.TypeDescription = reader["Type_Description"].ToString();
                        ct.CreatedBy = reader["CreatedBy"].ToString();
                        ct.CreatedDate = Convert.ToDateTime(reader["CreatedDate"]);
                        ct.Change_Record_Id = Convert.ToInt64(reader["Change_Record_Id"]);
                        ct.Change_Task_Id = reader["Change_Task_Id"] != DBNull.Value ? Convert.ToInt64(reader["Change_Task_Id"]) : 0;
                        commentList.Add(ct);
                    }
                    results.data = commentList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return results;
        }

        [HttpGet]
        public DataTableResult<AXIS_Bundle> Get_AXIS_Bundle_Rpts()
        {
            var bundleList = new List<AXIS_Bundle>();
            var dtr = new DataTableResult<AXIS_Bundle>();
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_Get_AXIS_Bundle_Rpts";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;        
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        AXIS_Bundle axb = new AXIS_Bundle();
                        axb.AXIS_Bundle_Id = Convert.ToInt64(reader["AXIS_Bundle_Id"]);
                        axb.User_Descr = reader["User_Descr"].ToString();
                        axb.Change_Record_Id = Convert.ToInt64(reader["Change_Record_Id"]);
                        axb.L_to_Test = DateTimeReader(axb.L_to_Test, "Loaded_To_Test", reader);
                        axb.L_to_Train = DateTimeReader(axb.L_to_Train, "Loaded_To_Train", reader);
                        axb.L_to_Prod = DateTimeReader(axb.L_to_Prod, "Loaded_To_Prod", reader);          
                        axb.AXIS_Status_Descr = reader["AXIS_Status_Descr"].ToString();
                        axb.Long_Desc = reader["Long_Desc"].ToString();
                        axb.Last_First = reader["Last_First"].ToString();
                        axb.Change_Task_Id = Convert.ToInt64(reader["Change_Task_Id"]);
                        axb.Type_Id = Convert.ToInt32(reader["Type_Id"]);
                        axb.ExternalTaskId = Convert.ToInt64(reader["ExternalTaskId"]);
                        axb.Obsolete = String.IsNullOrEmpty(reader["Obsolete"].ToString()) ? false : Convert.ToBoolean(reader["Obsolete"]);
                        bundleList.Add(axb);
                    }
                    dtr.data = bundleList;
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return dtr;
        }

        #endregion End HTTP GET

        #region HTTP POST

        [HttpPost]
        public long PostChangeRecord(ChangeRecordDetail properties)
        {
            long newid = 0L;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeRecord";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Deleted", false));
                    //   command.Parameters.Add(new SqlParameter("@Closed", false));
                    command.Parameters.Add(new SqlParameter("@Change_Short_Desc", properties.Change_Short_Desc));
                    command.Parameters.Add(new SqlParameter("@Requested_By_Id", properties.Requested_By_Id));
                    command.Parameters.Add(new SqlParameter("@Bus_Implementation_Deadline", properties.Bus_Implementation_Deadline));
                    command.Parameters.Add(new SqlParameter("@Bus_Line_Approver_Id", properties.Bus_Line_Approver_Id));
                    //    command.Parameters.Add(new SqlParameter("@Bus_Line_Contact_Id", properties.Bus_Line_Contact_Id));
                    command.Parameters.Add(new SqlParameter("@Business_Priority_Id", properties.Business_Priority_Id));
                    command.Parameters.Add(new SqlParameter("@Business_Impact_Id", properties.Business_Impact_Id));
                    command.Parameters.Add(new SqlParameter("@Business_Impact_Description ", properties.Business_Impact_Description));
                    command.Parameters.Add(new SqlParameter("@Bus_NonImplement_Effects", properties.Bus_NonImplement_Effects));
                    command.Parameters.Add(new SqlParameter("@Business_Case", properties.Business_Case));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties.Assigned_To_Id));
                    command.Parameters.Add(new SqlParameter("@Service_Owner_Id", properties.Service_Owner_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Impact_Id", properties.Change_Impact_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Risk", properties.Change_Risk_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Priority_Id", properties.Change_Priority_Id));
                    command.Parameters.Add(new SqlParameter("@Category_Id", properties.Category_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Type_Id", properties.Change_Type_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Status_Id", properties.Change_Status_Id));
                    command.Parameters.Add(new SqlParameter("@SourceType", properties.SourceType));
                    command.Parameters.Add(new SqlParameter("@SourceVal", properties.SourceVal));
                    command.Parameters.Add(new SqlParameter("@OtherSourceType", properties.OtherSourceType));
                    command.Parameters.Add(new SqlParameter("@OtherSourceVal", properties.OtherSourceVal));
                    command.Parameters.Add(new SqlParameter("@Source_Original_Date", properties.Source_Original_Date));
                    command.Parameters.Add(new SqlParameter("@Change_Long_Desc", properties.Change_Long_Desc));
                    command.Parameters.Add(new SqlParameter("@Change_NonImplement_Effect", properties.Change_NonImplement_Effect));
                    //      command.Parameters.Add(new SqlParameter("@Comments", properties.Comments));
                    //      command.Parameters.Add(new SqlParameter("@Technical_Assessment", properties.Technical_Assessment));
                    command.Parameters.Add(new SqlParameter("@Test_Plan", properties.TestPlan));
                    command.Parameters.Add(new SqlParameter("@Change_Plan", properties.ChangePlan));
                    command.Parameters.Add(new SqlParameter("@Backout_Plan", properties.BackoutPlan));
                    command.Parameters.Add(new SqlParameter("@PlannedStartDate", properties.PlannedStartDate));
                    command.Parameters.Add(new SqlParameter("@PlannedEndDate", properties.PlannedEndDate));
                    command.Parameters.Add(new SqlParameter("@WorkStartDate", properties.WorkStartDate));
                    command.Parameters.Add(new SqlParameter("@WorkEndDate", properties.WorkEndDate));
                    command.Parameters.Add(new SqlParameter("@Change_Completed_By", properties.Change_Completed_By));
                    command.Parameters.Add(new SqlParameter("@Change_Completed_Date", properties.Change_Completed_Date));
                    command.Parameters.Add(new SqlParameter("@Change_Start_Date", properties.Change_Start_Date));
                    command.Parameters.Add(new SqlParameter("@Request_By_Date", properties.Request_By_Date));
                    command.Parameters.Add(new SqlParameter("@Resources", properties.Resources));
                    command.Parameters.Add(new SqlParameter("@Post_Review_Completed_Date", properties.PostReviewCompletedDate));
                    command.Parameters.Add(new SqlParameter("@Post_Review_Completed_By_Id", properties.PostReviewCompletedBy_Id));
                    //  command.Parameters.Add(new SqlParameter("@Change_Stage_Id", properties.Change_Stage_Id));  
                    command.Parameters.Add(new SqlParameter("@AssessmentBy_Id", properties.AssessmentBy_Id));
                    command.Parameters.Add(new SqlParameter("@AssessmentBy_Date", properties.AssessmentBy_Date));
                    command.Parameters.Add(new SqlParameter("@Bus_Line_Id", properties.Bus_Line_Id));
                    command.Parameters.Add(new SqlParameter("@RejectReason", properties.RejectReason));
                    command.Parameters.Add(new SqlParameter("@Approval_By", properties.Approval_By));
                    command.Parameters.Add(new SqlParameter("@Approval_Date", properties.Approval_Date));
                    command.Parameters.Add(new SqlParameter("@Reject_Reason_Id", properties.Reject_Reason_Id));

                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        newid = Convert.ToInt64(reader["Id"].ToString());
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return newid;
        }

        [HttpPost]
        public void PostChangeDocument(ChangeDocRecord properties)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    string title = properties.DocTitle;
                    if (title == null)
                    {

                    }
                    connection.Open();
                    string insertCmd = "INSERT INTO Change_Docs(Change_Id, Doc_Title, Doc_Type, Doc_Location, CreateDate) VALUES(@Change_Id,@Doc_Title, @Doc_Type,@Doc_Location, @CreateDate)";
                    SqlCommand command = new SqlCommand(insertCmd, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SqlParameter("@Change_Id", properties.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Doc_Title", properties.DocTitle));
                    command.Parameters.Add(new SqlParameter("@Doc_Type", properties.DocType));
                    command.Parameters.Add(new SqlParameter("Doc_Location", properties.DocLocation));
                    command.Parameters.Add(new SqlParameter("@CreateDate", DateTime.Now));

                    command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public long PostChangeTask(ChangeTask properties)
        {
            long newid = 0L;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties.Change_Task_Id));
                    command.Parameters.Add(new SqlParameter("@Long_Desc", properties.LongDesc));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties.Assigned_To));
                    command.Parameters.Add(new SqlParameter("@Ch_Task_State_Id", properties.Task_State_Id));
                    command.Parameters.Add(new SqlParameter("@Completed_Date", properties.CompleteDate));
                    command.Parameters.Add(new SqlParameter("@Task_Start_Date", properties.Task_Start_Date));
                    command.Parameters.Add(new SqlParameter("@Due_Date", properties.DueDate));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties.Type_Id));
                    command.Parameters.Add(new SqlParameter("@Task_Status_Id", properties.Task_Status_Id));
                    command.Parameters.Add(new SqlParameter("@Dev_Type_Id", properties.Dev_Type_Id));
                    command.Parameters.Add(new SqlParameter("@Dev_Description", properties.Dev_Description));
                    command.Parameters.Add(new SqlParameter("@Activity_Description", properties.Activity_Descr));
                    command.Parameters.Add(new SqlParameter("@Dev_Category_Id", properties.Dev_Category_Id));
                    command.Parameters.Add(new SqlParameter("@Dev_Stage_Id", properties.Dev_Stage_Id));
                    command.Parameters.Add(new SqlParameter("@Quote_Id", properties.Quote_Id));
                    command.Parameters.Add(new SqlParameter("@Amount", properties.Amount));
                    command.Parameters.Add(new SqlParameter("@Quote_Received", properties.Quote_Received));
                    command.Parameters.Add(new SqlParameter("@Quote_Requested", properties.Quote_Requested));
                    command.Parameters.Add(new SqlParameter("@Quote_Approved", properties.Quote_Approved));
                    command.Parameters.Add(new SqlParameter("@Software_Delivered", properties.Software_Delivered));
                    command.Parameters.Add(new SqlParameter("@Software_Implemented", properties.Software_Implemented));
                    command.Parameters.Add(new SqlParameter("@Invoice_No", properties.Invoice_No));
                    command.Parameters.Add(new SqlParameter("@GL_Account", properties.GL_Account));
                    command.Parameters.Add(new SqlParameter("@Full_Release_Required", properties.FullReleaseRequired));
                    command.Parameters.Add(new SqlParameter("@Declined_Date", properties.Declined_Date));
                    command.Parameters.Add(new SqlParameter("@AnnMaintFee", properties.AnnMaintFee));
                    command.Parameters.Add(new SqlParameter("@AnnFeeDueDate", properties.AnnFeeDueDate));
                    command.Parameters.Add(new SqlParameter("@AXIS_Type_Id", properties.AXIS_Type_Id));
                    command.Parameters.Add(new SqlParameter("@AXIS_Status_Id", properties.AXIS_Status_Id));
                    command.Parameters.Add(new SqlParameter("@Campana_Descr", properties.Campana_Descr));
                    command.Parameters.Add(new SqlParameter("@User_Descr", properties.User_Descr));
                    command.Parameters.Add(new SqlParameter("@Axis_Owner_Id", properties.Axis_Owner_Id));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_Test", properties.Loaded_To_Test));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_Train", properties.Loaded_To_Train));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_TrainBy", properties.Loaded_To_TrainBy));
                    command.Parameters.Add(new SqlParameter("@Emergency_Load", properties.Emergency_Load));
                    command.Parameters.Add(new SqlParameter("@Emergency_Load_Reason", properties.Emergency_Load_Reason));
                  
                    command.Parameters.Add(new SqlParameter("@Loaded_To_Prod", properties.Loaded_To_Prod));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_ProdBy", properties.Loaded_To_ProdBy));
                    command.Parameters.Add(new SqlParameter("@Obsolete", properties.Obsolete));
                    command.Parameters.Add(new SqlParameter("@Obsolete_Reason", properties.Obsolete_Reason));
                    command.Parameters.Add(new SqlParameter("@TicketNum", properties.TicketNum));


                    //Get the new Change_Task_Id
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        newid = Convert.ToInt64(reader["Id"].ToString());
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return newid;
        }

        [HttpPost]
        public long PostChangeTask2(ChangeTask properties3)
        {
            long newid = 0L;

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties3.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties3.Change_Task_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName)); // user.identity.name
                    command.Parameters.Add(new SqlParameter("@Long_Desc", properties3.LongDesc));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties3.Assigned_To));
                    command.Parameters.Add(new SqlParameter("@Completed_Date", properties3.CompleteDate));
                    command.Parameters.Add(new SqlParameter("@Due_Date", properties3.DueDate));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties3.Type_Id));
                    command.Parameters.Add(new SqlParameter("@Task_Status_Id", properties3.Task_Status_Id));

                    //Get the new Change_Task_Id
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        newid = Convert.ToInt64(reader["Id"].ToString());
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return newid;
        }

        [HttpPost]
        public long PostChangeTask3(ChangeTask properties3)
        {
            long newid = 0L;

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties3.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties3.Change_Task_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName)); // user.identity.name
                    command.Parameters.Add(new SqlParameter("@Long_Desc", properties3.LongDesc));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties3.Assigned_To));
                    command.Parameters.Add(new SqlParameter("@Completed_Date", properties3.CompleteDate));
                    command.Parameters.Add(new SqlParameter("@Due_Date", properties3.DueDate));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties3.Type_Id));
                    command.Parameters.Add(new SqlParameter("@Task_Status_Id", properties3.Task_Status_Id));

                    //Get the new Change_Task_Id
                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        newid = Convert.ToInt64(reader["Id"].ToString());
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return newid;
        }

        [HttpPost]
        public FileMessages GetUploadPath(string changeid)
        {
            FileMessages fm = new FileMessages();
            if (Convert.ToInt32(changeid) <= 0)
            {
                fileSavePath = "ERROR: Must Save Change Record prior to being able to attach related files.";
            }
            else
            {
                if (HttpContext.Current.Request.Files.AllKeys.Any())
                {
                    string documentsPath = "";
                    //create connection to get path info
                    try
                    {
                        using (var connection = new SqlConnection(connectionString))
                        {
                            connection.Open();
                            string storedProc = "usp_ChngMgmt_GetDocsPath";
                            SqlCommand command = new SqlCommand(storedProc, connection);
                            command.CommandType = CommandType.StoredProcedure;
                            SqlDataReader reader = command.ExecuteReader();
                            while (reader.Read())
                            {
                                documentsPath = Convert.ToString(reader[0]);
                            }
                            connection.Close();

                        }

                        if (documentsPath != "")
                        {
                            documentsPath += changeid.ToString() + @"\";
                        }

                        if (!Directory.Exists(documentsPath))
                        {
                            Directory.CreateDirectory(documentsPath);
                        }
                    }
                    catch (Exception e)
                    {
                        string msg = e.Message;
                    }

                    // Get the file info from the Files collection
                    var httpPostedFile = HttpContext.Current.Request.Files["UploadedFile"];

                    //Get just the filename from the path
                    filenameCS = "@" + httpPostedFile.FileName;
                    filename = Path.GetFileName(filenameCS);

                    if (httpPostedFile != null)
                    {
                        //Save the document path and filename
                        fm.fileSavePath = documentsPath + filename;
                        if (File.Exists(fm.fileSavePath))
                            fm.confirmMessage = "This file already exists.  Do you want to overwrite it?";
                        else
                            fm.confirmMessage = "";
                    }
                }
            }
            return fm;
        }

        [HttpPost]
        public string UploadFile(string fileSavePath)
        {
            string result = "";
            try
            {
                var httpPostedFile = HttpContext.Current.Request.Files["UploadedFile"];
                httpPostedFile.SaveAs(fileSavePath);
                return result;
            }
            catch (Exception e)
            {
                return "ERROR: " + e.Message.ToString();
            }
        }

        [HttpPost]
        public void AddChangeHistoryRecord(ChangeRecordHistory properties)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string insertCmd = "INSERT INTO Change_History (Change_Record_Id, Source_Table, Source_Field, OldValue, NewValue,  ChangeDate, CreatedBy, isAudit) " +
                                        "VALUES(@Change_Record_Id, @Source_Table, @Source_Field, @OldValue, @NewValue, @ChangeDate, @CreatedBy, 1)";

                    SqlCommand command = new SqlCommand(insertCmd, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Source_Table", properties.Source));
                    command.Parameters.Add(new SqlParameter("@Source_Field", properties.Field));
                    command.Parameters.Add(new SqlParameter("@OldValue", properties.Previous));
                    command.Parameters.Add(new SqlParameter("@NewValue", properties.New));
                    command.Parameters.Add(new SqlParameter("@ChangeDate", properties.ChangeDate));
                    command.Parameters.Add(new SqlParameter("@CreatedBy", System.Environment.UserName));

                    command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        public long PostStrategicInitiative(StrategicInitiatives si)
        {
            var strategic_Id = 0L;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdate_StrategicInitiatives";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Strategic_Id", si.Strategic_Id));
                    command.Parameters.Add(new SqlParameter("@Strategic_Title", si.Strategic_Title));
                    command.Parameters.Add(new SqlParameter("@Strategic_CreatedBy", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Strategic_FiscalYear", si.Strategic_FiscalYear));
                    command.Parameters.Add(new SqlParameter("@Strategic_Owner", si.Strategic_Owner));
                    command.Parameters.Add(new SqlParameter("@Strategic_Active", si.Strategic_Active));
                    command.Parameters.Add(new SqlParameter("@Strategic_Descr", si.Strategic_Descr));

                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        strategic_Id = Convert.ToInt64(reader["Id"].ToString());
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return strategic_Id;
        }

        [HttpPost]
        public long PostProject(Project p)
        {
            var project_Id = 0L;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdate_Projects";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Project_Id", p.Project_Id));
                    command.Parameters.Add(new SqlParameter("@Project_Title", p.Project_Title));
                    command.Parameters.Add(new SqlParameter("@Project_CreatedBy", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Project_FiscalYear", p.Project_FiscalYear));
                    command.Parameters.Add(new SqlParameter("@Project_Owner", p.Project_Owner));
                    command.Parameters.Add(new SqlParameter("@Project_Completed", p.Project_Completed));
                    command.Parameters.Add(new SqlParameter("@Project_Descr", p.Project_Descr));
                    command.Parameters.Add(new SqlParameter("@Project_Start_Date", p.Project_Start_Date));
                    command.Parameters.Add(new SqlParameter("@Project_End_Date", p.Project_End_Date));
                    command.Parameters.Add(new SqlParameter("@Project_Status_Id", p.Project_Status_Id));
                    command.Parameters.Add(new SqlParameter("@Project_Bus_Line_Id", p.Project_Bus_Line_Id));

                    SqlDataReader reader = command.ExecuteReader();
                    while (reader.Read())
                    {
                        project_Id = Convert.ToInt64(reader["Id"].ToString());
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }

            return project_Id;
        }

        [HttpPost]
        public void PostTaskComment(Change_Comments properties1)
        {
            // var task_comment_Id = 0L;
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string sproc = "usp_ChngMgmt_Add_TaskComment";
                    SqlCommand command = new SqlCommand(sproc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Comments", properties1.Comments));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties1.Type_Id));
                    command.Parameters.Add(new SqlParameter("@CreatedBy", properties1.CreatedBy));
                    command.Parameters.Add(new SqlParameter("@CreatedDate", properties1.CreatedDate));
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties1.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties1.Change_Task_Id));
                    SqlDataReader reader = command.ExecuteReader();
                    //while (reader.Read())
                    //{
                    //    task_comment_Id= Convert.ToInt64(reader["Id"].ToString());
                    //}
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            // return task_comment_Id;
        }

        #endregion END HTTP POST

        #region HTTP PUT
        [HttpPut]
        public void UpdateChangeRecord(ChangeRecordDetail properties)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeRecord";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName));// System.Web.HttpContext.Current.User.Identity.Name
                    command.Parameters.Add(new SqlParameter("@Deleted", false));
                    //    command.Parameters.Add(new SqlParameter("@Closed", false));
                    command.Parameters.Add(new SqlParameter("@Change_Short_Desc", properties.Change_Short_Desc));
                    command.Parameters.Add(new SqlParameter("@Requested_By_Id", properties.Requested_By_Id));
                    command.Parameters.Add(new SqlParameter("@Bus_Implementation_Deadline", properties.Bus_Implementation_Deadline));
                    command.Parameters.Add(new SqlParameter("@Bus_Line_Approver_Id", properties.Bus_Line_Approver_Id));
                    //    command.Parameters.Add(new SqlParameter("@Bus_Line_Contact_Id", properties.Bus_Line_Contact_Id));
                    command.Parameters.Add(new SqlParameter("@Business_Priority_Id", properties.Business_Priority_Id));
                    command.Parameters.Add(new SqlParameter("@Business_Impact_Id", properties.Business_Impact_Id));
                    command.Parameters.Add(new SqlParameter("@Business_Impact_Description ", properties.Business_Impact_Description));
                    command.Parameters.Add(new SqlParameter("@Bus_NonImplement_Effects", properties.Bus_NonImplement_Effects));
                    command.Parameters.Add(new SqlParameter("@Business_Case", properties.Business_Case));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties.Assigned_To_Id));
                    command.Parameters.Add(new SqlParameter("@Service_Owner_Id", properties.Service_Owner_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Impact_Id", properties.Change_Impact_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Risk", properties.Change_Risk_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Priority_Id", properties.Change_Priority_Id));
                    command.Parameters.Add(new SqlParameter("@Category_Id", properties.Category_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Type_Id", properties.Change_Type_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Status_Id", properties.Change_Status_Id));

                    command.Parameters.Add(new SqlParameter("@SourceType", properties.SourceType));
                    command.Parameters.Add(new SqlParameter("@SourceVal", properties.SourceVal));

                    command.Parameters.Add(new SqlParameter("@OtherSourceType", properties.OtherSourceType));
                    command.Parameters.Add(new SqlParameter("@OtherSourceVal", properties.OtherSourceVal));

                    command.Parameters.Add(new SqlParameter("@Source_Original_Date", properties.Source_Original_Date));
                    command.Parameters.Add(new SqlParameter("@Change_Long_Desc", properties.Change_Long_Desc));
                    command.Parameters.Add(new SqlParameter("@Change_NonImplement_Effect", properties.Change_NonImplement_Effect));

                    //    command.Parameters.Add(new SqlParameter("@Comments", properties.Comments));
                    //     command.Parameters.Add(new SqlParameter("@Technical_Assessment", properties.Technical_Assessment));

                    command.Parameters.Add(new SqlParameter("@Test_Plan", properties.TestPlan));
                    command.Parameters.Add(new SqlParameter("@Change_Plan", properties.ChangePlan));
                    command.Parameters.Add(new SqlParameter("@Backout_Plan", properties.BackoutPlan));
                    command.Parameters.Add(new SqlParameter("@PlannedStartDate", properties.PlannedStartDate));
                    command.Parameters.Add(new SqlParameter("@PlannedEndDate", properties.PlannedEndDate));
                    command.Parameters.Add(new SqlParameter("@WorkStartDate", properties.WorkStartDate));
                    command.Parameters.Add(new SqlParameter("@WorkEndDate", properties.WorkEndDate));
                    command.Parameters.Add(new SqlParameter("@Change_Completed_By", properties.Change_Completed_By));
                    command.Parameters.Add(new SqlParameter("@Change_Completed_Date", properties.Change_Completed_Date));
                    command.Parameters.Add(new SqlParameter("@Change_Start_Date", properties.Change_Start_Date));
                    command.Parameters.Add(new SqlParameter("@Request_By_Date", properties.Request_By_Date));
                    command.Parameters.Add(new SqlParameter("@Resources", properties.Resources));
                    command.Parameters.Add(new SqlParameter("@Post_Review_Completed_Date", properties.PostReviewCompletedDate));
                    command.Parameters.Add(new SqlParameter("@Post_Review_Completed_By_Id", properties.PostReviewCompletedBy_Id));
                    //   command.Parameters.Add(new SqlParameter("@Change_Stage_Id", properties.Change_Stage_Id));
                    command.Parameters.Add(new SqlParameter("@AssessmentBy_Id", properties.AssessmentBy_Id));
                    command.Parameters.Add(new SqlParameter("@AssessmentBy_Date", properties.AssessmentBy_Date));
                    command.Parameters.Add(new SqlParameter("@Bus_Line_Id", properties.Bus_Line_Id));
                    command.Parameters.Add(new SqlParameter("@RejectReason", properties.RejectReason));
                    command.Parameters.Add(new SqlParameter("@Approval_By", properties.Approval_By));
                    command.Parameters.Add(new SqlParameter("@Approval_Date", properties.Approval_Date));
                    command.Parameters.Add(new SqlParameter("@Reject_Reason_Id", properties.Reject_Reason_Id));

                    command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public void UpdateChangeTask(ChangeTask properties)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties.Change_Task_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Long_Desc", properties.LongDesc));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties.Assigned_To));
                    //command.Parameters.Add(new SqlParameter("@Ch_Task_State_Id", properties.Task_State_Id));
                    //command.Parameters.Add(new SqlParameter("@CreateDate", properties.CreateDate));
                    //command.Parameters.Add(new SqlParameter("@CreatedBy", properties.CreatedBy));
                    //command.Parameters.Add(new SqlParameter("@LastEditDate", properties.EditDate));
                    //command.Parameters.Add(new SqlParameter("@LastEditedBy", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Completed_Date", properties.CompleteDate));
                    command.Parameters.Add(new SqlParameter("@Task_Start_Date", properties.Task_Start_Date));
                    command.Parameters.Add(new SqlParameter("@Due_Date", properties.DueDate));
                    //command.Parameters.Add(new SqlParameter("@Work_Notes", properties.WorkNotes));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties.Type_Id));
                    command.Parameters.Add(new SqlParameter("@Task_Status_Id", properties.Task_Status_Id));
                    command.Parameters.Add(new SqlParameter("@Dev_Type_Id", properties.Dev_Type_Id));
                    command.Parameters.Add(new SqlParameter("@Dev_Description", properties.Dev_Description));
                    command.Parameters.Add(new SqlParameter("@Dev_Category_Id", properties.Dev_Category_Id));
                    command.Parameters.Add(new SqlParameter("@Dev_Stage_Id", properties.Dev_Stage_Id));
                    command.Parameters.Add(new SqlParameter("@Activity_Description", properties.Activity_Descr));
                    command.Parameters.Add(new SqlParameter("@Quote_Id", properties.Quote_Id));
                    command.Parameters.Add(new SqlParameter("@Amount", properties.Amount));
                    command.Parameters.Add(new SqlParameter("@Quote_Received", properties.Quote_Received));
                    command.Parameters.Add(new SqlParameter("@Quote_Requested", properties.Quote_Requested));
                    command.Parameters.Add(new SqlParameter("@Quote_Approved", properties.Quote_Approved));
                    command.Parameters.Add(new SqlParameter("@Software_Delivered", properties.Software_Delivered));
                    command.Parameters.Add(new SqlParameter("@Software_Implemented", properties.Software_Implemented));
                    command.Parameters.Add(new SqlParameter("@Invoice_No", properties.Invoice_No));
                    command.Parameters.Add(new SqlParameter("@GL_Account", properties.GL_Account));
                    command.Parameters.Add(new SqlParameter("@Full_Release_Required", properties.FullReleaseRequired));
                    command.Parameters.Add(new SqlParameter("@Declined_Date", properties.Declined_Date));
                    command.Parameters.Add(new SqlParameter("@AnnMaintFee", properties.AnnMaintFee));
                    command.Parameters.Add(new SqlParameter("@AnnFeeDueDate", properties.AnnFeeDueDate));
                    command.Parameters.Add(new SqlParameter("@AXIS_Type_Id", properties.AXIS_Type_Id));
                    command.Parameters.Add(new SqlParameter("@AXIS_Status_Id", properties.AXIS_Status_Id));
                    command.Parameters.Add(new SqlParameter("@Campana_Descr", properties.Campana_Descr));
                    command.Parameters.Add(new SqlParameter("@User_Descr", properties.User_Descr));
                    command.Parameters.Add(new SqlParameter("@Axis_Owner_Id", properties.Axis_Owner_Id));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_Test", properties.Loaded_To_Test));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_Train", properties.Loaded_To_Train));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_TrainBy", properties.Loaded_To_TrainBy));
                    command.Parameters.Add(new SqlParameter("@Emergency_Load", properties.Emergency_Load));
                    command.Parameters.Add(new SqlParameter("@Emergency_Load_Reason", properties.Emergency_Load_Reason));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_Prod", properties.Loaded_To_Prod));
                    command.Parameters.Add(new SqlParameter("@Loaded_To_ProdBy", properties.Loaded_To_ProdBy));
                    command.Parameters.Add(new SqlParameter("@Obsolete", properties.Obsolete));
                    command.Parameters.Add(new SqlParameter("@Obsolete_Reason", properties.Obsolete_Reason));
                    command.Parameters.Add(new SqlParameter("@TicketNum", properties.TicketNum));

                    command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public void UpdateChangeTask2(ChangeTask properties2)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties2.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties2.Change_Task_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName)); // user.identity.name
                    command.Parameters.Add(new SqlParameter("@Long_Desc", properties2.LongDesc));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties2.Assigned_To));
                    command.Parameters.Add(new SqlParameter("@Completed_Date", properties2.CompleteDate));
                    command.Parameters.Add(new SqlParameter("@Due_Date", properties2.DueDate));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties2.Type_Id));
                    command.Parameters.Add(new SqlParameter("@Task_Status_Id", properties2.Task_Status_Id));
                    command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public void UpdateChangeTask3(ChangeTask properties5)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdateChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Record_Id", properties5.Change_Record_Id));
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", properties5.Change_Task_Id));
                    command.Parameters.Add(new SqlParameter("@UserName", System.Environment.UserName)); // user.identity.name
                    command.Parameters.Add(new SqlParameter("@Long_Desc", properties5.LongDesc));
                    command.Parameters.Add(new SqlParameter("@Assigned_To_Id", properties5.Assigned_To));
                    command.Parameters.Add(new SqlParameter("@Completed_Date", properties5.CompleteDate));
                    command.Parameters.Add(new SqlParameter("@Due_Date", properties5.DueDate));
                    command.Parameters.Add(new SqlParameter("@Type_Id", properties5.Type_Id));
                    command.Parameters.Add(new SqlParameter("@Task_Status_Id", properties5.Task_Status_Id));
                    command.ExecuteNonQuery();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public void PutStrategicInitiative(StrategicInitiatives si)
        {

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdate_StrategicInitiatives";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Strategic_Id", si.Strategic_Id));
                    command.Parameters.Add(new SqlParameter("@Strategic_Title", si.Strategic_Title));
                    command.Parameters.Add(new SqlParameter("@Strategic_CreatedBy", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Strategic_FiscalYear", si.Strategic_FiscalYear));
                    command.Parameters.Add(new SqlParameter("@Strategic_Owner", si.Strategic_Owner));
                    command.Parameters.Add(new SqlParameter("@Strategic_Active", si.Strategic_Active));
                    command.Parameters.Add(new SqlParameter("@Strategic_Descr", si.Strategic_Descr));

                    SqlDataReader reader = command.ExecuteReader();

                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }


        }

        [HttpPut]
        public void Put_Project(Project p)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_AddUpdate_Projects";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Project_Id", p.Project_Id));
                    command.Parameters.Add(new SqlParameter("@Project_Title", p.Project_Title));
                    command.Parameters.Add(new SqlParameter("@Project_CreatedBy", System.Environment.UserName));
                    command.Parameters.Add(new SqlParameter("@Project_FiscalYear", p.Project_FiscalYear));
                    command.Parameters.Add(new SqlParameter("@Project_Owner", p.Project_Owner));
                    command.Parameters.Add(new SqlParameter("@Project_Completed", p.Project_Completed));
                    command.Parameters.Add(new SqlParameter("@Project_Descr", p.Project_Descr));
                    command.Parameters.Add(new SqlParameter("@Project_Start_Date", p.Project_Start_Date));
                    command.Parameters.Add(new SqlParameter("@Project_End_Date", p.Project_End_Date));
                    command.Parameters.Add(new SqlParameter("@Project_Status_Id", p.Project_Status_Id));
                    command.Parameters.Add(new SqlParameter("@Project_Bus_Line_Id", p.Project_Bus_Line_Id));
                    SqlDataReader reader = command.ExecuteReader();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        #endregion END HTTP PUT

        #region HTTP DELETE

        [HttpDelete]
        public string RemoveRelatedDoc(ChangeDocRecord properties)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string docLoc = "";
                    string getLocQ = "SELECT Doc_Location FROM Change_Docs  WHERE Change_Doc_Id = @DocId ";
                    SqlCommand command = new SqlCommand(getLocQ, connection);
                    command.CommandType = CommandType.Text;
                    command.Parameters.Add(new SqlParameter("@DocId", properties.Change_Doc_Id));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        docLoc = Convert.ToString(reader[0]);
                    }
                    reader.Close();

                    if (docLoc != "")
                    {
                        string insertCmd = "DELETE FROM Change_Docs WHERE Change_Doc_Id = @DocId ";
                        //AND Doc_Location ='" + properties.DocLocation + "'";

                        command = new SqlCommand(insertCmd, connection);
                        command.CommandType = CommandType.Text;
                        command.Parameters.Add(new SqlParameter("@DocId", properties.Change_Doc_Id));

                        command.ExecuteNonQuery();

                        if (File.Exists(docLoc))
                        {
                            //Delete file from directory
                            File.Delete(docLoc);
                            return "Document/Link was successfully deleted.";
                        }
                        else
                            return "! File was already deleted from the directory.";
                    }
                    else
                        return "NO FILES WERE REMOVED";
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public void DeactivateChangeRecord([FromUri] int id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_Deactivate_ChangeRecord";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@ChangeRecordId", id));
                    SqlDataReader reader = command.ExecuteReader();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
        }

        [HttpPut]
        public void DeactivateChangeTask([FromUri] int change_task_id)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    string storedProc = "usp_ChngMgmt_Deactivate_ChangeTask";
                    SqlCommand command = new SqlCommand(storedProc, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Change_Task_Id", change_task_id));
                    SqlDataReader reader = command.ExecuteReader();
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }


        }


        #endregion END HTTP DELETE

        #region Utility Functions


        //this gets the current user's security setting for the change management application
        [HttpPost]
        public List<UserSecurityRecord> GetSecuritySettings(SecuritySelectParams sec)
        {
            string secQuery = "usp_AppSecurity_GetSecuritySettings ";
            List<UserSecurityRecord> userSecList = new List<UserSecurityRecord>();
            //var results = new DataTableResult<UserSecurityRecord>();
            string empId = GetEmployeeID();
            try
            {
                using (var connection = new SqlConnection(csERSDW))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand(secQuery, connection);
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Type", sec.type));
                    command.Parameters.Add(new SqlParameter("@EmployeeId", empId));
                    command.Parameters.Add(new SqlParameter("@ApplicationName", sec.application_name));
                    command.Parameters.Add(new SqlParameter("@Level", sec.level));
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        UserSecurityRecord secRec = new UserSecurityRecord();
                        secRec.employeeid = empId;
                        //ignore if errors because column not returned

                        try { secRec.AllowAdd = Convert.ToBoolean(reader["AllowAdd"]); }
                        catch { }
                        try { secRec.AllowView = Convert.ToBoolean(reader["AllowView"]); }
                        catch { }
                        try { secRec.AllowUpdate = Convert.ToBoolean(reader["AllowUpdate"]); }
                        catch { }
                        try { secRec.AllowDelete = Convert.ToBoolean(reader["AllowDelete"]); }
                        catch { }
                        try { secRec.IsAdmin = Convert.ToBoolean(reader["IsAdmin"]); }
                        catch { }

                        userSecList.Add(secRec);
                    }
                }
                //results.data = userSecList;

            }
            catch (SqlException ex)
            {
                return userSecList;
            }
            return userSecList;
        }

        //method returns string char representation of the integer value of the current user's pivotal employee id val
        private string GetEmployeeID()
        {
            string empId = "";
            try
            {
                using (var connection = new SqlConnection(prodCS))
                {
                    connection.Open();
                    string sqlStatemet = "SELECT top 1 CONVERT(BIGINT,Employee_Id) FROM EMPLOYEE WHERE Work_Email = '" + System.Environment.UserName + "@nyaaa.com'";
                    SqlCommand command = new SqlCommand(sqlStatemet, connection);
                    command.CommandType = CommandType.Text;
                    SqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        empId = Convert.ToString(reader[0]);
                    }
                }
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            return empId;
        }

        //get current username
        public string GetCurrentUsername()
        {
            string username = System.Environment.UserName;
            return username;
        }

        //Function to return dates in proper format for display
        public DateTime? DateTimeReader(DateTime? datetime, string columnName, SqlDataReader sqlReader)
        {
            if (sqlReader[columnName].ToString() != null && sqlReader[columnName].ToString() != "")
                datetime = Convert.ToDateTime(sqlReader[columnName].ToString());
            else
                datetime = null;
            return datetime;
        }

        //Function to handle select dropdown values that are null or Int32
        public Int32 IdReader32(String columnName, SqlDataReader reader)
        {
            Int32 id = String.IsNullOrEmpty(Convert.ToString(reader[columnName])) ? 0 : Convert.ToInt32(Convert.ToString(reader[columnName]));
            return id;
        }

        //Function to handle select dropdown values that are null or Int64
        public Int64 IdReader64(String columnName, SqlDataReader reader)
        {
            Int64 id = String.IsNullOrEmpty(Convert.ToString(reader[columnName])) ? 0 : Convert.ToInt64(Convert.ToString(reader[columnName]));
            return id;
        }

        //Function to handle select dropdown values that are null or Int64
        public Int16 IdReader16(String columnName, SqlDataReader reader)
        {
            Int16 id = String.IsNullOrEmpty(Convert.ToString(reader[columnName])) ? Convert.ToInt16(0) : Convert.ToInt16(Convert.ToString(reader[columnName]));
            return id;
        }



        #endregion End Utility Functions
    }
}



