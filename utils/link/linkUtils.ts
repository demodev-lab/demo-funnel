// 링크 타입 결정
const getLinkType = (link: string) => {
  let linkType = "링크";

  if (link.includes("github.com")) linkType = "GitHub";
  else if (link.includes("codesandbox.io")) linkType = "CodeSandbox";
  else if (link.includes("codepen.io")) linkType = "CodePen";
  else if (link.includes("replit.com")) linkType = "Replit";
  else if (link.includes("stackblitz.com")) linkType = "StackBlitz";
    
  return linkType;
}

export const getLinkIcon = (link: string) => {
  let linkType = getLinkType(link);

  switch (linkType) {
    case "GitHub":
      return "G";
    case "CodeSandbox":
      return "CS";
    case "CodePen":
      return "CP";
    case "Replit":
      return "RP";
    case "StackBlitz":
      return "SB";
    default:
      return "🔗";
  }
};