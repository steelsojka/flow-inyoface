export default function resolve(fn, args, defaultValue) {
  return typeof fn === 'function' ? fn(...args) : defaultValue;
}
