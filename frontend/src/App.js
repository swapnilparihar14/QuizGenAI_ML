import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignUp from "./components/auth/Signup/Signup";
import LogIn from "./components/auth/Login/Login";

function App() {
  return (
    // Use Browser Router to route to different pages
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LogIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={LogIn} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
