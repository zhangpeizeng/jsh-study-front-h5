function isDef(value) {
  return value !== undefined && value !== null;
}

function isObj(x) {
  const type = typeof x;
  return x !== null && (type === "object" || type === "function");
}

const { hasOwnProperty } = Object.prototype;

function assignKey(to, from, key) {
  const val = from[key];

  if (!isDef(val)) {
    return;
  }

  if (
    !hasOwnProperty.call(to, key) ||
    !isObj(val) ||
    typeof val === "function"
  ) {
    to[key] = val;
  } else {
    // eslint-disable-next-line no-use-before-define
    to[key] = deepAssign(Object(to[key]), from[key]);
  }
}

export function deepAssign(to, from) {
  Object.keys(from).forEach(key => {
    assignKey(to, from, key);
  });

  return to;
}
