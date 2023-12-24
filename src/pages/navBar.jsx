import { useEffect } from "react";
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Loading from "./loading";
import { useNavigate } from "react-router-dom";
import { Biker_System_URL } from "../global";

// db password Qymbg5QhNbAzRn!

function NavBar() {
  const navigate = useNavigate();

  let navLinkClassName = "nav-link text-dark rounded ";

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  async function handleLogout() {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("token_exp_date");
    localStorage.removeItem("biker_id");
    localStorage.removeItem("biker_name");
    localStorage.removeItem("username");
    setLoading(false);
    navigate("/login", { replace: true });
  }

  //get saved token and send it to backend to check its permissions
  async function checkUserPermissions() {
    setLoading(true);
    var token = localStorage.getItem("token");

    await fetch(Biker_System_URL + "auth/user-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        alert(error);
      });
    setLoading(false);
  }

  useEffect(() => {
    checkUserPermissions();
  }, []);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark rounded ">
        <div className="container-fluid  d-flex justify-content-between">
          {/* Start of the main navbar content */}

          <Link className="nav-link text-primary" to="/home">
            <h3>
              <b>بلي</b>
            </h3>
          </Link>

          <button
            className="navbar-toggler bg-primary"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* End of the main navbar content */}

          {/* Start of the mobile menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav text-center">
              <li className="nav-item rounded m-1">
                <Link className={navLinkClassName} to="/home">
                  <h3>الصفحة الرئيسية</h3>
                </Link>
              </li>
              <li className="nav-item rounded border-4 m-1">
                <Link className={navLinkClassName} to="/compensations">
                  <h3>المكافئات</h3>
                </Link>
              </li>
              <li className="nav-item rounded border-4 m-1">
                <Link className={navLinkClassName} to="/penalties">
                  <h3>العقوبات</h3>
                </Link>
              </li>

              <li className="nav-item rounded m-1">
                <Link
                  className="nav-link  text-center rounded p-2 border  border-danger"
                  to="/login"
                  onClick={handleLogout}
                >
                  <h1>📤</h1>
                </Link>
              </li>
            </ul>
          </div>
          {/* End of the mobile menu */}
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default NavBar;
