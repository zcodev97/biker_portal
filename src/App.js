import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "./pages/loading";
import { Biker_System_URL } from "./global";
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import CompensationsPage from "./pages/Compensations";
import PenaltiesPage from "./pages/Penalties";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getSavedUserInLocalStorage() {
    setLoading(true);

    var token = localStorage.getItem("token");

    if (token === null || token === "") {
      setLoggedIn(false);

      setLoading(false);

      return;
    }

    fetch(Biker_System_URL + "auth/user-info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.detail) {
          alert(data.detail);
          setLoggedIn(false);
          return;
        }
        setLoggedIn(true);
      })
      .catch((error) => {
        alert(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getSavedUserInLocalStorage();
  }, []);

  return (
    <div className="container-fluid" style={{ height: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              loading ? <Loading /> : loggedIn ? <HomePage /> : <Login />
            }
          />

          <Route path="/home" element={<HomePage />} />
          <Route path="/compensations" element={<CompensationsPage />} />
          <Route path="/penalties" element={<PenaltiesPage />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
