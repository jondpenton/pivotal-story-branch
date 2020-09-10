import { IProject } from './get-projects'
import axios from 'axios'

export interface IStory {
  id: number
  name: string
  story_type: 'feature' | 'bug' | 'chore' | 'release'
}

export async function getStory(
  projects: IProject[],
  storyId: string
): Promise<IStory> {
  for (const project of projects) {
    try {
      const response = await axios.get<IStory>(
        `https://www.pivotaltracker.com/services/v5/projects/${project.id}/stories/${storyId}`,
        {
          headers: {
            'X-TrackerToken': process.env.PIVOTAL_TRACKER_TOKEN,
          },
        }
      )
      return response.data
    } catch (err) {}
  }

  throw new Error('Unable to find story')
}
