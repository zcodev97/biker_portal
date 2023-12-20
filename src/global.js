const Biker_System_URL = "http://portal.foodbi.giize.com/api/";

async function LoginAPI() {
  var token = localStorage.getItem("token");

  await fetch(Biker_System_URL + "auth", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.status)
    .catch((error) => {
      alert(error);
      return null;
    });
}

export { Biker_System_URL };
