import Provider from "./context/Provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <Provider>
        <body>{children}</body>
      </Provider>
    </html>
  );
}
