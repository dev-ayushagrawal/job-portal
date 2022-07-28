import React, { Component } from "react";
import "./AdminDashboard.css";
import ProjectAdminServices from "../../services/ProjectAdminServices";
import ProjectFeedbackServices from "../../services/ProjectFeedbackServices";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ArchiveIcon from "@material-ui/icons/Archive";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Pagination from "@material-ui/lab/Pagination";
import DeleteIcon from "@material-ui/icons/Delete";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FeedbackIcon from "@material-ui/icons/Feedback";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import Switch from "@material-ui/core/Switch";
import FolderIcon from "@material-ui/icons/Folder";

import EditIcon from "@material-ui/icons/Edit";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import GetAppIcon from "@material-ui/icons/GetApp";

//Table Library
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { saveAs } from "file-saver";

const services = new ProjectAdminServices();
const feedbackServices = new ProjectFeedbackServices();

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
      JobID: 0,
      JobName: "",
      JobDescription: "",
      CompanyName: "",
      JobStream: "",
      JobField: "",
      JobSalary: "",
      JobDocumentUrl: "",
      IsActive: false,
      ApplicationID: 0,
      //
      Name: "",
      Contact: "",
      EmailID: "",
      Address: "",
      WorkExperience: "",
      JobStream: "",
      JobField: "",
      DateOfBirth: "",
      PassingYear: "",
      CollegeName: "",
      Degree: "",
      CurrentStatus: "",
      Skill: "",
      Age: "",
      Gender: "",
      Pincode: "",
      Percentage10: "",
      Percentage12: "",
      GradAggregation: "",
      StreamName: "",
      //
      JobNameFlag: false,
      JobStreamFlag: false,
      JobFieldFlag: false,
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      //
      PageNumber: 1,
      JobPageNumber: 1,
      ApplicationPageNumber: 1,
      FeedbackPageNumber: 1,
      //
      Fields: [],
      Stream: [],
      JobsList: [],
      Application: [],
      Feedback: [],
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      open1: false,
      MenuOpen: false,
      OpenLoader: false,
      OpenSnackBar: false,

      OpenShow: true,
      OpenApplication: false,
      OpenTrash: false,
      OpenFeedBack: false,
      Update: false,
      ShowApplicantInfo: false,
      RejectApplication: false,
      ShowAllJobDetail: false,
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");
    if (localStorage.getItem("admin_token") === null) {
      this.props.history.push("/SignIn");
    }
    this.GetStreams();
    this.GetJobs(this.state.JobPageNumber);
  }

  GetStreams() {
    services
      .GetStreams()
      .then((data) => {
        console.log("Data : ", data.data.data);
        if (data.data.isSuccess) {
          this.setState({
            // Fields: data.data.data,
            Stream: data.data.data,
          });
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  }

  GetJobs = async (CurrentPage) => {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
    };

    await services
      .GetJob(data)
      .then((data) => {
        console.log("Data : ", data);
        if (data.data.data === null && CurrentPage > 1) {
          this.setState({ CurrentPage: CurrentPage - 1 });
          this.GetJobs(CurrentPage - 1);
        } else {
          this.setState({
            JobsList: data.data.data,
            TotalPages: data.data.totalPage,
            PageNumber: data.data.currentPage,
          });
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.setState({
          Message: "Something Went Wrong",
          OpenSnackBar: true,
          OpenLoader: false,
        });
      });
  };

  GetApplication(CurrentPage) {
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
    };

    services
      .GetApplications(data)
      .then((data) => {
        console.log("Application Data : ", data);
        if (data.data.data === null && CurrentPage > 1) {
          this.setState({ CurrentPage: CurrentPage - 1 });
          this.GetApplications(CurrentPage - 1);
        } else {
          this.setState({
            Application: data.data.data,
            TotalPages: data.data.totalPage,
            PageNumber: data.data.currentPage,
          });
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  }

  GetFeedBack(CurrentPage) {
    debugger;
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 5,
    };
    feedbackServices
      .GetFeedbacks(data)
      .then((data) => {
        console.log("GetFeedBack Data : ", data);
        if (data.data.data === null && CurrentPage > 1) {
          this.setState({ CurrentPage: CurrentPage - 1 });
          this.GetFeedBack(CurrentPage - 1);
        } else {
          this.setState({
            Feedback: data.data.data,
            TotalPages: data.data.totalPage,
            PageNumber: data.data.currentPage,
          });
        }
      })
      .catch((error) => {
        console.log("GetFeedBack Error : ", error);
      });
  }

  handleSubmit = (e) => {
    console.log("Handle Submit Calling ... ");
    let State = this.state;
    this.CheckValidity();
    if (
      State.JobStream !== "" &&
      State.JobStream !== "" &&
      State.JobField !== ""
    ) {
      this.setState({ OpenLoader: true });
      let data = {
        title: State.JobName,
        description: State.JobDescription,
        companyName: State.CompanyName,
        stream: State.JobStream,
        field: State.JobField,
        salary: Number(State.JobSalary),
        documentUrl: State.JobDocumentUrl,
        isActive: State.IsActive,
      };
      services
        .AddJob(data)
        .then((data) => {
          console.log("Data : ", data);
          this.setState({
            Message: data.data.message,
            OpenSnackBar: true,
            OpenLoader: false,
            OpenShow: true,
          });
          // this.handleOpenList()
          this.handleClose();
          this.GetJobs(this.state.JobPageNumber);
        })
        .catch((error) => {
          console.log("Error : ", error);
          this.setState({
            Message: "Something Went Wrong",
            OpenSnackBar: true,
            OpenLoader: false,
            OpenShow: true,
          });
          // this.handleClose()
          this.GetJobs(this.state.JobPageNumber);
        });
    } else {
      console.log("Please Fill Required Field");
      this.setState({
        OpenSnackBar: true,
        Message: "Please Fill Required Field",
      });
    }
  };

  handleUpdate = (e) => {
    console.log("Handle Update Calling ... ");
    let State = this.state;
    this.CheckValidity();
    if (
      State.JobName !== "" &&
      State.JobField !== "" &&
      State.JobStream !== ""
    ) {
      this.setState({ OpenLoader: true });
      let data = {
        id: State.JobID,
        title: State.JobName,
        description: State.JobDescription,
        companyName: State.CompanyName,
        stream: State.JobStream,
        field: State.JobField,
        salary: Number(State.JobSalary),
        documentUrl: State.JobDocumentUrl,
        isActive: State.IsActive,
      };
      services
        .UpdateJob(data)
        .then((data) => {
          console.log("Data : ", data);
          this.setState({
            Message: data.data.message,
            OpenSnackBar: true,
            OpenLoader: false,
            open: false,
          });
          this.GetJobs(this.state.JobPageNumber);
        })
        .catch((error) => {
          console.log("Error : ", error);
          this.setState({
            Message: "Something Went Wrong",
            OpenSnackBar: true,
            OpenLoader: false,
            open: false,
          });
          this.GetJobs(this.state.JobPageNumber);
        });
    } else {
      console.log("Please Fill Required Field");
      this.setState({
        OpenSnackBar: true,
        Message: "Please Fill Required Field",
      });
    }
  };

  handleDeleteProjectPermanently = (ProjectID) => {
    console.log("Handle Delete Project Permanently Calling ... ");
    let data = {
      projectID: ProjectID,
    };

    // projectAdminServices
    //   .DeleteProjectPermanently(data)
    //   .then((data) => {
    //     console.log('Data : ', data)
    //     this.setState({ Message: data.data.message, Snackbar: true })
    //     this.handleClose()
    //     this.handleTrashOpen()
    //   })
    //   .catch((error) => {
    //     console.log('Error : ', error)
    //     this.handleClose()
    //     this.handleTrashOpen()
    //     this.setState({ Message: 'Something Went Wrong', Snackbar: true })
    //   })
  };

  handleDeleteApplication = (ID) => {
    console.log("Handle Reject Application Calling .... ID : ", ID);
    this.setState({
      RejectApplication: true,
      ApplicationID: ID,
      open1: true,
      // open: false,
    });
  };

  handleMenuButton = (e) => {
    console.log("Handle Menu Button Calling ... ");
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    });
  };

  handleOpen = async () => {
    console.log("Handle Open Calling ... ");

    await this.setState({
      open: true,
      // OpenShow: true,
      OpenTrash: false,
      JobPageNumber: 1,
      JobID: 0,
      JobName: "",
      JobDescription: "",
      JobStream: "",
      JobField: "",
      JobSalary: "",
      JobDocumentUrl: "",
      IsActive: false,
      TotalPages: !this.state.OpenInsert ? 0 : this.state.TotalPages,
    });
    this.GetJobs(this.state.JobPageNumber);
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      open: false,
      open1: false,
      Update: false,
      ShowApplicantInfo: false,
      RejectApplication: false,
      // ShowAllJobDetail: false,
      JobID: 0,
      JobName: "",
      JobDescription: "",
      JobStream: "",
      JobField: "",
      JobSalary: "",
      JobDocumentUrl: "",
      CreatedDate: "",
      IsActive: false,
    });
  };

  handleClose1 = () => {
    this.setState({
      open: false,
      open1: false,
      ShowAllJobDetail: false,
      ShowApplicantInfo: false,
    });
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleOpenList = (e) => {
    console.log("Handle Open List Calling ... ");
    this.GetJobs(this.state.JobPageNumber);
    this.setState({
      OpenShow: true,
      OpenApplication: false,
      OpenFeedBack: false,
      ApplicationPageNumber: 1,
      FeedbackPageNumber: 1,
    });
  };

  handleApplication = async () => {
    console.log("Handle Trash Open Calling...");
    this.GetApplication(this.state.ApplicationPageNumber);
    this.setState({
      OpenShow: false,
      OpenApplication: true,
      OpenFeedBack: false,
      FeedbackPageNumber: 1,
      JobPageNumber: 1,
    });
  };

  handleFeedBackOpen = (e) => {
    console.log("Handle FeedBack Open Calling...");
    this.GetFeedBack(this.state.FeedbackPageNumber);
    this.setState({
      OpenShow: false,
      OpenApplication: false,
      JobPageNumber: 1,
      ApplicationPageNumber: 1,
      OpenFeedBack: true,
    });
  };

  CheckValidity() {
    console.log("Check Validity Calling...");
    this.setState({
      JobNameFlag: false,
      JobStreamFlag: false,
      JobFieldFlag: false,
    });
    if (this.state.JobName === "") {
      this.setState({ JobNameFlag: true });
    }
    if (this.state.JobStream === "") {
      this.setState({ JobStreamFlag: true });
    }
    if (this.state.JobField === "") {
      this.setState({ JobFieldFlag: true });
    }
  }

  handleRadioChange = (event) => {
    console.log("Handle Redio Change Calling...");
    this.setState({ ProjectStatus: event.target.value });
  };

  handleChanges = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("name : ", name, "Value : ", value)
    );
  };

  handleInfoModel = async (data) => {
    console.log("Handle Info Model Calling... Data : ", data);

    await services
      .GetFields(data.stream)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({ Fields: data.data.data });
      })
      .catch((error) => {
        console.log("Error : ", error);
      });

    this.setState(
      {
        Update: true,
        ShowApplicantInfo: false,
        open: true,
        open1: false,
        JobID: data.id,
        JobName: data.title,
        JobDescription: data.description,
        CompanyName: data.companyName,
        JobStream: data.stream,
        JobField: data.field,
        JobSalary: data.salary,
        JobDocumentUrl: data.documentUrl,
        IsActive: data.isActive,
      },
      console.log("handleInfoModel Calling ...")
    );
  };

  handleDeleteJob = async (ID) => {
    console.log("handleDeleteJob Calling ..... ID :", ID);
    await services
      .DeleteJob(Number(ID))
      .then((data) => {
        console.log("Data : ", data);
        this.setState({
          Message: data.data.message,
          OpenSnackBar: true,
          open1: false,
        });
        this.GetJobs(this.state.JobPageNumber);
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.setState({
          Message: "Something Went Wrong",
          OpenSnackBar: true,
          open1: false,
        });
      });
  };

  handleApplicationDeletion = async (ID) => {
    console.log("handleApplicationDeletion Calling ..... ID :", ID);
    await services
      .RejectApplication(Number(ID))
      .then((data) => {
        debugger;
        console.log("Data : ", data);
        this.setState({
          open1: false,
          open: false,
          OpenSnackBar: true,
          Message: data.data.message,
          ShowApplicantInfo: false,
        });
        this.GetApplication(this.state.ApplicationPageNumber);
      })
      .catch((error) => {
        debugger;
        console.log("Error : ", error);
        this.setState({
          open: false,
          open1: false,
          Message: "Something Went Wrong",
          OpenSnackBar: true,
        });
      });
  };

  handleDeleteFeedback = async (ID) => {
    console.log("handleDeleteJob Calling ..... ID :", ID);

    await feedbackServices
      .DeleteFeedback(ID)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({
          Message: data.data.message,
          OpenSnackBar: true,
        });
        this.GetFeedBack(this.state.FeedbackPageNumber);
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.setState({
          Message: "Something Went Wrong",
          OpenSnackBar: true,
        });
        this.GetFeedBack(this.state.FeedbackPageNumber);
      });
  };

  handleShowApplicantInfo = (data) => {
    console.log("handleShowApplicantInfo Calling ...");
    this.setState({
      ShowApplicantInfo: true,
      Update: false,
      open: true,
      ApplicationID: data.applicationID,
      JobID: data.jobID,
      JobName: data.jobTitle,
      Name: data.applicantName,
      Contact: data.contact,
      EmailID: data.emailID,
      Address: data.address,
      WorkExperience: data.workExperience,
      DateOfBirth: data.dateOfBirth,
      PassingYear: data.passingYear,
      CollegeName: data.collegeName,
      Degree: data.degree,
      CurrentStatus: data.currentStatus,
      Skill: data.skill,
      Age: data.age,
      Gender: data.gender,
      Pincode: data.pinCode,
      Percentage10: data.standerd10_Percentage,
      Percentage12: data.standerd12_Percentage,
      GradAggregation: data.graduation_Aggregation,
      StreamName: data.streamName,
    });
  };

  handleActiveChange = (e) => {
    console.log(" Checked Status : ", e.target.checked);
    this.setState({ IsActive: e.target.checked });
  };

  handlePaging = async (e, value) => {
    console.log("Current Page : ", value);

    if (this.state.OpenShow) {
      this.setState({
        JobPageNumber: value,
        ApplicationPageNumber: 1,
        FeedbackPageNumber: 1,
      });
      await this.GetJobs(value);
    } else if (this.state.OpenApplication) {
      this.setState({
        ApplicationPageNumber: value,
        JobPageNumber: 1,
        FeedbackPageNumber: 1,
      });
      await this.GetApplication(value);
    } else if (this.state.OpenFeedBack) {
      this.setState({
        FeedbackPageNumber: value,
        JobPageNumber: 1,
        ApplicationPageNumber: 1,
      });
      await this.GetFeedBack(value);
    }
  };

  handleField = (event) => {
    console.log("Selected Job Field : ", event.target.value);
    this.setState({ JobField: event.target.value });
  };

  handleJobStream = (event) => {
    console.log("Selected Stream : ", event.target.value);
    this.setState({ JobStream: event.target.value });
    services
      .GetFields(event.target.value)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({ Fields: data.data.data });
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  SelectField = () => {
    return this.state.Fields.map((data, index) => {
      //console.log(dt);
      return (
        <MenuItem value={data.fieldName} key={index} name={data.fieldName}>
          {data.fieldName}
        </MenuItem>
      );
    });
  };

  GetJobsList = (e) => {
    let self = this;
    return Array.isArray(this.state.JobsList) && this.state.JobsList.length > 0
      ? this.state.JobsList.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
                cursor: "pointer",
              }}
            >
              <div
                style={{ flex: 11, display: "flex" }}
                onClick={() => {
                  self.OpenFullInfo(data);
                }}
              >
                <div className="Row" style={{ flex: 1 }}>
                  {data.id}
                </div>
                <div className="Row" style={{ flex: 2 }}>
                  {data.title}
                </div>
                <div className="Row" style={{ flex: 2 }}>
                  {data.companyName}
                </div>
                <div className="Row" style={{ flex: 2 }}>
                  {data.stream}
                </div>
                <div className="Row" style={{ flex: 2 }}>
                  {data.field}
                </div>
                <div className="Row" style={{ flex: 1 }}>
                  {data.salary}
                </div>
                <div className="Row" style={{ flex: 1 }}>
                  {data.isActive ? <>Active</> : <>InActive</>}
                </div>
              </div>
              <div className="Row" style={{ flex: 1 }}>
                <IconButton
                  variant="outlined"
                  color="primary"
                  // size="medium"
                  onClick={() => {
                    self.handleInfoModel(data);
                  }}
                  // style={{ margin: '0 px 0 0' }}
                >
                  <EditIcon size="medium" />
                </IconButton>
                <IconButton
                  variant="outlined"
                  style={{ color: "black" }}
                  onClick={() => {
                    self.handleDeleteJob(data.id);
                  }}
                >
                  <DeleteIcon size="medium" />
                </IconButton>
              </div>
            </TableRow>
          );
        })
      : null;
  };

  GetApplicationList = (e) => {
    console.log("GetApplicationList Calling ... : ");
    let self = this;
    return Array.isArray(this.state.Application) &&
      this.state.Application.length > 0
      ? this.state.Application.map(function (data, index) {
          console.log("Application Data : ", data);
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
              }}
            >
              <div
                style={{ flex: 16, display: "flex" }}
                onClick={() => {
                  self.handleShowApplicantInfo(data);
                }}
              >
                <div className="Row1" style={{ flex: 1 }}>
                  {data.applicationID}
                </div>
                <div className="Row1" style={{ flex: 1 }}>
                  {data.jobID}
                </div>
                <div className="Row1" style={{ flex: 2 }}>
                  {data.jobTitle}
                </div>
                <div className="Row1" style={{ flex: 3 }}>
                  {data.applicantName}
                </div>
                <div className="Row1" style={{ flex: 2 }}>
                  {data.contact}
                </div>
                <div className="Row1" style={{ flex: 3 }}>
                  {data.emailID}
                </div>
                <div className="Row1" style={{ flex: 3 }}>
                  {data.address}
                </div>
                <div className="Row1" style={{ flex: 1 }}>
                  {data.workExperience}
                </div>
              </div>
              <div className="Row1" style={{ flex: 1 }}>
                <IconButton
                  variant="outlined"
                  style={{ color: "black" }}
                  onClick={(e) => {
                    self.handleDeleteApplication(data.applicationID);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </TableRow>
          );
        })
      : null;
  };

  GetFeedbackList = (e) => {
    let self = this;
    return Array.isArray(this.state.Feedback) && this.state.Feedback.length > 0
      ? this.state.Feedback.map(function (data, index) {
          return (
            <TableRow
              key={index}
              style={{
                height: "50px",
                display: "flex",
                borderBottom: "0.5px solid lightgray",
              }}
            >
              <div className="Row" style={{ flex: 1 }}>
                {data.feedbackID}
              </div>
              <div className="Row" style={{ flex: 8 }}>
                {data.feedBack}
              </div>
              <div className="Row" style={{ flex: 1 }}>
                <IconButton
                  variant="outlined"
                  style={{ color: "black" }}
                  onClick={() => {
                    self.handleDeleteFeedback(data.feedbackID);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </TableRow>
          );
        })
      : null;
  };

  SignOut = async () => {
    await localStorage.removeItem("admin_token");
    this.props.history.push("/SignIn");
  };

  OpenFullInfo = (data) => {
    this.setState({
      open1: true,
      ShowAllJobDetail: true,
      JobID: data.id,
      JobName: data.title,
      JobDescription: data.description,
      CompanyName: data.companyName,
      JobStream: data.stream,
      JobField: data.field,
      JobSalary: Number(data.salary),
      DocumentUrl: data.documentUrl,
      IsActive: data.isActive,
    });
  };

  handleDownload = (fileName, fileUrl) => {
    console.log(
      "handleDownload Method Calling .... File Name",
      fileName,
      " Url : ",
      fileUrl
    );
    //npm i file-saver
    saveAs(fileUrl, fileName);
  };

  render() {
    let state = this.state;
    let self = this;
    console.log("state : ", state);
    // authServices.AuthCheck("Admin");
    return (
      <div className="AdminDashboard-Container">
        <div className="Sub-Container">
          <div className="Header">
            <AppBar position="static" style={{ backgroundColor: "black" }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  className=""
                  color="inherit"
                  onClick={this.handleMenuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  Admin DashBoard
                </Typography>

                <Button
                  variant="outlined"
                  style={{ color: "white", marginRight: "50px" }}
                  onClick={this.handleOpen}
                >
                  Create Job Template &nbsp;
                  <InsertDriveFileIcon />
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    this.SignOut();
                  }}
                >
                  LogOut
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body">
              <div className={state.MenuOpen ? "SubBody11" : "SubBody12"}>
                <div
                  className={state.OpenShow ? "NavButton1" : "NavButton2"}
                  onClick={this.handleOpenList}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <VisibilityIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Jobs</div>
                  ) : null}
                </div>

                <div
                  className={
                    state.OpenApplication ? "NavButton1" : "NavButton2"
                  }
                  onClick={this.handleApplication}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <FolderIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Applicant</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenFeedBack ? "NavButton1" : "NavButton2"}
                  onClick={this.handleFeedBackOpen}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <FeedbackIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">FeedBack</div>
                  ) : null}
                </div>
              </div>
              <div className={state.MenuOpen ? "SubBody21" : "SubBody22"}>
                <div style={{ height: "90%", width: "90%" }}>
                  <TableContainer
                    component={Paper}
                    style={{ height: "fit-Content" }}
                  >
                    <Table aria-label="customized table">
                      <TableHead>
                        {state.OpenShow ? (
                          <TableRow
                            style={{
                              display: "flex",
                              minHeight: "50px",
                            }}
                          >
                            <div className="Header" style={{ flex: 1 }}>
                              JobID
                            </div>
                            <div className="Header" style={{ flex: 2 }}>
                              Job Title
                            </div>
                            {/* <div className="Header" style={{ flex: 2 }}>
                              Job Description
                            </div> */}
                            <div className="Header" style={{ flex: 2 }}>
                              Company Name
                            </div>
                            <div className="Header" style={{ flex: 2 }}>
                              Stream
                            </div>
                            <div className="Header" style={{ flex: 2 }}>
                              Field
                            </div>
                            <div className="Header" style={{ flex: 1 }}>
                              Salary
                            </div>
                            <div className="Header" style={{ flex: 1 }}>
                              Status
                            </div>
                            <div className="Header" style={{ flex: 1 }}></div>
                          </TableRow>
                        ) : state.OpenApplication ? (
                          <TableRow
                            style={{
                              display: "flex",
                              minHeight: "50px",
                            }}
                          >
                            <div className="Header" style={{ flex: 1 }}>
                              No
                            </div>
                            <div className="Header" style={{ flex: 1 }}>
                              JobID
                            </div>
                            <div className="Header" style={{ flex: 2 }}>
                              Job Name
                            </div>
                            <div className="Header" style={{ flex: 3 }}>
                              Name
                            </div>
                            <div className="Header" style={{ flex: 2 }}>
                              Contact
                            </div>
                            <div className="Header" style={{ flex: 3 }}>
                              EmailID
                            </div>
                            <div className="Header" style={{ flex: 3 }}>
                              Address
                            </div>
                            <div className="Header" style={{ flex: 1 }}>
                              Exp.
                            </div>
                            <div className="Header" style={{ flex: 1 }}></div>
                          </TableRow>
                        ) : state.OpenFeedBack ? (
                          <TableRow
                            style={{
                              display: "flex",
                              minHeight: "50px",
                            }}
                          >
                            <div className="Header" style={{ flex: 1 }}>
                              Feedback No
                            </div>
                            <div className="Header" style={{ flex: 8 }}>
                              Feedback
                            </div>
                            <div className="Header" style={{ flex: 1 }}></div>
                          </TableRow>
                        ) : null}
                      </TableHead>
                      <TableBody style={{ height: "fit-content" }}>
                        {state.OpenShow
                          ? this.GetJobsList()
                          : state.OpenApplication
                          ? this.GetApplicationList()
                          : state.OpenFeedBack
                          ? this.GetFeedbackList()
                          : null}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.open}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.open}>
                    {state.ShowApplicantInfo ? (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "1000px",
                          height: "630px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: 20,
                            color: "red",
                            margin: "0 0 20px 0",
                          }}
                        >
                          Application ID : {state.ApplicationID}
                        </div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div>
                            <div className="Input-Field">
                              <div className="Text">Job ID</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobID}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Job Name</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobName}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Name</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Name}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Contact</div>

                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Contact}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">EmailID</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.EmailID}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Address</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Address}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Work Experience</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.WorkExperience}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Date Of Birth</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.DateOfBirth}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Passing Year</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.PassingYear}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">PinCode</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Pincode}
                              </div>
                            </div>
                          </div>
                          <div>
                            {/* <div
                              className="Input-Field"
                              style={{ margin: "46px 0" }}
                            ></div> */}
                            <div className="Input-Field">
                              <div className="Text">10th Percentage</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Percentage10}%
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">12th Percentage</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Percentage12}%
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Grad. Aggregation</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.GradAggregation}%
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">College Name</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.CollegeName}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Degree</div>

                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Degree}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Current Status</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.CurrentStatus}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Skill</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Skill}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Age</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Age}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Gender</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.Gender}
                              </div>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Stream</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.StreamName}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="Input-Field"
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={() => {
                              this.handleDeleteApplication(state.ApplicationID);
                            }}
                          >
                            Reject Application
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ margin: "10px 0 0 10px" }}
                            onClick={this.handleClose1}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      //</div>
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "1000px",
                          height: "650px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div className="Input-Field1">
                          <div className="Text">Job Title</div>
                          <TextField
                            autoComplete="off"
                            error={state.JobNameFlag}
                            className="Text-Input"
                            label="Name"
                            variant="outlined"
                            size="small"
                            name="JobName"
                            value={state.JobName}
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Job Description</div>
                          <TextField
                            multiline
                            rows={6}
                            autoComplete="off"
                            className="Text-Input"
                            label="Description"
                            variant="outlined"
                            size="small"
                            name="JobDescription"
                            value={state.JobDescription}
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Company Name</div>
                          <TextField
                            autoComplete="off"
                            className="Text-Input"
                            label="Company Name"
                            variant="outlined"
                            size="small"
                            name="CompanyName"
                            value={state.CompanyName}
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Stream</div>
                          <FormControl
                            variant="outlined"
                            style={{ minWidth: 150 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              None
                            </InputLabel>

                            <Select
                              error={state.JobStreamFlag}
                              labelId="demo-simple-select-outlined-label"
                              value={state.JobStream}
                              onChange={this.handleJobStream}
                              label="Job Field"
                            >
                              {Array.isArray(this.state.Stream) &&
                              this.state.Stream.length > 0 ? (
                                this.state.Stream.map(function (data, index) {
                                  // console.log('Stream : ', data)
                                  return (
                                    <MenuItem
                                      value={data.streamName}
                                      key={index}
                                    >
                                      {data.streamName}
                                    </MenuItem>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </Select>
                          </FormControl>
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Job Field</div>
                          <FormControl
                            variant="outlined"
                            style={{ minWidth: 150 }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              None
                            </InputLabel>

                            <Select
                              error={state.JobFieldFlag}
                              labelId="demo-simple-select-outlined-label"
                              value={state.JobField}
                              onChange={this.handleField}
                              label="Job Field"
                            >
                              {state.JobStream !== "" &&
                              Array.isArray(this.state.Fields) &&
                              this.state.Fields.length > 0 ? (
                                this.state.Fields.map(function (data, index) {
                                  // console.log('Field : ', data.fieldName)
                                  return (
                                    <MenuItem
                                      value={data.fieldName}
                                      key={index}
                                    >
                                      {data.fieldName}
                                    </MenuItem>
                                  );
                                })
                              ) : (
                                <></>
                              )}
                            </Select>
                          </FormControl>
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Job Salary</div>
                          <TextField
                            autoComplete="off"
                            className="Text-Input"
                            label="Salary"
                            variant="outlined"
                            size="small"
                            name="JobSalary"
                            value={state.JobSalary}
                            type="number"
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div className="Input-Field1">
                          <div className="Text">Job Document Url</div>
                          <TextField
                            autoComplete="off"
                            className="Text-Input"
                            label="Document Url"
                            variant="outlined"
                            size="small"
                            name="JobDocumentUrl"
                            value={state.JobDocumentUrl}
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div className="Input-Field1">
                          <div
                            className="Text"
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            Job Is Active
                          </div>
                          <Switch
                            checked={state.IsActive}
                            onChange={this.handleActiveChange}
                            color="primary"
                            inputProps={{ "aria-label": "primary checkbox" }}
                          />
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          style={{ margin: "10px 0 0 0" }}
                          onClick={
                            state.Update ? this.handleUpdate : this.handleSubmit
                          }
                        >
                          {state.Update ? <>Update</> : <>Submit</>}
                        </Button>
                      </div>
                    )}
                  </Fade>
                </Modal>

                <Modal
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  open={this.state.open1}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.open1}>
                    {state.RejectApplication ? (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "500px",
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{
                            width: 450,
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Are you sure you want to Reject ApplicationID{" "}
                          {this.state.ApplicationID}
                        </div>
                        <Button
                          variant="contained"
                          color="Secondary"
                          component="span"
                          style={{ margin: "10px 0 0 0" }}
                          onClick={() => {
                            this.handleApplicationDeletion(state.ApplicationID);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          // color="primary"
                          component="span"
                          style={{
                            margin: "10px 0 0 0",
                            background: "black",
                            color: "white",
                          }}
                          onClick={() => {
                            this.handleClose1();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : state.ShowAllJobDetail ? (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "1100px",
                          height: "650px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Job ID</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobID}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Job Title</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobName}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: 1050, height: 250 }}
                            >
                              <div className="Text">Job Description</div>
                              <div
                                style={{
                                  width: "75%",
                                  height: "100%",
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  fontSize: "12px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  overflow: "scroll",
                                  whiteSpace: "break-spaces",
                                }}
                              >
                                {state.JobDescription}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Company Name</div>

                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.CompanyName}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Stream</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobStream}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Job Field</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobField}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Job Salary</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.JobSalary}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Download Job Brochure</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.DocumentUrl !== "" ? (
                                  <Button
                                    variant="contained"
                                    style={{
                                      backgroundColor: "Black",
                                      color: "white",
                                    }}
                                    className="SubButton"
                                    onClick={() => {
                                      this.handleDownload(
                                        "Job Brochure",
                                        state.DocumentUrl
                                      );
                                    }}
                                  >
                                    Download &nbsp; <GetAppIcon />
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                            <div
                              className="Input-Field1"
                              style={{ width: "1050px" }}
                            >
                              <div className="Text">Job Status</div>
                              <div
                                style={{
                                  color: "blue",
                                  fontFamily: "Roboto",
                                  fontWeight: "500",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                {state.IsActive ? <>Active</> : <>InActive</>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </Fade>
                </Modal>
              </div>
            </div>
            <Pagination
              count={this.state.TotalPages}
              Page={this.state.PageNumber}
              onChange={this.handlePaging}
              variant="outlined"
              shape="rounded"
              color="secondary"
            />
          </div>
        </div>
        <Backdrop
          style={{ zIndex: "1", color: "#fff" }}
          open={this.state.OpenLoader}
          onClick={() => {
            this.setState({ OpenLoader: false });
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={state.OpenSnackBar}
          autoHideDuration={2000}
          onClose={this.handleSnackBarClose}
          message={state.Message}
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackBarClose}
              >
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackBarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    );
  }
}
