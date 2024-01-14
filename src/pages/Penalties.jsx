import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "./loading";
import { Biker_System_URL } from "../global";
import NavBar from "./navBar";

function PenaltiesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [buttonStyle1, setButtonStyle1] = useState(" text-primary ");
  const [buttonStyle2, setButtonStyle2] = useState(" text-dark ");

  async function GetUserMetricesData(week) {
    setLoading(true);
    await fetch(Biker_System_URL + "portal/biker-penalties?week=" + week, {
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
        // console.log(data);
        setData(data);
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
    setcurrentWeekDates(getCurrentWeekDates());
    setpreviousWeekDates(getPreviousWeekDates());
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container">
          <NavBar />
          <div className="container pt-4 text-center">
            <h2>المخالفات</h2>
          </div>
          <div className="container text-end pt-2 pb-2 ">
            <p>
              <b>{localStorage.getItem("biker_name") + " "}</b>👤
            </p>

            <hr />
          </div>
          <div className="row p-0 m-0">
            <div className="col-6 text-right m-0 ">
              <div className="next">
                <div
                  className={"container btn text-center " + buttonStyle2}
                  onClick={() => {
                    setButtonStyle2(" text-primary");
                    setButtonStyle1(" text-dark");
                    GetUserMetricesData(1);
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
                    setButtonStyle1(" text-primary");
                    setButtonStyle2(" text-dark");
                    GetUserMetricesData(0);
                  }}
                >
                  <p>هذا الأسبوع</p>
                  <p>
                    {formatDate(currentWeekDates.startDate)} <br />
                    {formatDate(currentWeekDates.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div
            className="container"
            style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}
          >
            <table
              className="
          table table-md  table-striped text-center"
            >
              <thead>
                <tr>
                  <td> التاريخ </td>
                  <td> مقدار المخالفة </td>
                  <td style={{ wordWrap: "break-word" }}> السبب</td>

                  <td>اليوم</td>
                </tr>
              </thead>

              <tbody className="text-dark text-center">
                {data.map((i) => (
                  <tr>
                    <td>
                      <div className="text-center" style={{ width: "100px" }}>
                        {i.date}
                      </div>
                    </td>
                    <td>
                      {i.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "IQD",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ wordWrap: "break-word" }}> {i.reason}</td>

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
        </div>
      )}
    </>
  );
}

export default PenaltiesPage;
