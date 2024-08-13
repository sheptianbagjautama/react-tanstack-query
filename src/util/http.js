export async function fetchEvents({ signal, searchTerm }) {
  console.log("searchTerm", searchTerm);
  console.log("signal", signal);

  let url = "http://localhost:3000/events";

  if (searchTerm) {
    url += "?search=" + searchTerm;
  }

  //signal jika request ingin dibatalkan
  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}
