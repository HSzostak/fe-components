class Utils {
  debounce(func, wait) {
    let timeout;

    return function() {
      const functionCall = fn.apply(this, arguments);
      clearTimeout(timeout);
      timeout = setTimeout(func, wait);
    };
  }
}

export default Utils;