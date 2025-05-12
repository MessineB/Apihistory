import { useAuth } from "@/context/auth-context";
import DofusUpload from "@/components/Dofus/DofusUpload";

export default function DofusPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Upload de fichier Dofus</h1>
      <a href="/" className="text-blue-500 underline">Retour</a>

      {isAuthenticated ? (
        <DofusUpload />
      ) : (
        <p className="text-red-600 font-semibold">
          🔒 Vous devez être connecté pour importer votre progression.{" "}
          <a href="/Sign-up" className="text-blue-600 underline">Créer un compte</a> ou{" "}
          <a href="/Login" className="text-blue-600 underline">se connecter</a>.
        </p>
      )}
    </main>
  );
}
