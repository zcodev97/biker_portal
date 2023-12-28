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
        <div className="container-fluid m-0 p-0">
          <NavBar />

          <div className="container-fluid text-center">
            <h5>الصفحة الرئيسية</h5>
          </div>
          <hr />
          <div className="container text-end pt-2 pb-2 ">
            <h4 style={{ color: "#666666" }}>
              <b>{localStorage.getItem("biker_name") + " "}</b>👤
            </h4>
          </div>
          <div className="row p-0 m-0">
            <div className="col-6 text-right m-0 ">
              <div className="next">
                <div
                  className={"container btn text-center" + buttonStyle2}
                  onClick={() => {
                    setButtonStyle2("text-primary");
                    setButtonStyle1("text-dark");
                    GetUserMetricesData(1);
                    GetMetricesOverview(1);
                  }}
                >
                  <h4> الأسبوع السابق</h4>
                </div>
              </div>
            </div>
            <div className="col-6 text-left m-0">
              <div className="previous">
                <div
                  className={"container btn text-center" + buttonStyle1}
                  onClick={() => {
                    setButtonStyle1("text-primary");
                    setButtonStyle2("text-dark");
                    GetUserMetricesData(0);
                    GetMetricesOverview(0);
                  }}
                >
                  <h4>هذا الأسبوع</h4>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="container-fluid text-center">
            {Object.entries(overViewData).length === 0 ? (
              ""
            ) : (
              <table className="table table-sm text-center p-0">
                <tbody>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b> {overViewData.delivered_orders} </b>
                      </h3>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b> الطلبات الواصلة </b>{" "}
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b> {overViewData.offered_orders} </b>
                      </h3>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b>الطلبات المعروضة </b>{" "}
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b>{overViewData.accepted_orders} </b>{" "}
                      </h3>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <h3>
                        <b> الطلبات المقبولة</b>
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b>
                          {" "}
                          {parseFloat(overViewData.dt_avg).toFixed(2)}{" "}
                        </b>{" "}
                      </h3>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <h3>
                        {" "}
                        <b> معدل وقت التوصيل </b>{" "}
                      </h3>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>
                      <p className="text-danger">
                        {"- " + overViewData.penalty_amount.toLocaleString()}
                      </p>
                    </td>
                    <td>
                      <p className="text-danger"> العقوبات </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p> {overViewData.penalties} </p>
                    </td>
                    <td>
                      <p> عدد العقوبات </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="text-success">
                        {"+ " +
                          overViewData.compensation_amount.toLocaleString()}
                      </p>
                    </td>
                    <td>
                      <p className="text-success"> التعويضات </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p> {overViewData.compensations} </p>{" "}
                    </td>
                    <td>
                      <p> عدد التعويضات </p>{" "}
                    </td>
                  </tr> */}
                </tbody>
              </table>
            )}
          </div>

          <table
            className="
          table table-striped text-center"
          >
            <thead>
              <tr>
                <td>وقت التوصيل</td>
                <td>عدد الطلبات</td>

                <td>اليوم</td>
              </tr>
            </thead>

            <tbody className="text-dark">
              {data.map((i) => (
                <tr>
                  <td>{i.dt}</td>
                  <td>{i.total_orders}</td>

                  <td>
                    {i.week_day === "Sunday"
                      ? "الأحد"
                      : i.week_day === "Monday"
                      ? "الأثنين"
                      : i.week_day === "Tuesday"
                      ? "الثلاثاء"
                      : i.week_day === "Wednesday"
                      ? "الاربعاء"
                      : i.week_day === "Thursday"
                      ? "الخميس"
                      : i.week_day === "Friday"
                      ? "الجمعة"
                      : "السبت"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default HomePage;
