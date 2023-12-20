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
      <form>
        <div className="container-fluid bg-primary text-white p-2 mb-5 text-center rounded">
          <h2>
            <b>BALY</b>
          </h2>
        </div>
        <div className="container text-center p-4 text-primary">
          <h1>
            <b>Biker Portal </b>
          </h1>
        </div>
        <div className="container p-4 border rounded text-center text-dark">
          <div className="container border   border-3 pt-4 pb-4  rounded-circle">
            <h3>صفحة تسجيل الدخول </h3>
          </div>
          <div className="row d-flex justify-content-center align-items-center p-4 m-1">
            <div className="col-md-6 m-1">
              <div className="container-fluid">
                <input
                  type="text"
                  className="form-control text-center"
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
                  id="pwd"
                  placeholder="كلمة السر"
                  name="pswd"
                  onChange={handlePassword}
                />
              </div>
            </div>
          </div>

          <button
            className="btn btn-light border boder-light border-2 "
            onClick={async () => {
              await checkIfUsernameAndPasswordIsCorrect();
            }}
            onKeyDown={async () => {
              await checkIfUsernameAndPasswordIsCorrect();
            }}
          >
            تسجيل الدخول
          </button>
        </div>
      </form>
    </>
  );
}

export default Login;
