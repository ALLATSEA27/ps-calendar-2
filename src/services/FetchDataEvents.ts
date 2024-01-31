import { dataEvents } from "./Types/DataEvents";

export async function fetchDataEvents(): Promise<dataEvents[]> {
  try {
    const response = await fetch("https://amock.io/api/allatsea27/dataevents");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data as dataEvents[];

    return data.map((event: Partial<dataEvents>) => ({
      id: event.id,
      launchDate: event.launchDate,
      title: event.title,
      summary: event.summary,
      imageFilenameThumb: event.imageFilenameThumb,
      imageFilenameFull: event.imageFilenameFull,
      learnMoreLink: event.learnMoreLink,
      purchaseLink: event.purchaseLink,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
