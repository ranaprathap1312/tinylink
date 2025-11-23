// components/LinkTable.tsx
"use client";

import { useEffect, useState } from "react";

interface Link {
  id: number;
  code: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default function LinkTable() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Refetch links from server (so click count updates!)
  const fetchLinks = async () => {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied: " + text);
  };

  const deleteLink = async (code: string) => {
    if (!confirm("Delete this link forever?")) return;
    const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
    if (res.ok) {
      fetchLinks(); // Refresh list after delete
    } else {
      alert("Failed to delete");
    }
  };

  if (loading) return <p style={{color: "#e9d5ff"}}>Loading links...</p>;
  if (links.length === 0) return <p style={{color: "#e9d5ff"}}>No links yet. Create one!</p>;

  return (
    <div className="card">
      <table style={{width: "100%", borderCollapse: "separate", borderSpacing: "0 12px"}}>
        <thead>
          <tr>
            <th>Short Link</th>
            <th>Target URL</th>
            <th>Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id}>
              <td>
                <code>{link.code}</code>
              </td>
              <td>
                <a href={link.targetUrl} target="_blank" rel="noopener" style={{color: "#c4b5fd"}}>
                  {link.targetUrl.length > 50 ? link.targetUrl.slice(0, 50) + "..." : link.targetUrl}
                </a>
              </td>
              <td style={{textAlign: "center", fontWeight: "bold", color: "#a78bfa"}}>
                {link.clicks}
              </td>
              <td>
                {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"}
              </td>
              <td style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem"}}>
                {/* COPY BUTTON — LEFT */}
                <button
                  onClick={() => copyToClipboard(`${baseUrl}/${link.code}`)}
                  style={{
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    color: "white",
                    border: "none",
                    padding: "0.65rem 1.3rem",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Copy
                </button>

                {/* DELETE BUTTON — FAR RIGHT */}
                <button
                  onClick={() => deleteLink(link.code)}
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    color: "white",
                    border: "none",
                    padding: "0.65rem 1.3rem",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(220, 38, 38, 0.5)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}