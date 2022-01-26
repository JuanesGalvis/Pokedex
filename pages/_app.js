function MyApp({ Component, pageProps }) {
  return (
    <div className={global.body}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
