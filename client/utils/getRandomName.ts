import {
  adjectives,
  colors,
  uniqueNamesGenerator,
  animals,
} from "unique-names-generator";

export const randomName: string = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals],
  separator: "",
  style: "capital",
});
