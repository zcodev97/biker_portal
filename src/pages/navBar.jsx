import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// db password Qymbg5QhNbAzRn!

function NavBar() {
  const navigate = useNavigate();

  const [normalStyle, setnormalStyle] = useState(
    "nav-link text-dark text-center bg-light m-0 border-end border-2"
  );

  const [selectedButton, setSelectedButton] = useState(
    "nav-link text-light  text-center bg-primary rounded border rounded"
  );

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    localStorage.clear();

    setLoading(false);
    navigate("/login", { replace: true });
  }

  return (
    <>
      <div className="container-fluid"></div>
      <nav
        className="navbar navbar-expand-sm navbar-dark fixed-bottom"
        style={{
          marginTop: "50px",
          marginBottom: "-10px",
          marginLeft: "-12px",
          marginRight: "-15px",
        }}
      >
        <div className="container-fluid d-flex justify-content-around">
          {/* Start of the navbar links */}
          <ul className="navbar-nav d-flex flex-row w-100">
            <li className="nav-item flex-grow-1 text-center m-0">
              <Link className={normalStyle} to="/home">
                <p>🏠</p>
                <b className="text-dark">الرئيسية</b>
              </Link>
            </li>

            <li className="nav-item rounded flex-grow-1 m-0">
              <Link className={normalStyle} to="/compensations">
                <p>➕💵</p>
                <b className="text-success"> التعويضات</b>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/penalties">
                <p>➖💵</p>
                <b className="text-danger"> المخالفات</b>
              </Link>
            </li>

            <li className="nav-item rounded text flex-grow-1 m-0">
              <Link className={normalStyle} to="/payments">
                <p>💵</p>
                <b className="text-dark"> الدفعات</b>
              </Link>
            </li>

            {/* Logout button */}
            <li className="nav-item rounded flex-grow-1 m-0">
              <Link className={normalStyle} to="/login" onClick={handleLogout}>
                <p>📤</p>
                <b>خروج</b>
              </Link>
            </li>
            {/* End of the logout button */}
          </ul>
          {/* End of the navbar links */}
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default NavBar;
