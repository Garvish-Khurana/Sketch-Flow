export const defaultNodeStyles = {
  color: "#fffbe6",
  textColor: "#222222",
  fontFamily: "'Comic Neue','Patrick Hand',cursive",
  fontSize: 16,
  bold: false,
  italic: false,
  underline: false,
  backgroundType: "solid",
  width: 260,
  height: 170,
  icon: null,
  tags: [],
  priority: 0,
  theme: "paper",
  locked: false,
};

export function withDefaultNodeStyle(nodeData = {}) {
  return { ...defaultNodeStyles, ...nodeData };
}
