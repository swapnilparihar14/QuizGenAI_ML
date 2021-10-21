import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignUp from "./components/auth/Signup/Signup";
import LogIn from "./components/auth/Login/Login";
import LandPage from "./components/landpage/Landpage";
import CreateQuizForm from "./components/create_quiz_form/CreateQuizForm";
import ReviewQuestions from "./components/review_questions/ReviewQuestions";
import TakeQuiz from "./components/take_quiz/TakeQuiz";
import PracticeQuiz from "./components/practice_quiz/PracticeQuiz";
import TakeQuizQuestions from "./components/take_quiz_questions/TakeQuizQuestions";
import MyQuizzes from "./components/my_quizzes/MyQuizzes";
import ShowCreatedQuiz from "./components/show_quizzes_results/show_created_quiz/showCreatedQuiz";
import QuizResults from "./components/quiz_results/QuizResults"

function App() {
  return (
    // Use Browser Router to route to different pages
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={LandPage} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={LogIn} />
        <Route path="/create_quiz" component={CreateQuizForm} />
        <Route path="/review_questions" component={ReviewQuestions} />
        <Route path="/take_quiz" component={TakeQuiz} />
        <Route path="/practice_quiz" component={PracticeQuiz} />
        <Route path="/quiz_results" component={QuizResults} />
        <Route path="/take_quiz_questions" component={TakeQuizQuestions} />
        <Route exact path="/my_quizzes" component={MyQuizzes} />
        <Route exact path="/my_quizzes/created/:quizid" component={ShowCreatedQuiz} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
