/*
 Must import all stylesheets here
 This default export is required in a new `pages/_app.js` file.
*/

import 'styles/index.scss'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
