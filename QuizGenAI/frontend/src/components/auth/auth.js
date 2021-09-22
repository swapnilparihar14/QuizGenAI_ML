import authStyles from "./auth.module.css";

const Auth = (props) => {
  return (<>
      <div className={authStyles.background}></div>
      <span className={authStyles.circle1}></span>
      <span className={authStyles.circle2}></span>
      <span className={authStyles.circle3}></span>
      <span className={authStyles.circle4}></span>
      <span className={authStyles.circle5}></span>

      {props.card}
    </>
  );
}

export default Auth;