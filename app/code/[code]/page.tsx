import { notFound } from "next/navigation";

interface Link {
  code: string;
  targetUrl: string;
  clicks: number;
  lastClicked: string | null;
  createdAt: string;
}

export default async function StatsPage({ params }: { params: { code: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/links/${params.code}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const link: Link = await res.json();
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-bold mb-8">Link Statistics</h1>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600">Short URL</p>
              <div className="flex items-center gap-3 mt-1">
                <code className="text-xl font-mono bg-gray-100 px-4 py-2 rounded-lg">
                  {shortUrl}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    alert("Copied!");
                  }}
                  className="text-blue-600"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Target URL</p>
              <a href={link.targetUrl} target="_blank" className="text-blue-600 hover:underline block mt-1">
                {link.targetUrl}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-4xl font-bold mt-2">{link.clicks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Clicked</p>
                <p className="text-xl font-medium mt-2">
                  {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "Never"}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t">
              <a href="/" className="text-blue-600 hover:underline">
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}