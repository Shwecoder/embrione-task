import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Embrione Task",
  description: "Member Registration System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}