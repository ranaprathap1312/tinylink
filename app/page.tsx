// app/page.tsx
import CreateLinkForm from "@/components/CreateLinkForm";
import LinkTable from "@/components/LinkTable";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="container">
      <Header />
      <main>
        <div className="card">
          <h2>Create New Short Link</h2>
          <CreateLinkForm />
        </div>
        <div className="card">
          <h2>Dashboard</h2>
          <LinkTable />
        </div>
      </main>
    </div>
  );
}