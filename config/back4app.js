import Parse from 'https://cdn.skypack.dev/parse';

const APP_ID = 'SxhMBsTSB2BasoZQecw9KyixCwyDMK8cyQwx9T7f';
const JS_KEY = 'oFVQJKq96RoamUqC6EfbPdnIJBlA5V4ii6ZF6riF';

Parse.initialize(APP_ID, JS_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';

console.log('✅ Back4App (Parse) client initialized');

export { Parse };
