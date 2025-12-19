import "@/styles/AdminFooter.css";
import { AiOutlineCopyrightCircle } from "react-icons/ai";

export function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="footer-left">
        <p>
          <AiOutlineCopyrightCircle /> {currentYear} Campify | Admin Panel — All rights reserved | 
          Developed By <a href="https://mohamedazizomri.netlify.app" target="_blank" rel="noopener noreferrer">Mohamed Aziz Omri</a>
        </p>
      </div>
    </footer>
  );
}
