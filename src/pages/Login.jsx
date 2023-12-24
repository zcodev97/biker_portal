import { useState, React, useEffect } from "react";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import { Biker_System_URL } from "../global";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function checkIfUsernameAndPasswordIsCorrect() {
    setLoading(true);
    await fetch(Biker_System_URL + "auth/login", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          return;
        }
        console.log(data);
        console.log(data.token.access_token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("token_exp_date", data.token_exp_date);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("biker_id", data.user.biker_id);
        localStorage.setItem("biker_name", data.user.biker_name);
        localStorage.setItem("groups", JSON.stringify(data.user.groups));
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  if (loading) return <Loading />;

  return (
    <>
      <form
        style={{
          minHeight: window.innerHeight,
          display: "grid",
          alignItems: "center",
        }}
      >
        <div className="container p-4     text-center text-dark">
          <div className="container text-primary  pt-4 pb-4 mb-4 rounded-circle">
            <h2>
              <b> BALY </b>
            </h2>
          </div>
          <div className="row d-flex justify-content-center align-items-center p-4 m-1">
            <div className="col-md-6 m-1">
              <div className="container-fluid">
                <input
                  type="text"
                  className="form-control text-center"
                  style={{ backgroundColor: "#e6e6e6" }}
                  id="email"
                  placeholder="أسم المستخدم"
                  name="email"
                  onChange={handleUsername}
                />
              </div>
            </div>
            <div className="col-md-6 m-1">
              <div className="container-fluid">
                <input
                  type="password"
                  className="form-control text-center"
                  style={{ backgroundColor: "#e6e6e6" }}
                  id="pwd"
                  placeholder="كلمة السر"
                  name="pswd"
                  onChange={handlePassword}
                />
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary "
            onClick={async () => {
              await checkIfUsernameAndPasswordIsCorrect();
            }}
            onKeyDown={async () => {
              await checkIfUsernameAndPasswordIsCorrect();
            }}
          >
            <b> دخول</b>
          </button>
        </div>
      </form>
    </>
  );
}

export default Login;
