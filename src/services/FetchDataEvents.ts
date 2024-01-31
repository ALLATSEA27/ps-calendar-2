import { dataEvents } from "./Types/DataEvents";

export async function fetchDataEvents(): Promise<dataEvents[]> {
  try {
    const response = await fetch("https://amock.io/api/allatsea27/dataevents");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data as dataEvents[];
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
