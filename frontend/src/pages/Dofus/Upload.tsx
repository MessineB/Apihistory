import DofusUpload from "@/components/Dofus/DofusUpload";

export default function DofusPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload de fichier Dofus</h1>
      <a href="/"> Retour </a>
      <DofusUpload />
    </main>
  );
}
