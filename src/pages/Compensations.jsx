import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { Biker_System_URL } from "../global";
import NavBar from "./navBar";

function CompensationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});

  const [buttonStyle1, setButtonStyle1] = useState("text-primary");
  const [buttonStyle2, setButtonStyle2] = useState("text-dark");

  async function GetUserMetricesData(week) {
    setLoading(true);
    await fetch(Biker_System_URL + "portal/biker-compensations?week=" + week, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail === "Given token not valid for any token type") {
          navigate("/login", { replace: true });
          return;
        }
        if (data.detail) {
          alert(data.detail);
          return;
        }
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    GetUserMetricesData(0);
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid">
          <NavBar />
          <div className="container text-center">
            <h2>
              <b> المكافئات </b>
            </h2>
          </div>
          <div className="container text-end pt-2 pb-2 ">
            <h3>
              <b>{localStorage.getItem("biker_name") + " "}</b>👤
            </h3>

            <hr />
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div
                className={
                  "container btn text-center   p-2 mt-2 " + buttonStyle1
                }
                onClick={() => {
                  setButtonStyle1("text-primary");
                  setButtonStyle2("text-dark");
                  GetUserMetricesData(0);
                }}
              >
                <h1>هذا الأسبوع</h1>
              </div>
            </div>
            <div className="col-sm-6">
              <div
                className={
                  "container btn text-center  p-2 mt-2 " + buttonStyle2
                }
                onClick={() => {
                  setButtonStyle2("text-primary");
                  setButtonStyle1("text-dark");
                  GetUserMetricesData(1);
                }}
              >
                <h1> الأسبوع السابق</h1>
              </div>
            </div>
          </div>

          <hr />

          {Object.entries(data).map(([day, dayData]) => (
            <div className="container text-center border rounded p-4 mt-1">
              <h3 style={{ fontSize: "30px" }}>
                {day === "Sunday"
                  ? "الأحد"
                  : day === "Monday"
                  ? "الأثنين"
                  : day === "Tuesday"
                  ? "الثلاثاء"
                  : day === "Wednesday"
                  ? "الاربعاء"
                  : day === "Thursday"
                  ? "الخميس"
                  : day === "Friday"
                  ? "الجمعة"
                  : "السبت"}
              </h3>

              <table className="table">
                <thead>
                  <tr>
                    <td>
                      <h3> تاريخ المكافئة </h3>
                    </td>

                    <td>
                      <h3> مقدار المكافئة </h3>
                    </td>
                    <td>
                      <h3> سبب المكافئة</h3>
                    </td>
                  </tr>
                </thead>
              </table>
              {dayData.map((item, index) => (
                <table className="table  table-striped text-center ">
                  <tbody>
                    <tr>
                      <td>
                        <b>
                          <h3> {item.date} </h3>
                        </b>
                      </td>

                      <td>
                        <h3> {item.amount.toLocaleString()} </h3>
                      </td>
                      <td>
                        <h3> {item.reason} </h3>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default CompensationsPage;
