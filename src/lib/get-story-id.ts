export function getStoryId(linkOrId: string): string {
  const linkRegex = /^https?:\/\/www\.pivotaltracker\.com\/story\/show\/(?<storyId>\d+)$/;
  const linkResult = linkRegex.exec(linkOrId);

  if (!linkResult?.groups?.["storyId"]) {
    throw new Error("Unable to parse story id");
  }

  return linkResult.groups["storyId"];
}
