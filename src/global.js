// const Biker_System_URL = "https://portal.foodbi.giize.com/api/";
// const Biker_System_URL = "http://0.0.0.0:8090/";
const Biker_System_URL = "http://0.0.0.0:8090/api/";

const SortDays = (data) => {
  const dayOrder = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return data.sort((a, b) => dayOrder[a.week_day] - dayOrder[b.week_day]);
};

export { Biker_System_URL, SortDays };
