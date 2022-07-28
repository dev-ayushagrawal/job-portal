import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Auth from "./components/Auth";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserDashboard from "./components/Dashboard/UserDashBoard";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={SignUp} />
          <Route exact path="/SignIn" component={SignIn} />
          {/* <Route exact path="/AdminDashboard" component={AdminDashboard} /> */}
          {/* <Route exact path="/UserDashboard" component={UserDashboard} /> */}
          <Auth Role="Admin" path="/AdminDashboard" component={AdminDashboard}/>
          <Auth Role="User" path="/UserDashboard" component={UserDashboard}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
