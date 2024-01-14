import { useEffect, useState } from "react";
import NavBar from "./navBar";
import { Biker_System_URL } from "../global";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function PaymentsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [selectedDateRangeInfo, setSelectedDateRangeInfo] = useState([]);

  // date ranges drop down menu
  const [selectedDateRange, setSelectedDateRange] = useState("");
  const [DateRangesDropDownMenu, setDateRangesDropDownMenu] = useState([]);
  let dateRangesTempArr = [];
  // load all date ranges
  async function loadDates() {
    setLoading(true);
    await fetch(Biker_System_URL + "portal/biker-payment-periods", {
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

        data.forEach((source) => {
          dateRangesTempArr.push({
            label: " من " + source.from_date + " الى " + source.to_date,
            value:
              "from_date=" + source.from_date + "&to_date=" + source.to_date,
          });
        });
        setDateRangesDropDownMenu(dateRangesTempArr);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  //load selected date range info
  async function loadSelectedDateRangeInfo(date) {
    setLoading(true);
    await fetch(Biker_System_URL + "portal/biker-payment?" + date, {
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
        setSelectedDateRangeInfo(data);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    loadDates();
  }, []);

  return (
    <>
      <NavBar />
      <div className="container pt-4 text-center">
        <h2>الدفعات</h2>
      </div>

      <div className="container text-end pt-2 pb-2 ">
        <p style={{ color: "#666666" }}>
          <b>{localStorage.getItem("biker_name") + " "}</b>👤
        </p>
      </div>
      <hr />

      {/* drop down menu to select date */}
      <Select
        className="text-center"
        defaultValue={selectedDateRange}
        options={DateRangesDropDownMenu}
        onChange={(opt) => {
          setSelectedDateRange(opt.value);
          loadSelectedDateRangeInfo(opt.value);
        }}
        placeholder={"تاريخ الدفعة"}
      />
      {/* result of selected date  */}

      {selectedDateRangeInfo.length === 0 ? (
        <div className="container text-dark text-center pt-4">
          <h3> اختر تاريخ الدفعة</h3>
        </div>
      ) : (
        <div
          className="container-fluid pt-2"
          style={{ maxHeight: "calc(100vh - 400px)", overflowY: "auto" }}
        >
          <table
            className="
            table table-lg  table-striped text-center"
          >
            <tbody
              className="text-dark"
              style={{ fontSize: "20px", fontWeight: "normal" }}
            >
              <tr>
                <td>{selectedDateRangeInfo[0].tier}</td>
                <td> الفئة</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].earnings_single_orders.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> مبلغ الطلبات المفردة</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].earnings_batch_orders.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> مبلغ الطلبات المزدوجة</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].gross_earnings.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> مجموع المبلغ الاولي للطلبات</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].weekly_incentive.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> المسابقة الاسبوعية </td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].hourly_incentive.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> المسابقات اليومية ان وجدت</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].total_value_penalties.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> مجموع مبلغ الخصومات</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].compensations.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> مجموع مبلغ التعويضات</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].procurement_deductions.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> مجموع الاستقطاعات</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].net_salary.toLocaleString("en-US", {
                    style: "currency",
                    currency: "IQD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td> الراتب النهائي</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].salary_app_wallet.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> المبلغ على محفظة التطبيق</td>
              </tr>
              <tr>
                <td>
                  {selectedDateRangeInfo[0].salary_zain_cash.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "IQD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    }
                  )}
                </td>
                <td> المبلغ على الزين كاش</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// [
//     {
//       "from_date": "2024-01-14",
//       "to_date": "2024-01-14",
//       "tier": "string",
//       "earnings_single_orders": 0,
//       "earnings_batch_orders": 0,
//       "gross_earnings": 0,
//       "weekly_incentive": 0,
//       "hourly_incentive": 0,
//       "total_value_penalties": 0,
//       "compensations": 0,
//       "procurement_deductions": 0,
//       "net_salary": 0,
//       "salary_app_wallet": 0,
//       "salary_zain_cash": 0
//     }
//   ]

export default PaymentsPage;
