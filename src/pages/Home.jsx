import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { Biker_System_URL } from "../global";
import NavBar from "./navBar";

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [userData, setUserData] = useState({});

  async function handleLogout() {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    setLoading(false);
    // console.log(showNavBar);
    navigate("/login", { replace: true });
  }

  async function handleGetUserData() {
    setLoading(true);
    await fetch(
      Biker_System_URL +
        "portal/biker-metrics?select_date=" +
        year +
        "-" +
        month +
        "-" +
        day,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          return;
        }
        console.log(data);
        setUserData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <NavBar />
          <div className="row">
            <div className="col-md-4">
              <div className="container-fluid mt-1">
                <input
                  type="text"
                  className="form-control text-center"
                  id="email"
                  placeholder="سنة"
                  name="email"
                  onChange={(event) => {
                    setYear(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="container-fluid mt-1">
                <input
                  type="text"
                  className="form-control text-center"
                  id="email"
                  placeholder="شهر"
                  name="email"
                  onChange={(event) => {
                    setMonth(event.target.value);
                  }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="container-fluid mt-1">
                <input
                  type="text"
                  className="form-control text-center"
                  id="email"
                  placeholder="يوم"
                  name="email"
                  onChange={(event) => {
                    setDay(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="container border border-2 rounded mt-1 mb-1">
            <h5 className="text-center">
              <b> تقرير بتاريخ</b>
            </h5>
            <hr />
            <div className="container text-center">
              <h5> {year + "-" + month + "-" + day}</h5>
            </div>
          </div>

          <div className="container text-dark text-center">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td> {userData.biker_id}</td>
                  <td>بايكر ايدي</td>
                </tr>
                <tr>
                  <td> {userData.name}</td>
                  <td> أسم البايكر</td>
                </tr>

                <tr>
                  <td> {userData.total_orders}</td>
                  <td> عدد الطبات</td>
                </tr>

                <tr>
                  <td> {userData.dt}</td>
                  <td> وقت التوصيل</td>
                </tr>
                <tr>
                  <td> {userData.offered}</td>
                  <td> الطبات الكلية</td>
                </tr>

                <tr>
                  <td> {userData.accepted}</td>
                  <td> الطبات المقبولة</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="container text-center">
            <div
              className="btn border border-success border-2 rounded mt-2 mb-2"
              onClick={handleGetUserData}
            >
              تنفيذ
            </div>
          </div>
          <div className="container text-center">
            <div
              className="btn  rounded border border-2 border-danger mt-2 mb-2"
              onClick={handleLogout}
            >
              تسجيل خروج
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
