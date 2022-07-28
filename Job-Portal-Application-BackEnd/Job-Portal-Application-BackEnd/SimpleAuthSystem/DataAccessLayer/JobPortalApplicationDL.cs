using JobPortalApplication.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using SimpleAuthSystem.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace SimpleAuthSystem.DataAccessLayer
{
    public class JobPortalApplicationDL : IJobPortalApplicationDL
    {
        public readonly IConfiguration _configuration;
        public readonly SqlConnection _SqlConnection;

        private readonly ILogger<JobPortalApplicationDL> _logger;

        public JobPortalApplicationDL(IConfiguration configuration, ILogger<JobPortalApplicationDL> logger)
        {
            _logger = logger;
            _configuration = configuration;
            _SqlConnection = new SqlConnection(_configuration["ConnectionStrings:DBSettingConnection"]);
        }

        // Authentication

        public async Task<SignInResponse> SignIn(SignInRequest request)
        {
            SignInResponse response = new SignInResponse();
            response.IsSuccess = true;
            response.Message = "Successful";
            try
            {
                _logger.LogInformation($"SignIn In DataAccessLayer Calling .... {JsonConvert.SerializeObject(request)}");
                if (_SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT UserId, UserName, Role, InsertionDate
                                    FROM UserDetail 
                                    WHERE UserName=@UserName AND PassWord=@PassWord AND Role=@Role;";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.Parameters.AddWithValue("@UserName", request.UserName);
                        sqlCommand.Parameters.AddWithValue("@PassWord", request.Password);
                        sqlCommand.Parameters.AddWithValue("@Role", request.Role);
                        using (DbDataReader dataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dataReader.HasRows)
                            {
                                response.data = new SignIn();
                                response.Message = "Login Successfully";
                                await dataReader.ReadAsync();
                                response.data.UserId = dataReader["UserId"] != DBNull.Value ? (int)dataReader["UserId"] : -1;
                                response.data.UserName = dataReader["UserName"] != DBNull.Value ? (string)dataReader["UserName"] : string.Empty;
                                response.data.Role = dataReader["Role"] != DBNull.Value ? (string)dataReader["Role"] : string.Empty;
                                response.data.InsertionDate = dataReader["InsertionDate"] != DBNull.Value ? Convert.ToDateTime(dataReader["InsertionDate"]).ToString("dddd, dd-MM-yyyy, HH:mm tt") : string.Empty;
                            }
                            else
                            {
                                response.IsSuccess = false;
                                response.Message = "Login Unsuccessfully";
                                _logger.LogInformation($"Login Unsuccessfully UserName : {request.UserName}, Role : {request.Role}");
                                return response;
                            }
                        }
                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : {ex.Message}");
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError($"Exception Occurs : Message 1 : {ex.Message}");

            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<SignUpResponse> SignUp(SignUpRequest request)
        {
            SignUpResponse response = new SignUpResponse();
            response.IsSuccess = true;
            response.Message = "Successful";
            try
            {
                _logger.LogInformation($"SignUp In DataAccessLayer Calling .... Request Body {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }


                if (!request.Password.Equals(request.ConfigPassword))
                {
                    response.IsSuccess = false;
                    response.Message = "Password & Confirm Password not Match";
                    return response;
                }

                string SqlStoreProcedure = "SpAdminSignUp";
                using (SqlCommand sqlCommand = new SqlCommand(SqlStoreProcedure, _SqlConnection))
                {

                    sqlCommand.CommandType = CommandType.StoredProcedure;
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.Parameters.AddWithValue("@UserName", request.UserName);
                    sqlCommand.Parameters.AddWithValue("@PassWord", request.Password);
                    sqlCommand.Parameters.AddWithValue("@Role", request.Role.ToLower());
                    sqlCommand.Parameters.AddWithValue("@MasterPassWord", request.MasterPassword.ToLower());
                    using (DbDataReader dataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dataReader.HasRows)
                            {
                                await dataReader.ReadAsync();
                                int Result = dataReader["Result"] != DBNull.Value ? (int)dataReader["Result"] : 0;
                                if (Result == 0)
                                {
                                    response.IsSuccess = false;
                                    response.Message = "Invalid Admin Password";
                                }
                                else if (Result == 2 || Result == 3)
                                {
                                    response.IsSuccess = false;
                                    response.Message = "User Already Exist Please Enter Another UserName";
                                }

                            }
                        }catch(Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = $"Exception Occurs : Message 1 : {ex.Message}";
                            _logger.LogError($"Exception Occurs : Message 1 : {ex.Message}");
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : {ex.Message}");
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        // Admin

        public async Task<GetFieldsResponse> GetFields(string FieldName)
        {
            GetFieldsResponse response = new GetFieldsResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"GetFields In DataAccessLayer Calling .... Field Name : {FieldName}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT DISTINCT FieldID, FieldName FROM fact_jobs_master WHERE FieldStream=@FieldStream";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.CommandType = System.Data.CommandType.Text;
                    sqlCommand.Parameters.AddWithValue("@FieldStream", FieldName);

                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                response.data = new List<GetFields>();
                                while (await dbDataReader.ReadAsync())
                                {
                                    response.data.Add(new GetFields()
                                    {
                                        FieldID = dbDataReader["FieldID"] != DBNull.Value ? (int)dbDataReader["FieldID"] : -1,
                                        FieldName = dbDataReader["FieldName"] != DBNull.Value ? (string)dbDataReader["FieldName"] : string.Empty
                                    });
                                }
                            }
                        }catch(Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                            _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<GetStreamsResponse> GetStreams()
        {
            GetStreamsResponse response = new GetStreamsResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"GetStreams In DataAccessLayer Calling .... ");


                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT Distinct FieldStream FROM fact_jobs_master";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.CommandType = System.Data.CommandType.Text;

                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                response.data = new List<GetStreams>();
                                while (await dbDataReader.ReadAsync())
                                {
                                    response.data.Add(new GetStreams()
                                    {
                                        StreamName = dbDataReader["FieldStream"] != DBNull.Value ? (string)dbDataReader["FieldStream"] : string.Empty
                                    });
                                }
                            }
                        }catch(Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                            _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                        }
                    }
                }

                SqlQuery = @"select DISTINCT CompanyName from JobDetail;";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;

                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            try
                            {
                                if (dbDataReader.HasRows)
                                {
                                    response.data1 = new List<GetCompanies>();
                                    while (await dbDataReader.ReadAsync())
                                    {
                                        response.data1.Add(new GetCompanies()
                                        {
                                            Company = dbDataReader["CompanyName"] != DBNull.Value ? (string)dbDataReader["CompanyName"] : string.Empty
                                        });
                                    }
                                }
                            }catch(Exception ex)
                            {
                                response.IsSuccess = false;
                                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
                            }
                        }

                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 3 " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 3 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 4 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 4 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<AddJobResponse> AddJob(AddJobRequest request)
        {
            AddJobResponse response = new AddJobResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"AddJob In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"INSERT INTO JobDetail (Title, Description, CompanyName, Stream, Field, Salary, DocumentUrl, IsActive)
                                    VALUES(@Title, @Description, @CompanyName, @Stream, @Field, @Salary, @DocumentUrl, @IsActive);";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@Title", request.Title);
                        sqlCommand.Parameters.AddWithValue("@Description", request.Description);
                        sqlCommand.Parameters.AddWithValue("@CompanyName", request.CompanyName);
                        sqlCommand.Parameters.AddWithValue("@Stream", request.Stream);
                        sqlCommand.Parameters.AddWithValue("@Field", request.Field);
                        sqlCommand.Parameters.AddWithValue("@Salary", request.Salary);
                        sqlCommand.Parameters.AddWithValue("@DocumentUrl", request.DocumentUrl);
                        sqlCommand.Parameters.AddWithValue("@IsActive", request.IsActive ? 1 : 0);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError($"Something Went Wrong In Add Job Query");
                        }

                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<UpdateJobResponse> UpdateJob(UpdateJobRequest request)
        {
            UpdateJobResponse response = new UpdateJobResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"UpdateJob In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"UPDATE JobDetail 
                                    SET Title=@Title, 
                                        Description=@Description,
                                        CompanyName=@CompanyName,
                                        Stream=@Stream,
                                        Field=@Field, 
                                        Salary=@Salary, 
                                        DocumentUrl=@DocumentUrl, 
                                        IsActive=@IsActive
                                    WHERE JobId=@Id";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@Id", request.ID);
                        sqlCommand.Parameters.AddWithValue("@Title", request.Title);//
                        sqlCommand.Parameters.AddWithValue("@Description", request.Description);
                        sqlCommand.Parameters.AddWithValue("@CompanyName", request.CompanyName);
                        sqlCommand.Parameters.AddWithValue("@Stream", request.Stream);
                        sqlCommand.Parameters.AddWithValue("@Field", request.Field);
                        sqlCommand.Parameters.AddWithValue("@Salary", request.Salary);
                        sqlCommand.Parameters.AddWithValue("@DocumentUrl", request.DocumentUrl);
                        sqlCommand.Parameters.AddWithValue("@IsActive", request.IsActive ? 1 : 0);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                        }
                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<DeleteJobResponse> DeleteJob(int JobID)
        {
            DeleteJobResponse response = new DeleteJobResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"DeleteJob In DataAccessLayer Calling .... JobID : {JobID}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"DELETE FROM JobDetail WHERE JobId=@JobId";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@JobID", JobID);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In Delete Job Query.");
                        }

                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }

                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<GetJobResponse> GetJob(GetJobRequest request)
        {
            GetJobResponse response = new GetJobResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"GetJob In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                int Offset = (request.PageNumber - 1) * request.NumberOfRecordPerPage;
                string SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsTrash=0) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsTrash=0
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@Offset", Offset);
                        sqlCommand.Parameters.AddWithValue("@NumberOfRecordPerPage", request.NumberOfRecordPerPage);
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            if (dbDataReader.HasRows)
                            {
                                response.data = new List<GetJob>();
                                int Count = 0;
                                while (await dbDataReader.ReadAsync())
                                {
                                    response.data.Add(new GetJob()
                                    {
                                        //JobId, Title, Description, Field,Salary, DocumentUrl, IsActive
                                        ID = dbDataReader["JobId"] != DBNull.Value ? (int)dbDataReader["JobId"] : -1,
                                        Title = dbDataReader["Title"] != DBNull.Value ? (string)dbDataReader["Title"] : string.Empty,
                                        Description = dbDataReader["Description"] != DBNull.Value ? (string)dbDataReader["Description"] : string.Empty,
                                        CompanyName = dbDataReader["CompanyName"] != DBNull.Value ? (string)dbDataReader["CompanyName"] : string.Empty,
                                        Stream = dbDataReader["Stream"] != DBNull.Value ? (string)dbDataReader["Stream"] : string.Empty,
                                        Field = dbDataReader["Field"] != DBNull.Value ? (string)dbDataReader["Field"] : string.Empty,
                                        Salary = dbDataReader["Salary"] != DBNull.Value ? (int)dbDataReader["Salary"] : -1,
                                        DocumentUrl = dbDataReader["DocumentUrl"] != DBNull.Value ? (string)dbDataReader["DocumentUrl"] : string.Empty,
                                        IsActive = dbDataReader["IsActive"] != DBNull.Value ? (bool)dbDataReader["IsActive"] : false,
                                    });

                                    if (Count == 0)
                                    {
                                        Count++;
                                        response.TotalRecords = dbDataReader["TotalRecord"] != DBNull.Value ? Convert.ToInt32(dbDataReader["TotalRecord"]) : -1;
                                        response.TotalPage = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(response.TotalRecords / request.NumberOfRecordPerPage)));
                                        response.CurrentPage = request.PageNumber;
                                    }
                                }
                            }
                        }
                    
                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<GetApplicationsResponse> GetApplications(GetApplicationsRequest request)
        {
            GetApplicationsResponse response = new GetApplicationsResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"GetApplication In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                int Offset = (request.PageNumber - 1) * request.NumberOfRecordPerPage;
                string SqlQuery = @"SELECT * ,
                                    (select COUNT(*) from ApplicationDetail ) As TotalRecord
                                    FROM ApplicationDetail
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.CommandType = System.Data.CommandType.Text;
                    sqlCommand.Parameters.AddWithValue("@Offset", Offset);
                    sqlCommand.Parameters.AddWithValue("@NumberOfRecordPerPage", request.NumberOfRecordPerPage);
                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                int Count = 0;
                                response.data = new List<GetApplications>();
                                while (await dbDataReader.ReadAsync())
                                {
                                    GetApplications data = new GetApplications();

                                    data.ApplicationID = dbDataReader["ApplicationID"] != DBNull.Value ? (int)dbDataReader["ApplicationID"] : -1;
                                    data.JobID = dbDataReader["JobID"] != DBNull.Value ? (int)dbDataReader["JobID"] : -1;
                                    data.JobTitle = dbDataReader["JobTitle"] != DBNull.Value ? (string)dbDataReader["JobTitle"] : string.Empty;
                                    data.ApplicantName = dbDataReader["ApplicantName"] != DBNull.Value ? (string)dbDataReader["ApplicantName"] : string.Empty;
                                    data.Contact = dbDataReader["Contact"] != DBNull.Value ? (string)dbDataReader["Contact"] : string.Empty;
                                    data.EmailID = dbDataReader["EmailID"] != DBNull.Value ? (string)dbDataReader["EmailID"] : string.Empty;
                                    data.WorkExperience = dbDataReader["WorkExperience"] != DBNull.Value ? (string)dbDataReader["WorkExperience"] : string.Empty;
                                    data.Address = dbDataReader["Address"] != DBNull.Value ? (string)dbDataReader["Address"] : string.Empty;
                                    data.DateOfBirth = dbDataReader["DateOfBirth"] != DBNull.Value ? (string)dbDataReader["DateOfBirth"] : string.Empty;
                                    data.PassingYear = dbDataReader["PassingYear"] != DBNull.Value ? (string)dbDataReader["PassingYear"] : string.Empty;
                                    data.CollegeName = dbDataReader["CollegeName"] != DBNull.Value ? (string)dbDataReader["CollegeName"] : string.Empty;
                                    data.Degree = dbDataReader["Degree"] != DBNull.Value ? (string)dbDataReader["Degree"] : string.Empty;
                                    data.CurrentStatus = dbDataReader["CurrentStatus"] != DBNull.Value ? (string)dbDataReader["CurrentStatus"] : string.Empty;
                                    data.Skill = dbDataReader["Skill"] != DBNull.Value ? (string)dbDataReader["Skill"] : string.Empty;
                                    data.Age = dbDataReader["Age"] != DBNull.Value ? Convert.ToInt32(dbDataReader["Age"]) : -1;
                                    data.Gender = dbDataReader["Gender"] != DBNull.Value ? (string)dbDataReader["Gender"] : string.Empty;
                                    data.PinCode = dbDataReader["PinCode"] != DBNull.Value ? Convert.ToInt32(dbDataReader["PinCode"]) : -1;
                                    data.Standerd10_Percentage = dbDataReader["Standerd10_Percentage"] != DBNull.Value ? Convert.ToDouble(dbDataReader["Standerd10_Percentage"]) : -1;
                                    data.Standerd12_Percentage = dbDataReader["Standerd12_Percentage"] != DBNull.Value ? Convert.ToDouble(dbDataReader["Standerd12_Percentage"]) : -1;
                                    data.Graduation_Aggregation = dbDataReader["Graduation_Aggregation"] != DBNull.Value ? Convert.ToDouble(dbDataReader["Graduation_Aggregation"]) : -1;
                                    data.StreamName = dbDataReader["StreamName"] != DBNull.Value ? (string)dbDataReader["StreamName"] : string.Empty;

                                    response.data.Add(data);
                                    if (Count == 0)
                                    {
                                        Count++;
                                        response.TotalRecords = dbDataReader["TotalRecord"] != DBNull.Value ? Convert.ToInt32(dbDataReader["TotalRecord"]) : -1;
                                        response.TotalPage = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(response.TotalRecords / request.NumberOfRecordPerPage)));
                                        response.CurrentPage = request.PageNumber;
                                    }
                                }
                            }

                        }catch(Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                            _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<RejectApplicationResponse> RejectApplication(int ApplicationID)
        {
            RejectApplicationResponse response = new RejectApplicationResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"RejectApplication In DataAccessLayer Calling .... Application ID : {ApplicationID}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"DELETE FROM ApplicationDetail WHERE ApplicationID=@ApplicationID";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@ApplicationID", ApplicationID);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In Reject Application Query.");
                        }
                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }

                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }
        // FeedBack

        public async Task<GetFeedbacksResponse> GetFeedbacks(GetFeedbacksRequest request)
        {
            GetFeedbacksResponse response = new GetFeedbacksResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"GetFeedbacks In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }
                int Offset = (request.PageNumber - 1) * request.NumberOfRecordPerPage;
                string SqlQuery = @"SELECT * ,
                                    (select COUNT(*) from FeedbackDetail) As TotalRecord
                                    FROM FeedbackDetail 
                                    ORDER BY FeedbackID DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;
                                    ";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = System.Data.CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@Offset", Offset);
                        sqlCommand.Parameters.AddWithValue("@NumberOfRecordPerPage", request.NumberOfRecordPerPage);
                        using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                        {
                            try
                            {
                                if (dbDataReader.HasRows)
                                {
                                    int Count = 0;
                                    response.data = new List<GetFeedbacks>();
                                    while (await dbDataReader.ReadAsync())
                                    {
                                        response.data.Add(new GetFeedbacks()
                                        {
                                            FeedbackID = dbDataReader["FeedbackID"] != DBNull.Value ? (int)dbDataReader["FeedbackID"] : -1,
                                            FeedBack = dbDataReader["Feedback"] != DBNull.Value ? (string)dbDataReader["Feedback"] : string.Empty
                                        });

                                        if (Count == 0)
                                        {
                                            Count++;
                                            response.TotalRecords = dbDataReader["TotalRecord"] != DBNull.Value ? Convert.ToInt32(dbDataReader["TotalRecord"]) : -1;
                                            response.TotalPage = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(response.TotalRecords / request.NumberOfRecordPerPage)));
                                            response.CurrentPage = request.PageNumber;
                                        }
                                    }
                                }
                            }catch(Exception ex)
                            {
                                response.IsSuccess = false;
                                response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                                _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                            }
                        }
                    
                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 3 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 3 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<AddFeedbackResponse> AddFeedback(AddFeedbackRequest request)
        {
            AddFeedbackResponse response = new AddFeedbackResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"AddFeedback In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"INSERT INTO FeedbackDetail (FeedBack)
                                    VALUES(@FeedBack);";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@FeedBack", request.Feedback);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In AddFeedBack");
                        }
                    
                    }catch(Exception ex)
                    {
                        response.IsSuccess = true;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<DeleteFeedbackResponse> DeleteFeedback(int ID)
        {
            DeleteFeedbackResponse response = new DeleteFeedbackResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"DeleteFeedback In DataAccessLayer Calling .... request ID : {ID}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"DELETE FROM FeedbackDetail WHERE FeedbackID=@ID;";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@ID", ID);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In DeleteFeedback");
                        }
                    
                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }


        // User
        public async Task<InsertApplicationResponse> InsertApplication(InsertApplicationRequest request)
        {
            InsertApplicationResponse response = new InsertApplicationResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"InsertApplication In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"INSERT INTO ApplicationDetail
                                    ( JobID, 
                                      JobTitle, 
                                      ApplicantName, 
                                      Contact, 
                                      EmailID, 
                                      Address, 
                                      WorkExperience, 
                                      DateOfBirth, PassingYear, CollegeName, Degree, CurrentStatus, Skill, Age, Gender, PinCode, Standerd10_Percentage,
                                      Standerd12_Percentage,
                                      Graduation_Aggregation,
                                      StreamName)
                                    VALUES (@JobID, 
                                            @JobTitle, 
                                            @ApplicantName, 
                                            @Contact, 
                                            @EmailID, 
                                            @Address, 
                                            @WorkExperience,
                                            @DateOfBirth, @PassingYear, @CollegeName, @Degree, @CurrentStatus, @Skill, @Age, @Gender, @PinCode, @Standerd10_Percentage,
                                            @Standerd12_Percentage,
                                            @Graduation_Aggregation,
                                            @StreamName)";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    try
                    {
                        sqlCommand.CommandTimeout = 180;
                        sqlCommand.CommandType = CommandType.Text;
                        sqlCommand.Parameters.AddWithValue("@JobID", request.JobID);
                        sqlCommand.Parameters.AddWithValue("@JobTitle", request.JobTitle);
                        sqlCommand.Parameters.AddWithValue("@ApplicantName", request.ApplicantName);
                        sqlCommand.Parameters.AddWithValue("@Contact", request.Contact);
                        sqlCommand.Parameters.AddWithValue("@EmailID", request.EmailID);
                        sqlCommand.Parameters.AddWithValue("@Address", request.Address);
                        sqlCommand.Parameters.AddWithValue("@WorkExperience", request.WorkExperience);
                        sqlCommand.Parameters.AddWithValue("@DateOfBirth", request.DateOfBirth);
                        sqlCommand.Parameters.AddWithValue("@PassingYear", request.PassingYear);
                        sqlCommand.Parameters.AddWithValue("@CollegeName", request.CollegeName);
                        sqlCommand.Parameters.AddWithValue("@Degree", request.Degree);
                        sqlCommand.Parameters.AddWithValue("@CurrentStatus", request.CurrentStatus);
                        sqlCommand.Parameters.AddWithValue("@Skill", request.Skill);
                        sqlCommand.Parameters.AddWithValue("@Age", request.Age);
                        sqlCommand.Parameters.AddWithValue("@Gender", request.Gender);
                        sqlCommand.Parameters.AddWithValue("@PinCode", request.PinCode);
                        sqlCommand.Parameters.AddWithValue("@Standerd10_Percentage", request.Standerd10_Percentage);
                        sqlCommand.Parameters.AddWithValue("@Standerd12_Percentage", request.Standerd12_Percentage);
                        sqlCommand.Parameters.AddWithValue("@Graduation_Aggregation", request.Graduation_Aggregation);
                        sqlCommand.Parameters.AddWithValue("@StreamName", request.StreamName);
                        int Status = await sqlCommand.ExecuteNonQueryAsync();
                        if (Status <= 0)
                        {
                            response.IsSuccess = false;
                            response.Message = "Something Went Wrong";
                            _logger.LogError("Something Went Wrong In InsertApplication");
                        }

                    }catch(Exception ex)
                    {
                        response.IsSuccess = false;
                        _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                        response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }

        public async Task<JobFilterResponse> JobFilter(JobFilterRequest request)
        {
            JobFilterResponse response = new JobFilterResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {
                _logger.LogInformation($"JobFilter In DataAccessLayer Calling .... request Body : {JsonConvert.SerializeObject(request)}");

                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                int Offset = (request.PageNumber - 1) * request.NumberOfRecordPerPage;
                string SqlQuery = string.Empty;

                if (!String.IsNullOrEmpty(request.CompanyName))
                {

                    if (!String.IsNullOrEmpty(request.Stream) && String.IsNullOrEmpty(request.Field))
                    {
                        SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsActive=1) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsActive=1 AND ( CompanyName LIKE '%" + request.CompanyName + @"%' ) AND ( Stream LIKE '%" + request.Stream + @"%' )
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";
                    }
                    else if (!String.IsNullOrEmpty(request.Field))
                    {
                        SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsActive=1) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsActive=1 AND ( CompanyName LIKE '%" + request.CompanyName + @"%' ) AND ( Field LIKE '%" + request.Field + @"%' ) 
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";
                        //OR '
                    }
                    else
                    {
                        SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsActive=1) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsActive=1 AND ( CompanyName LIKE '%" + request.CompanyName + @"%' )
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";
                    }

                }
                else if (!String.IsNullOrEmpty(request.Stream) && String.IsNullOrEmpty(request.Field))
                {
                    SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsActive=1) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsActive=1 AND ( Stream LIKE '%" + request.Stream + @"%' )
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";
                }
                else if (!String.IsNullOrEmpty(request.Field))
                {
                    SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsActive=1) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsActive=1 AND ( Field LIKE '%" + request.Field + @"%' ) 
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";
                    //OR '
                }
                else
                {
                    SqlQuery = @"SELECT * , 
                                    (select COUNT(*) from JobDetail WHERE IsActive=1) As TotalRecord
                                    FROM JobDetail
                                    WHERE IsActive=1
                                    ORDER BY JobId DESC
                                    OFFSET @Offset ROWS FETCH NEXT @NumberOfRecordPerPage ROWS ONLY;";
                }

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.CommandType = System.Data.CommandType.Text;
                    sqlCommand.Parameters.AddWithValue("@Offset", Offset);
                    sqlCommand.Parameters.AddWithValue("@NumberOfRecordPerPage", request.NumberOfRecordPerPage);
                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                response.data = new List<GetJob>();
                                int Count = 0;
                                while (await dbDataReader.ReadAsync())
                                {
                                    response.data.Add(new GetJob()
                                    {
                                        //JobId, Title, Description, Field,Salary, DocumentUrl, IsActive
                                        ID = dbDataReader["JobId"] != DBNull.Value ? (int)dbDataReader["JobId"] : -1,
                                        Title = dbDataReader["Title"] != DBNull.Value ? (string)dbDataReader["Title"] : string.Empty,
                                        Description = dbDataReader["Description"] != DBNull.Value ? (string)dbDataReader["Description"] : string.Empty,
                                        CompanyName = dbDataReader["CompanyName"] != DBNull.Value ? (string)dbDataReader["CompanyName"] : string.Empty,
                                        Stream = dbDataReader["Stream"] != DBNull.Value ? (string)dbDataReader["Stream"] : string.Empty,
                                        Field = dbDataReader["Field"] != DBNull.Value ? (string)dbDataReader["Field"] : string.Empty,
                                        Salary = dbDataReader["Salary"] != DBNull.Value ? (int)dbDataReader["Salary"] : -1,
                                        DocumentUrl = dbDataReader["DocumentUrl"] != DBNull.Value ? (string)dbDataReader["DocumentUrl"] : string.Empty,
                                        IsActive = dbDataReader["IsActive"] != DBNull.Value ? (bool)dbDataReader["IsActive"] : false,
                                    });

                                    if (Count == 0)
                                    {
                                        Count++;
                                        response.TotalRecords = dbDataReader["TotalRecord"] != DBNull.Value ? Convert.ToInt32(dbDataReader["TotalRecord"]) : -1;
                                        response.TotalPage = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(response.TotalRecords / request.NumberOfRecordPerPage)));
                                        response.CurrentPage = request.PageNumber;
                                    }
                                }
                            }
                        
                        }catch(Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                            _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 2 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 2 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response; ;
        }

        public async Task<GetStreamListResponse> GetStreamList()
        {
            GetStreamListResponse response = new GetStreamListResponse();
            response.IsSuccess = true;
            response.Message = "Successful";

            try
            {

                _logger.LogInformation($"GetStreamList In DataAccessLayer Calling .... ");


                if (_SqlConnection != null && _SqlConnection.State != System.Data.ConnectionState.Open)
                {
                    await _SqlConnection.OpenAsync();
                }

                string SqlQuery = @"SELECT Distinct Stream FROM StreamList";

                using (SqlCommand sqlCommand = new SqlCommand(SqlQuery, _SqlConnection))
                {
                    sqlCommand.CommandTimeout = 180;
                    sqlCommand.CommandType = System.Data.CommandType.Text;

                    using (DbDataReader dbDataReader = await sqlCommand.ExecuteReaderAsync())
                    {
                        try
                        {
                            if (dbDataReader.HasRows)
                            {
                                response.data = new List<GetStreams>();
                                while (await dbDataReader.ReadAsync())
                                {
                                    response.data.Add(new GetStreams()
                                    {
                                        StreamName = dbDataReader["Stream"] != DBNull.Value ? (string)dbDataReader["Stream"] : string.Empty
                                    });
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            response.IsSuccess = false;
                            response.Message = "Exception Occurs : Message 1 : " + ex.Message;
                            _logger.LogError($"Exception Occurs : Message 1 : ", ex.Message);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = "Exception Occurs : Message 4 : " + ex.Message;
                _logger.LogError($"Exception Occurs : Message 4 : ", ex.Message);
            }
            finally
            {
                await _SqlConnection.CloseAsync();
                await _SqlConnection.DisposeAsync();
            }

            return response;
        }
    }
}
