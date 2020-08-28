import { IStory } from "./get-story";
import slugify from "slugify";

export function formatBranch(story: IStory): string {
  const characterLimit = process.env.CHARACTER_LIMIT
    ? parseInt(process.env.CHARACTER_LIMIT, 10)
    : 50;
  const baseLength = `${story.story_type}/`.length + `-#${story.id}`.length;
  const remainingLength = characterLimit - baseLength;
  const nameSlug = slugify(story.name.trim(), {
    lower: true,
  });

  if (nameSlug.length <= remainingLength) {
    return `${story.story_type}/${nameSlug}-#${story.id}`;
  }

  const nameWords = nameSlug.split("-");
  const usedWords: string[] = [];

  for (const word of nameWords) {
    if ([...usedWords, word].join("-").length > remainingLength) {
      break;
    }

    usedWords.push(word);
  }

  return `${story.story_type}/${usedWords.join("-")}-#${story.id}`;
}
