import axios from "axios";

export interface IProject {
  id: number;
  name: string;
}

export async function getProjects(): Promise<IProject[]> {
  const response = await axios.get<IProject[]>(
    "https://www.pivotaltracker.com/services/v5/projects",
    {
      headers: {
        "X-TrackerToken": process.env.TOKEN,
      },
    }
  );

  return response.data;
}
