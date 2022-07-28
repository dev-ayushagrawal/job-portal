import React, { Component } from "react";
import "./UserDashBoard.css";
import ProjectAdminServices from "../../services/ProjectAdminServices";
import ProjectUserServices from "../../services/ProjectUserServices";
import ProjectFeedbackServices from "../../services/ProjectFeedbackServices";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import PublicIcon from "@material-ui/icons/Public";
import FeedbackIcon from "@material-ui/icons/Feedback";
import Pagination from "@material-ui/lab/Pagination";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";

//Table Library
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import GetAppIcon from "@material-ui/icons/GetApp";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { white } from "material-ui/styles/colors";
import ClearIcon from "@material-ui/icons/Clear";
import { ClearAll } from "@material-ui/icons";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

const services = new ProjectAdminServices();
const userServices = new ProjectUserServices();
const feedbackServices = new ProjectFeedbackServices();

export default class UserDashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //
      JobID: 0,
      JobName: "",
      JobDescription: "",
      CompanyName: "",
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
      JobSalary: 0,
      DocumentUrl: "",
      IsActive: false,
      DegreeList: ["BE", "ME", "B.Tech", "M.Tech", "MCA", "BCA", "BCS"],
      Degree: "",
      CurrentStatusList: [
        "Employed",
        "Self-Employed",
        "Un-Employed",
        "Student",
      ],
      CurrentStatus: "",
      Skill: "",
      Age: "",
      GenderList: ["Male", "Female", "Trangender"],
      Gender: "",
      Pincode: "",
      Percentage10: "",
      Percentage12: "",
      GradAggregation: "",
      StreamName: "",
      //
      FeedBack: "",
      FeedBackFlag: false,
      //
      NameFlag: false,
      ContactFlag: false,
      EmailIDFlag: false,
      StreamNameFlag: false,
      //
      Message: "",
      //
      NumberOfRecordPerPage: 6,
      //
      PageNumber: 1,
      CurrentPage: 1,
      //
      Stream: [],
      StreamList: [],
      Fields: [],
      JobsList: [],
      Company: [],
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      MenuOpen: false,
      OpenLoader: false,
      OpenSnackBar: false,

      OpenShow: true,
      OpenArchive: false,
      OpenTrash: false,
      Open: false,
      Update: false,
      JobApply: false,
      PermenantlyDelete: false,
      ShowApplicantInfo: false,
    };
  }

  componentWillMount() {
    console.log("Component will mount calling ... ");
    if (localStorage.getItem("user_token") === null) {
      this.props.history.push("/SignIn");
    }
    this.GetStreams();
    this.handleJobFilter(
      this.state.CurrentPage,
      this.state.CompanyName,
      this.state.JobStream,
      this.state.JobField
    );
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
            Company: data.data.data1,
          });
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  }

  GetStreamList = async () => {
    await userServices
      .GetStreamList()
      .then((data) => {
        console.log("GetStreamList Data :", data);
        this.setState({ StreamList: data.data.data });
      })
      .catch((error) => {
        console.log("GetStreamList Error : ", error);
      });
  };

  handleJobFilter = (CurrentPage, companyName, JobStream, JobField) => {
    let data = {
      pageNumber: CurrentPage,
      numberOfRecordPerPage: 8,
      companyName: companyName,
      stream: JobStream,
      field: JobField,
    };
    userServices
      .JobFilter(data)
      .then((data) => {
        console.log("Data : ", data);
        if (data.data.data === null && CurrentPage > 1) {
          this.setState({ CurrentPage: CurrentPage - 1 });
          this.handleJobFilter(
            CurrentPage - 1,
            this.state.CompanyName,
            this.state.JobStream,
            this.state.JobField
          );
        } else {
          this.setState({
            JobsList: data.data.data,
            TotalPages: data.data.totalPage,
            PageNumber: CurrentPage,
          });
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  handleJobStream = async (event) => {
    console.log("Selected Stream : ", event.target.value);
    this.setState({ JobStream: event.target.value });
    await services
      .GetFields(event.target.value)
      .then((data) => {
        console.log("Data : ", data);
        this.setState({ Fields: data.data.data });
        this.handleJobFilter(
          this.state.PageNumber,
          this.state.CompanyName,
          event.target.value,
          this.state.JobField
        );
      })
      .catch((error) => {
        console.log("Error : ", error);
        this.handleJobFilter(
          this.state.PageNumber,
          this.state.CompanyName,
          event.target.value,
          this.state.JobField
        );
      });
  };

  handleCompanyName = async (e) => {
    console.log("Selected Company Name : ", e.target.value);
    this.setState({ CompanyName: e.target.value });
    this.handleJobFilter(
      this.state.PageNumber,
      e.target.value,
      this.state.JobStream,
      this.state.JobField
    );
  };

  handleFields = (event) => {
    console.log("Selected Job Field : ", event.target.value);
    this.setState({ JobField: event.target.value });
    this.handleJobFilter(
      this.state.PageNumber,
      this.state.CompanyName,
      this.state.JobStream,
      event.target.value
    );
  };

  GetJobs(CurrentPage) {
    console.log("Get Jobs List Calling ... ");
    let data = {
      pageNumber: this.state.PageNumber,
      numberOfRecordPerPage: 5,
    };

    services
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
            PageNumber: CurrentPage,
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
  }

  handleMenuButton = (e) => {
    console.log("Handle Menu Button Calling ... ");
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    });
  };

  handleOpen = () => {
    console.log("Handle Open Calling ... ");
    this.setState({
      open: true,
      OpenShow: true,
      OpenArchive: false,
      OpenTrash: false,
      TotalPages: !this.state.OpenInsert ? 0 : this.state.TotalPages,
    });
  };

  CheckValidity() {
    console.log("Check Validity Calling...");
    this.setState({
      NameFlag: false,
      ContactFlag: false,
      EmailIDFlag: false,
    });
    if (this.state.Name === "") {
      this.setState({ NameFlag: true });
    }
    if (this.state.Contact === "") {
      this.setState({ ContactFlag: true });
    }
    if (this.state.EmailID === "") {
      this.setState({ EmailIDFlag: true });
    }
  }

  handleSubmit = () => {
    this.CheckValidity();
    let State = this.state;
    if (State.Name !== "" && State.Contact !== "" && State.EmailID !== "") {
      let data = {
        jobID: State.JobID,
        jobTitle: State.JobName,
        applicantName: State.Name,
        contact: State.Contact,
        emailID: State.EmailID,
        address: State.Address,
        workExperience: State.WorkExperience,
        dateOfBirth: dayjs(State.DateOfBirth).format("DD-MM-YYYY"),
        passingYear: State.PassingYear,
        collegeName: State.CollegeName,
        degree: State.Degree,
        currentStatus: State.CurrentStatus,
        skill: State.Skill,
        age: Number(State.Age),
        gender: State.Gender,
        pinCode: Number(State.Pincode),
        standerd10_Percentage: Number(State.Percentage10),
        standerd12_Percentage: Number(State.Percentage12),
        graduation_Aggregation: Number(State.GradAggregation),
        streamName: State.StreamName,
      };

      userServices
        .InsertApplication(data)
        .then((data) => {
          this.setState({
            OpenSnackBar: true,
            Open: false,
            Message: data.data.message,
            JobApply: false,
          });
        })
        .catch((error) => {
          this.setState({
            OpenSnackBar: true,
            Open: false,
            Message: "Something Went Wrong",
            JobApply: false,
          });
        });
    } else {
      console.log("Please Fill Required Field");
      this.setState({
        OpenSnackBar: true,
        Message: "Please Fill Required Field",
      });
    }
  };

  handleClose = () => {
    console.log("Handle Close Calling ...");
    this.setState({
      Open: false,
      ShowApplicantInfo: false,
      Update: false,
      JobApply: false,
      PermenantlyDelete: false,
      JobID: "",
      JobName: "",
      JobDescription: "",
      CompanyName: "",
      JobStream: "",
      JobField: "",
      JobSalary: "",
      DocumentUrl: "",
      IsActive: false,
    });
  };

  handleFeedOpen = () => {
    this.setState({ Open: !this.state.Open });
  };

  handleJobApply = async (ID, Title) => {
    console.log("handleJobApply Open ID", ID, "Title", Title);
    await this.GetStreamList();
    this.setState({
      ShowApplicantInfo: false,
      Open: true,
      JobApply: true,
      JobID: ID,
      JobName: Title,
    });
  };

  handleChanges = (e) => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      console.log("Name : ", name, " value : ", value)
    );
  };

  handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ OpenSnackBar: false });
  };

  handleSubmitFeedback = async (e) => {
    this.setState({ FeedBackFlag: false });
    if (this.state.FeedBack) {
      let data = {
        feedback: this.state.FeedBack,
      };

      await feedbackServices
        .AddFeedback(data)
        .then((data) => {
          console.log("Feedback Data : ", data);
          this.setState({
            OpenSnackBar: true,
            FeedBackFlag: false,
            Open: false,
            Message: data.data.message,
          });
        })
        .catch((error) => {
          console.log("Feedback Error : ", error);
          this.setState({
            OpenSnackBar: true,
            FeedBackFlag: false,
            Open: false,
            Message: "Something Went Wrong.",
          });
        });
    } else {
      this.setState({
        OpenSnackBar: true,
        FeedBackFlag: true,
        Message: "Please Fill FeedBack",
      });
    }
  };

  handlePaging = (e, value) => {
    console.log("Current Page : ", value);
    this.handleJobFilter(
      value,
      this.state.CompanyName,
      this.state.JobStream,
      this.state.JobField
    );
  };

  SignOut = async () => {
    await localStorage.removeItem("user_token");
    this.props.history.push("/SignIn");
  };

  handleField = (event) => {
    console.log(
      "Selected Name :",
      event.target.name,
      " Value : ",
      event.target.value
    );
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  clearFilter = (e) => {
    this.setState({ CompanyName: "", JobStream: "", JobFilter: "" });
    this.handleJobFilter(this.state.PageNumber, "", "", "");
  };

  OpenFullInfo = (data) => {
    this.setState({
      Open: true,
      ShowApplicantInfo: true,
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
    console.log("State : ", state);

    return (
      <div className="UserDashBoard-Container">
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
                <Typography variant="h6" style={{ flexGrow: 2 }}>
                  User DashBoard
                </Typography>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: 150 }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Company
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: white }}
                    labelId="demo-simple-select-filled-label"
                    value={state.CompanyName}
                    onChange={this.handleCompanyName}
                  >
                    {Array.isArray(this.state.Company) &&
                    this.state.Company.length > 0 ? (
                      this.state.Company.map(function (data, index) {
                        // console.log('Stream : ', data)
                        return (
                          <MenuItem value={data.company} key={index}>
                            {data.company}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: 150, margin: "0 0 0 20px" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Stream
                  </InputLabel>
                  <Select
                    style={{ backgroundColor: white }}
                    labelId="demo-simple-select-filled-label"
                    value={state.JobStream}
                    onChange={this.handleJobStream}
                  >
                    {Array.isArray(this.state.Stream) &&
                    this.state.Stream.length > 0 ? (
                      this.state.Stream.map(function (data, index) {
                        // console.log('Stream : ', data)
                        return (
                          <MenuItem value={data.streamName} key={index}>
                            {data.streamName}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                </FormControl>
                <FormControl
                  variant="outlined"
                  style={{ minWidth: 150, margin: "0 0px 0 20px" }}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-filled-label">
                    Field
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    style={{ backgroundColor: white }}
                    value={state.JobField}
                    onChange={this.handleFields}
                    label="Job Field"
                    name="JobField"
                  >
                    {state.JobStream !== "" &&
                    Array.isArray(this.state.Fields) &&
                    this.state.Fields.length > 0 ? (
                      this.state.Fields.map(function (data, index) {
                        // console.log('Field : ', data.fieldName)
                        return (
                          <MenuItem value={data.fieldName} key={index}>
                            {data.fieldName}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                </FormControl>
                <IconButton
                  aria-label=""
                  style={{ margin: "0 50px 0 0px" }}
                  onClick={() => {
                    this.clearFilter();
                  }}
                >
                  <ClearIcon style={{ color: "white" }} />
                </IconButton>
                <Button
                  variant="outlined"
                  style={{ color: "white", marginRight: "50px" }}
                  onClick={() => {
                    this.handleFeedOpen();
                  }}
                >
                  Send Feedback &nbsp;
                  <FeedbackIcon />
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
                    <PublicIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Public Job</div>
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
                        <TableRow
                          style={{
                            display: "flex",
                            height: "50px",
                          }}
                        >
                          <div className="Header" style={{ flex: 1 }}>
                            JobID
                          </div>
                          <div className="Header" style={{ flex: 2 }}>
                            Job Title
                          </div>
                          <div className="Header" style={{ flex: 2 }}>
                            Company
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
                          <div className="Header" style={{ flex: 2 }}></div>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{ height: "fit-content" }}>
                        {Array.isArray(this.state.JobsList) &&
                        this.state.JobsList.length > 0
                          ? this.state.JobsList.map(function (data, index) {
                              return (
                                <TableRow
                                  key={index}
                                  style={{
                                    height: "50px",
                                    display: "flex",
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
                                  </div>
                                  <div className="Row" style={{ flex: 2 }}>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => {
                                        self.handleJobApply(
                                          data.id,
                                          data.title
                                        );
                                      }}
                                    >
                                      Apply
                                    </Button>
                                    {/* <Button variant="outlined" color="primary">
                                    Primary
                                  </Button> */}
                                  </div>
                                </TableRow>
                              );
                            })
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
                  open={this.state.Open}
                  // open={true}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.Open}>
                    {state.JobApply ? (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "1000px",
                          height: "600px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
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
                              <TextField
                                autoComplete="off"
                                error={state.NameFlag}
                                className="Text-Input"
                                label="Name"
                                variant="outlined"
                                size="small"
                                name="Name"
                                value={state.Name}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Contact</div>
                              <TextField
                                autoComplete="off"
                                error={state.ContactFlag}
                                className="Text-Input"
                                label="Contact"
                                variant="outlined"
                                size="small"
                                name="Contact"
                                value={state.Contact}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">EmailID</div>
                              <TextField
                                autoComplete="off"
                                error={state.EmailIDFlag}
                                className="Text-Input"
                                label="EmailID"
                                variant="outlined"
                                size="small"
                                name="EmailID"
                                value={state.EmailID}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Address</div>
                              <TextField
                                autoComplete="off"
                                // error={state.ProjectNameFlag}
                                className="Text-Input"
                                label="Address"
                                variant="outlined"
                                size="small"
                                name="Address"
                                value={state.Address}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Work Experience</div>
                              <TextField
                                autoComplete="off"
                                // error={state.ProjectNameFlag}
                                className="Text-Input"
                                label="Work Experience"
                                variant="outlined"
                                size="small"
                                name="WorkExperience"
                                value={state.WorkExperience}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Date Of Birth</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                // label="Date Of Year"
                                type="date"
                                placeholder="dd/MM/yyyy"
                                variant="outlined"
                                size="small"
                                name="DateOfBirth"
                                value={state.DateOfBirth}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Passing Year</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Passing Year"
                                placeholder="yyyy"
                                variant="outlined"
                                size="small"
                                name="PassingYear"
                                value={state.PassingYear}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">PinCode</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="PinCode"
                                placeholder="Ex: 4110048"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="Pincode"
                                value={state.Pincode}
                                onChange={this.handleChanges}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="Input-Field">
                              <div className="Text">10th Percentage</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Percentage"
                                placeholder="Ex. 80%"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="Percentage10"
                                value={state.Percentage10}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">12th Percentage</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Percentage"
                                placeholder="Ex. 63%"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="Percentage12"
                                value={state.Percentage12}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Grad. Aggregation</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Percentage"
                                placeholder="Ex. 72%"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="GradAggregation"
                                value={state.GradAggregation}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">College Name</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="College Name"
                                placeholder="Ex. IIT Bombay"
                                variant="outlined"
                                size="small"
                                name="CollegeName"
                                value={state.CollegeName}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Degree</div>
                              <FormControl
                                variant="outlined"
                                style={{ minWidth: 150 }}
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Degree
                                </InputLabel>

                                <Select
                                  error={state.DegreeFlag}
                                  labelId="demo-simple-select-outlined-label"
                                  value={state.Degree}
                                  name="Degree"
                                  onChange={this.handleField}
                                  label="Job Field"
                                >
                                  {Array.isArray(state.DegreeList) &&
                                  state.DegreeList.length > 0 ? (
                                    state.DegreeList.map(function (
                                      data,
                                      index
                                    ) {
                                      // console.log('Field : ', data.fieldName)
                                      return (
                                        <MenuItem value={data} key={index}>
                                          {data}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Current Status</div>
                              <FormControl
                                variant="outlined"
                                style={{ minWidth: 150 }}
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Status
                                </InputLabel>

                                <Select
                                  error={state.CurrentStatusFlag}
                                  labelId="demo-simple-select-outlined-label"
                                  value={state.CurrentStatus}
                                  name="CurrentStatus"
                                  onChange={this.handleField}
                                  label="Job Field"
                                >
                                  {Array.isArray(state.CurrentStatusList) &&
                                  state.CurrentStatusList.length > 0 ? (
                                    state.CurrentStatusList.map(function (
                                      data,
                                      index
                                    ) {
                                      // console.log('Field : ', data.fieldName)
                                      return (
                                        <MenuItem value={data} key={index}>
                                          {data}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Skill</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Skill"
                                placeholder="Ex. Coding etc."
                                variant="outlined"
                                size="small"
                                name="Skill"
                                type="text"
                                value={state.Skill}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Age</div>
                              <TextField
                                autoComplete="off"
                                className="Text-Input"
                                label="Age"
                                placeholder="Age: 24"
                                variant="outlined"
                                size="small"
                                type="number"
                                name="Age"
                                value={state.Age}
                                onChange={this.handleChanges}
                              />
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Gender</div>
                              <FormControl
                                variant="outlined"
                                style={{ minWidth: 150 }}
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Gender
                                </InputLabel>

                                <Select
                                  error={state.GenderFlag}
                                  labelId="demo-simple-select-outlined-label"
                                  value={state.Gender}
                                  name="Gender"
                                  onChange={this.handleField}
                                  label="Gender"
                                >
                                  {Array.isArray(state.GenderList) &&
                                  state.GenderList.length > 0 ? (
                                    state.GenderList.map(function (
                                      data,
                                      index
                                    ) {
                                      // console.log('Field : ', data.fieldName)
                                      return (
                                        <MenuItem value={data} key={index}>
                                          {data}
                                        </MenuItem>
                                      );
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="Input-Field">
                              <div className="Text">Stream</div>
                              <FormControl
                                variant="outlined"
                                style={{ minWidth: 150 }}
                                size="small"
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  Stream
                                </InputLabel>

                                <Select
                                  error={state.StreamNameFlag}
                                  labelId="demo-simple-select-outlined-label"
                                  value={state.StreamName}
                                  name="StreamName"
                                  onChange={this.handleField}
                                  // label="Job Field"
                                >
                                  {Array.isArray(state.StreamList) &&
                                  state.StreamList.length > 0 ? (
                                    state.StreamList.map(function (
                                      data,
                                      index
                                    ) {
                                      console.log("Field : ", data.streamName);
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
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={this.handleSubmit}
                          >
                            Submit Application
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ margin: "10px 0 0 10px" }}
                            onClick={this.handleClose}
                          >
                            Cancle
                          </Button>
                        </div>
                      </div>
                    ) : state.ShowApplicantInfo ? (
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
                    ) : (
                      <div
                        style={{
                          backgroundColor: "white",
                          boxShadow: "5",
                          padding: "2px 4px 3px",
                          width: "500px",
                          height: "250px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{ margin: "20px 0" }}
                        >
                          <TextField
                            error={this.state.FeedBackFlag}
                            id="outlined-multiline-static"
                            label="Feedback"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            name="FeedBack"
                            value={this.state.FeedBack}
                            onChange={this.handleChanges}
                          />
                        </div>
                        <div style={{ display: "flex" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: "10px 10px 0 0" }}
                            onClick={this.handleSubmitFeedback}
                          >
                            Submit Feedback
                          </Button>
                          <Button
                            variant="outlined"
                            style={{ margin: "10px 0 0 10px" }}
                            onClick={this.handleClose}
                          >
                            Cancle
                          </Button>
                        </div>
                      </div>
                    )}
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
