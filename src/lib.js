export const createElement = (tag, classNames, ...children) => {
  const element = document.createElement(tag);
  if (classNames !== undefined) {
    const classes = classNames.split(' ');
    classes.forEach(className => element.classList.add(className));
  }

  children.forEach(child => (typeof child !== 'string'
    ? element.appendChild(child)
    : element.appendChild(document.createTextNode(child))));

  return element;
};

export const rgbToHex = (arr) => {
  const arrHex = arr.map((x) => {
    const num = parseInt(x, 10).toString(16);
    return (num.length === 1) ? `0${num}` : num;
  });
  return `#${arrHex.join('')}`;
};
