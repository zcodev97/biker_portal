import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { Biker_System_URL, SortDays } from "../global";
import NavBar from "./navBar";

// text-wrap for table
// ff rate for each day  for overview and selected week
// add date range for selected week
// sort days (edited)

function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
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

        const sortedData = SortDays(data);

        setData(sortedData);
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
  function formatDate(date) {
    return date ? date.toISOString().split("T")[0] : null;
  }

  function getCurrentWeekDates() {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const diff = currentDay - 0;
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - diff);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return { startDate, endDate };
  }

  function getPreviousWeekDates() {
    const { startDate, endDate } = getCurrentWeekDates();

    // Check if startDate and endDate are not undefined before formatting
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const previousWeekStartDate = new Date(startDate);
    previousWeekStartDate.setDate(startDate.getDate() - 7);

    const previousWeekEndDate = new Date(endDate);
    previousWeekEndDate.setDate(endDate.getDate() - 7);

    return {
      startDate: formatDate(previousWeekStartDate),
      endDate: formatDate(previousWeekEndDate),
    };
  }
  // Example usage
  const [currentWeekDates, setcurrentWeekDates] = useState({});
  const [previousWeekDates, setpreviousWeekDates] = useState({});

  useEffect(() => {
    GetUserMetricesData(0);
    GetMetricesOverview(0);
    setcurrentWeekDates(getCurrentWeekDates());
    setpreviousWeekDates(getPreviousWeekDates());
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container-fluid m-0 p-0">
          <NavBar />

          <div className="container-fluid  text-center">
            <h4>الصفحة الرئيسية</h4>
          </div>
          <hr />
          <div className="container text-end pt-2 pb-2 ">
            <p style={{ color: "#666666" }}>
              <b>{localStorage.getItem("biker_name") + " "}</b>👤
            </p>
          </div>
          <div className="row p-0 m-0">
            <div className="col-6 text-right m-0 ">
              <div className="next">
                <div
                  className={"container btn text-center " + buttonStyle2}
                  onClick={() => {
                    setButtonStyle2("text-primary");
                    setButtonStyle1("text-dark");
                    GetUserMetricesData(1);
                    GetMetricesOverview(1);
                    setpreviousWeekDates(getPreviousWeekDates());
                  }}
                >
                  <p> الأسبوع السابق</p>
                  <p>
                    {previousWeekDates.startDate} <br />
                    {previousWeekDates.endDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-6 text-left m-0">
              <div className="previous">
                <div
                  className={"container btn text-center " + buttonStyle1}
                  onClick={() => {
                    setButtonStyle1("text-primary");
                    setButtonStyle2("text-dark");
                    GetUserMetricesData(0);
                    GetMetricesOverview(0);
                    setcurrentWeekDates(getCurrentWeekDates());
                  }}
                >
                  <p> هذا الأسبوع </p>
                  <p>
                    {formatDate(currentWeekDates.startDate)}
                    <br />
                    {formatDate(currentWeekDates.endDate)}
                  </p>
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
                      <p>
                        <b>{overViewData.delivered_orders}</b>
                      </p>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <p>
                        <b> عدد الطلبات الكلي </b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <p>
                        <b>{overViewData.single_orders}</b>
                      </p>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <p>
                        <b> الطلبات المفردة </b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <p>
                        <b>{overViewData.batch_orders}</b>
                      </p>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <p>
                        <b> الطلبات المزدوجة </b>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <p>
                        <b>{parseFloat(overViewData.dt_avg).toFixed(2)}</b>
                      </p>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <p>
                        <b>وقت الوصول للمطعم + وقت الوصول للزبون</b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ color: "#4d4d4d" }}>
                      <p>
                        <b>
                          {parseFloat(overViewData.extra_distance).toFixed(2)}
                        </b>
                      </p>
                    </td>
                    <td className="text-end" style={{ color: "#4d4d4d" }}>
                      <p>
                        <b> المسافات الطويلة </b>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          <div className="container-fluid" style={{ overflowY: "auto" }}>
            <table
              className="
          table table-sm table-striped"
              style={{ marginBottom: "50vh" }}
            >
              <thead className="text-center">
                <tr>
                  <td>
                    <b> المسافات الطويلة </b>
                  </td>
                  <td>
                    <b> وقت الوصول للمطعم + وقت الوصول للزبون</b>
                  </td>
                  <td>
                    <b> الطلبات المفردة </b>
                  </td>
                  <td>
                    <b> الطلبات المزدوجة </b>
                  </td>
                  <td>
                    <b> عدد الطلبات الكلي</b>
                  </td>
                  <td>
                    <b> اليوم</b>
                  </td>
                </tr>
              </thead>
              <tbody className="text-center">
                {data.length === 0
                  ? ""
                  : data.map((i) => (
                      <tr>
                        <td>
                          <p>{parseFloat(i.extra_distance).toFixed(2)}</p>
                        </td>
                        <td>
                          <p>{i.dt}</p>
                        </td>
                        <td style={{ color: "#4d4d4d" }}>
                          <b>{i.single_orders}</b>
                        </td>
                        <td style={{ color: "#4d4d4d" }}>
                          <p>{i.batch_orders}</p>
                        </td>
                        <td>
                          <p>{i.total_orders}</p>
                        </td>

                        <td>
                          <p>
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
                          </p>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
