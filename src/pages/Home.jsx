import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { Biker_System_URL } from "../global";
import NavBar from "./navBar";

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});
  const [overViewData, setOverViewData] = useState({});

  const [buttonStyle1, setButtonStyle1] = useState("text-primary");
  const [buttonStyle2, setButtonStyle2] = useState("text-dark");

  async function GetUserMetricesData(week) {
    setLoading(true);
    await fetch(Biker_System_URL + "portal/biker-metrics?week=" + week, {
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

        let tempTotalWeekOrders = 0;
        for (const day in data) {
          if (data.hasOwnProperty(day)) {
            // Check if there are orders for the day
            if (data[day].length > 0) {
              // Sum the total orders for the day
              tempTotalWeekOrders += data[day][0].total_orders;
            }
          }
        }

        setData(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  async function GetMetricesOverview(week) {
    setLoading(true);
    await fetch(
      Biker_System_URL + "portal/biker-metrics-overview?week=" + week,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
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

        setOverViewData(data);
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
    GetMetricesOverview(0);
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
              <b> الصفحة الرئيسية </b>
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
                  GetMetricesOverview(0);
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
                  GetMetricesOverview(1);
                }}
              >
                <h1> الأسبوع السابق</h1>
              </div>
            </div>
          </div>

          <hr />

          <div className="container text-center">
            <h2>
              <b>مخلص الأسبوع </b>
            </h2>
            {Object.entries(overViewData).length === 0 ? (
              ""
            ) : (
              <table className="table text-center">
                <tbody>
                  <tr>
                    <td>
                      <h3> {overViewData.delivered_orders} </h3>
                    </td>
                    <td>
                      <h3> الطلبات الواصلة </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3> {overViewData.offered_orders} </h3>
                    </td>
                    <td>
                      <h3> الطلبات المعروضة </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>
                        <h3> {overViewData.accepted_orders} </h3>
                      </b>
                    </td>
                    <td>
                      <h3> الطلبات المقبولة </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>{parseFloat(overViewData.dt_avg).toFixed(2)}</h3>
                    </td>
                    <td>
                      <h3> معدل وقت التوصيل </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 className="text-danger">
                        {"- " + overViewData.penalty_amount.toLocaleString()}
                      </h3>
                    </td>
                    <td>
                      <h3 className="text-danger"> العقوبات </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3> {overViewData.penalties} </h3>
                    </td>
                    <td>
                      <h3> عدد العقوبات </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3 className="text-success">
                        {"+ " +
                          overViewData.compensation_amount.toLocaleString()}
                      </h3>
                    </td>
                    <td>
                      <h3 className="text-success"> التعويضات </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3> {overViewData.compensations} </h3>{" "}
                    </td>
                    <td>
                      <h3> عدد التعويضات </h3>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          {/* {data.map(([day, dayData]) => (
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
              {dayData.map((item, index) => (
                <table className="table  table-striped text-center ">
                  <tbody>
                    <tr>
                      <td>
                        <h3> {item.total_orders} </h3>
                      </td>
                      <td>
                        <h3> الطلبات الكلية </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3> {item.accepted} </h3>
                      </td>
                      <td>
                        <h3> الطلبات الواصلة </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          <h3> {item.dt} </h3>
                        </b>
                      </td>
                      <td>
                        <h3>وقت التوصيل </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3>{item.offered} </h3>
                      </td>
                      <td>
                        <h3> الطلبات المعروضة </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3> {item.accepted}</h3>
                      </td>
                      <td>
                        <h3> الطلبات المقبولة </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3> {item.date_added} </h3>
                      </td>
                      <td>
                        <h3> التاريخ </h3>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ))}
            </div>
          ))} */}
        </div>
      )}
    </>
  );
}

export default HomePage;
