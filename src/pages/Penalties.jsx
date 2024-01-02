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
        <div className="container">
          <NavBar />
          <div className="container text-center">
            <h3>المخالفات</h3>
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
                </div>
              </div>
            </div>
          </div>

          <div className="container text-center">
            {data.length === 0 ? "" : data[0] && data[0].date + "  👉  "}
            {data.length === 0
              ? ""
              : data[data.length - 1] && data[data.length - 1].date}
          </div>
          <hr />

          <div className="container">
            <table
              className="
          table table-responsive table-striped text-center"
              style={{
                tableLayout: "fixed",
              }}
            >
              <thead>
                <tr>
                  <td> التاريخ </td>
                  <td> مقدار المخالفة </td>
                  <td style={{ wordWrap: "break-word" }}> السبب</td>

                  <td>اليوم</td>
                </tr>
              </thead>

              <tbody className="text-dark">
                {data.map((i) => (
                  <tr>
                    <td>{i.date}</td>
                    <td>{i.amount}</td>
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
