//The code in this file is from Stephen Grider's udemy course available at https://www.udemy.com/course/javascript-beginners-complete-tutorial/

const debounce = (func, delay = 1000) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
