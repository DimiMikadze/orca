# Store

Global application state implemented using React Context API and React Hooks.

### How to add new state

1. Create new file in this folder, for boilerplate check `auth.js` or `message.js`
2. Add it's Initial state and Reducer to store.js
3. Then you can use it in component by importing `useStore` hook and by destructuring specific key from it, e.g `const [{ auth }] = useStore();`
