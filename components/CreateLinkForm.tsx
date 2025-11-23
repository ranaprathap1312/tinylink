"use client";

import { useState } from "react";

export default function CreateLinkForm() {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUrl: url, code: code || undefined }),
    });

    if (res.ok) {
      const data = await res.json();
      alert(`Created! ${location.origin}/${data.code}`);
      setUrl("");
      setCode("");
      window.location.reload();
    } else {
      const err = await res.json();
      alert(err.error || "Failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/very/long/url"
        required
      />
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Custom code (optional, 6-8 chars)"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Shorten URL"}
      </button>
    </form>
  );
}