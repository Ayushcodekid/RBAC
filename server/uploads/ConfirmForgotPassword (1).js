





import React, { useState, useEffect } from "react";
import logo from "./../image/logo.png";
import pass from "./../image/lock.png";
import back from "../image/back4.png";
import "./forgotpassword.css";
import { MdLockOutline } from "react-icons/md";



const ConfirmForgotPassword = ({ formState, onChange, confirmForgotPassword, updateFormState }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    // Push a dummy state to the history to prevent unintended navigation
    window.history.pushState(null, "", window.location.href);

    // Handle popstate event to prevent navigation
    const handlePopState = (event) => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);



  const validateOtp = (otp) => {
    if (!otp) {
      console.error('OTP validation error: Please enter the verification code.');
      return 'Please enter the verification code.';
    }
    return null;
  };

  const validateNewPassword = (newpassword) => {
    if (!newpassword) {
      console.error('New password validation error: Please enter a new password.');
      return 'Please enter a new password.';
    } else if (newpassword.length < 8) {
      console.error('New password validation error: Password must be at least 8 characters long.');
      return 'Password must be at least 8 characters long.';
    }
    return null;
  };

  const handleConfirmForgotPassword = async () => {
    const { otp, newpassword } = formState;

    const otpError = validateOtp(otp);
    const newPasswordError = validateNewPassword(newpassword);

    const newErrors = {
      otp: otpError,
      newpassword: newPasswordError,
    };

    // Remove null values from newErrors
    Object.keys(newErrors).forEach(key => newErrors[key] === null && delete newErrors[key]);

    // Update errors state with new validation results
    setErrors(newErrors);

    // If there are no errors, proceed with confirmForgotPassword
    if (Object.keys(newErrors).length === 0) {
      try {
        // Call confirmForgotPassword with OTP and new password
        await confirmForgotPassword();
        // Password reset successful, handle success state or navigate to another page
      } catch (error) {
        console.error('Error confirming forgot password:', error);
        const errorMessage = error.message;

        if (errorMessage.includes('Invalid verification code provided, please try again.')) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            otp: 'Incorrect verification code. Please try again.'
          }));
        } else if (errorMessage.includes('Invalid code provided, please request a code again.')) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: 'Invalid code provided'
          }));
        }
        else if (errorMessage.includes('Attempt limit exceeded, please try after some time.')) {
          setErrors((prevErrors) => ({
            general: 'limit exceeded'
          }));
        }
        else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: 'An unexpected error occurred. Please try again later.'
          }));
        }
      }
    }
  };

  return (
    <div className='img'>
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <div className="back_signup">
        <img src={back} onClick={() => { updateFormState(() => ({ ...formState, formType: "signIn", })); setLoading(true) }} className="back-signup"></img>
      </div>
      <div className="main">



        <div className="left-sec-fp">

          <div class="text-login">
            <p className="e3_login"> C2C </p>

            <br />
            <h2>CONNECT 2 CONSTRUCT</h2>
            <br />

            <div className="desc">
              <p>
                Construction application that gets you an easy access to
                building information, help create plan, schedule activities,
                provide resources, access to vendors for material and related
                services at your fingertips.
              </p>
            </div>
          </div>
        </div>



        <div className='right-sec-fp'>
          <p className="e3_login-mob"> CONNECT 2 CONSTRUCT</p>

          <div className="sub-main-fp">
            <div className="cfp-input">
              <div className='title-logo'>
                <img src={logo} alt="logo" className="logo-pic" />
              </div>

              {errors.general && <p className="error">{errors.general}</p>}

              <div className="input-fields-cfp">

                <div className="input-container-cfp">
                  <MdLockOutline />
                  <input
                    name="otp"
                    className="cfpname"
                    placeholder="Verification code"
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.otp && <p className="error-message-cfp">{errors.otp}</p>}


                <div className="input-container-cfp">
                  <MdLockOutline />
                  <input
                    type="password"
                    name="newpassword"
                    className="cfpname"
                    placeholder="New Password"
                    onChange={onChange}
                    required
                  />
                </div>
                {errors.newpassword && <p className="error-message-cfp">{errors.newpassword}</p>}
                <button onClick={handleConfirmForgotPassword}>Submit</button>

                <br></br>
                <a style={{ textDecoration: "underline" }} onClick={() => updateFormState(() => ({ ...formState, formType: "signIn" }))}>Login</a>
                <br></br>
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmForgotPassword;
