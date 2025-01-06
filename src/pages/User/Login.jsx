
import { useRef, useState } from 'react';
import useraxios from '../../axiosConfig';
import './user.css';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Hooks/AuthContext';
import { useContext } from 'react';
import { UserLoginInfo } from "../../App"; 

function Login() {
  const { setUser } = useContext(UserLoginInfo); // Access the context
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const emailDom = useRef();
  const passwordDom = useRef();
  const { login } = useContext(AuthContext);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const howHandle = () => {
    navigate("/HowItWorks");
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      const axiosResponse = await useraxios.post('/users/login', {
        email: emailDom.current.value,
        password: passwordDom.current.value
      });
     
      const { token } = axiosResponse.data;
      localStorage.setItem("user-token", token);

      login(); // Update login state
     

      try {
        const userResponse = await useraxios.get('/users/check', {
          headers: { Authorization: `Bearer ${token}` } // Include token for authenticated request
        });

        // Ensure you only update with the user data (not the entire response)
        const userData = userResponse.data; // Assuming response contains user data
        
        setUser(userData); // Update the context with the user data
        navigate("/");
        
        await Swal.fire({
          title: "Success!",
          text: "User logged in successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);

      await Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container_forum">
      <section>
        <div className="main_body">
          <form className="form" onSubmit={handleForm} method="POST">
            <center>
              <p style={{ fontFamily: 'Arial' }}>
                Log in to your account <br /><br />
              </p>
              <span>
                Don't have an account? <Link to="/register">Create account</Link>
              </span>
            </center>

            <input
              type="email"
              id="username"
              name="email"
              placeholder="Email"
              ref={emailDom}
              className="input1"
              required
            />

            <div className="input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Your password"
                ref={passwordDom}
                required
              />
              <button type="button" onClick={handleTogglePassword} className="icon-button">
                {showPassword ? "🙉" : "🙈"}
              </button>
            </div>

            <Link to="" style={{ textAlign: 'right' }}>Forgot Password</Link>

            <button className="form_button" type="submit">
              Login
            </button>

            <center>
              <span>
                I agree to the <Link to="/privacy">privacy policy</Link> and{' '}
                <Link to="/terms">terms of service</Link><br />
              </span>
            </center>
          </form>

          <div className="text_sec">
            <Link to="/about" className="link">
              <span style={{ color: '#FF8C00', fontSize: '20px' }}>About</span>
            </Link>
            <br /><br />
            <span className="title_text">Evangadi Networks</span><br /><br />
            <span>
              No matter what stage of life you are in, whether you’re just starting elementary school or being promoted to CEO of a Fortune 500 company, you have much to offer to those who are trying to follow in your footsteps.
              Whether you are willing to share your knowledge or you are just looking to meet mentors of your own, please start by joining the network here.
            </span><br /><br />
            <button className="how_button" onClick={howHandle}>HOW IT WORKS</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
