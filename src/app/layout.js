import "./globals.css";
import Provider from "./components/context/provider";

export const metadata = {
  title: "The App - ITransition",
  description: "Task #4: ITransition Interns",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
