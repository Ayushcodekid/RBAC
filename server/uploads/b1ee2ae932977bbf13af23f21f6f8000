
import React, { useState, useEffect, useRef } from "react";
import email from "./../image/email.png";
import pass from "./../image/lock.png";
import logo from "./../image/logo (4).png";
import Spinner from "./Spinner.js";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";


function Login({ onChange, signIn, updateFormState, formState }) {
  const passwordInput = useRef(null);
  const emailInput = useRef(null);


  const [loading, setLoading] = useState(false);
  const [timeoutAlert, setTimeoutAlert] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);


  // useEffect(() => {
  //   // Push a dummy state to the history to prevent unintended navigation
  //   window.history.pushState(null, "", window.location.href);
    
  //   // Handle popstate event to prevent navigation
  //   const handlePopState = (event) => {
  //     window.history.pushState(null, "", window.location.href);
  //   };

  //   window.addEventListener("popstate", handlePopState);

  //   return () => {
  //     window.removeEventListener("popstate", handlePopState);
  //   };
  // }, []);


 


  const validateEmail = (email) => {
    const isValid =
      /^[a-zA-Z0-9._%+-]*[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        email
      );
    return isValid;
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
    if (passwordInput.current) {
      passwordInput.current.type = passwordVisible ? "password" : "text";
    }
  };

  let timeout;
  useEffect(() => {
    if (loading) {
      timeout = setTimeout(() => {
        setLoading(false);
        Swal.fire({
          title: "Timeout",
          text: "The page took too long to respond please try later",
          icon: "warning",
          confirmButtonColor: "rgba(13, 63, 69, 0.77)",
        });
      }, 10000);
    } else {
      clearTimeout(timeout);
      setTimeoutAlert(false);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn();
    } catch (error) {
      setLoading(false);
      if (
        error.message.includes(
          "Custom auth lambda trigger is not configured for the user pool"
        )
      ) {
        // alert("Sign In failed: Make sure to fill out the email and password fields.");
      } else {
        // alert("Sign In failed: " + error.message);
      }
    }

    setEmailError("");
    setPasswordError("");

    const { username, password } = formState;

    if (!username) {
      setEmailError("Please enter your email address.");
      return;
    }

    if (!validateEmail(username)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setPasswordError("Please enter your password.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await signIn(); // Assuming signIn is an asynchronous function for login
    } catch (error) {
      console.error("Error signing in:", error);
      // setPasswordError("Wrong password: Enter correct password and try again");
      if (error.message.includes("Network error")) {
        Swal.fire({
          title: "Network Error",
          text: "Please check your internet connection",
          icon: "warning",
          confirmButtonColor: "rgba(13, 63, 69, 0.77)",
        });
      } else if (
        error.message.includes("Pending sign-in attempt already in progress")
      ) {
        Swal.fire({
          title: "Login already in progress",
          text: "Login attempt already exists please wait!",
          icon: "warning",
          confirmButtonColor: "rgba(13, 63, 69, 0.77)",
        });
      } else if (error.message.includes("Password attempts exceeded")) {
        Swal.fire({
          title: "Password attempts exceeded",
          text: "Too many attempts, try again later or use Forgot password",
          icon: "warning",
          confirmButtonColor: "rgba(13, 63, 69, 0.77)",
        });
      } else if (
        error.message.includes(
          "User pool client 7g6bajjj4r6ii19knf18jkqvua does not exist."
        )
      ) {
        setPasswordError("Login failed!");
      } else if (error.message.includes("Incorrect username or password.")) {
        setPasswordError(
          "Wrong password:\n Enter correct password and try again"
        );
      } else {
        setPasswordError(error.message);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      handleLogin();
    }
  };

  const handleKeyPress1 = (event) => {
    if (event.key === "Enter") {
      focusNextInput(emailInput.current, passwordInput.current);
    }
  };

  const focusNextInput = (currentInput, nextInput) => {
    if (currentInput === emailInput.current && nextInput) {
      nextInput.focus();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      setEmailError(""); // Clear email error when user types in the email field
      // Check if the entered email is valid and display error if it's not
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address.");
      }
    }

    if (name === "password") {
      setPasswordError(""); // Clear password error when user types in the password field
      // Check if the entered password meets the criteria and display error if it doesn't
      if (value && !validatePassword(value)) {
        setPasswordError("");
      }
    }

    onChange(e);
  };

  return (
    <div className="login_img">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="main">
        <div className="left-sec-login">

          <div class="text-login">
            <p className="e3_login"> C2C - CONNECT 2 CONSTRUCT</p>

            <br />
            <div className="text-login-s"> 

            <h2>EVERYTHING EASY AND ECONOMICAL </h2>
            <br />
            </div>

            <div className="desc">
              <p>
                Construction application that gets you an easy access to
                building information, help create plan, schedule activities,
                provide resources, access to vendors for material and related
                services at your fingertips.
              </p>
            </div>
          </div>
          <div className="marketplace-container">
            <div className="marketplace-title">
              <h3>CHOOSE A PLAN</h3>
            </div>
            <div className="marketplace-cards">
              <div className="marketplace-card-one">
                <button className="feature-button">FEATURE/PLAN</button>
                <ul className="pay_list-styled-login ">
                  <li>Price </li>
                  <li> Number of projects </li>
                  <li> Storage in GB </li>
                  <li> Validity</li>

                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>
              </div>
              <div className="marketplace-card">
                <Link to="/plandetails" ><button className="free-button">FREE</button></Link>
                <ul className="pay_list-styled-card ">
                  <li>₹ 0 </li>
                  <li> 2 </li>
                  <li> 5 GB </li>
                  <li> 3 Months </li>

                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>
                <ul className="pay_list-styled-card-mobile ">
                  <li className="login_price">  ₹ 0 </li>
                  <li> Number of projects --------2 </li>
                  <li> Number of login-------1 user </li>
                  <li> Storage-----5 GB </li>

                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>
              </div>
              <div className="marketplace-card">
                <Link to="/Standard" ><button className="basic-button">BASIC</button></Link>
                <ul className="pay_list-styled-card ">
                  <li>₹ 499 </li>
                  <li> 4 </li>
                  <li> 10 GB </li>
                  <li> 6 Months </li>
                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>

                <ul className="pay_list-styled-card-mobile ">
                <li className="login_price">  ₹ 499 </li>
                  <li> Number of projects --------2 </li>
                  <li> Number of login-------4 user </li>
                  <li> Storage-----10 GB </li>
                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>
              </div>

              <div className="marketplace-card">
                <Link to="/premium" ><button className="premium-button">PREMIUM</button></Link>
                <ul className="pay_list-styled-card ">
                <li>₹ 999 </li>
                  <li> 10 </li>
                  <li> 100 GB </li>
                  <li> 12 Months </li>

                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>
                <ul className="pay_list-styled-card-mobile ">
                  <li className="login_price">  ₹ 999 </li>
                  <li> Number of projects --------2 </li>
                  <li> Number of login-------10 user </li>
                  <li> Storage-----100 GB </li>

                  {/* <Link to='premium'><li className='pay_feature' >MORE FEATURE </li></Link> */}
                </ul>
              </div>
            </div>
          </div>

        </div>




        <div className="right-sec-login">
          <p className="e3_login-mob">3E - CONSTRUCTIONS</p>

          <div className="sub-main">
            {/* <div> */}
            {/* <div className="title-logo"> */}
            <img src={logo} alt="logo" className="logo-pic" />
            {/* </div> */}
            {emailError && <p className="error">{emailError}</p>}
            <br />
            {passwordError && <p className="error">{passwordError}</p>}
            <br />
            <div className="input-fields-login">
              <div className="first-input">
                <IoMailOutline/>
                <input
                  ref={emailInput}
                  type="email"
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress1}
                  name="username"
                  placeholder="Email"
                  className="name"
                  required
                />
              </div>

              <br />


              <div className="second-input">
                <MdLockOutline/>
                <input
                  ref={passwordInput}
                  type="password"
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  name="password"
                  placeholder="Password"
                  className="name"
                  required
                />
                <div className="pass-visibility" onClick={togglePasswordVisibility}>
                  {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                </div>
              </div>
              <br />

              {/* <div className="loginbutton"> */}
              <button className="login_btn" onClick={handleLogin}>
                Login
              </button>
              {/* </div> */}
            </div>
            <p className="links">
              <br />
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  updateFormState(() => ({
                    ...formState,
                    formType: "forgotPassword",
                  }));
                  setLoading(true);
                }}
              >
                Forgot password?
              </p>
              <br />
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  updateFormState(() => ({
                    ...formState,
                    formType: "signUp",
                  }));
                  setLoading(true);
                }}
              >
                Sign Up
              </p>
            </p>
            <br />
            {/* </div> */}
          </div>
        </div>
        <div className="spinner">{loading && <Spinner />}</div>
      </div>
    </div>
  );
}

export default Login;
