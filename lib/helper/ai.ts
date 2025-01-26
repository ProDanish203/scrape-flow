export const extractJSON = (markdownText: string) => {
  const jsonRegex = /```json\n([\s\S]*?)```/;
  const match = markdownText.match(jsonRegex);

  if (match && match[1]) {
    try {
      // Parse the extracted JSON
      return JSON.parse(match[1].trim());
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }

  try {
    return JSON.parse(markdownText);
  } catch (error) {
    console.error("Error parsing entire response:", error);
    return null;
  }
};
