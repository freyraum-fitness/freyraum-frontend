
export const toLogoPage = (location, history, path) => {
  let current = location.pathname;
  const i = current.indexOf('/m');
  if (i !== -1) {
    current = current.substring(0, i);
  }
  history.push(current + '/m' + path);
};

export const exitLogoPage = (location, history) => {
  let current = location.pathname;
  const i = current.indexOf('/m');
  if (i !== -1) {
    current = current.substring(0, i);
  }
  history.push(current);
};