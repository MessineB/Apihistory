"use client";

import { useEffect, useState } from "react";

interface DofusItem {
  id: string;
  dofusName: string;
  obtained: boolean;
  questAchieved: number;
}

const DofusAchivement = () => {
  const [dofusList, setDofusList] = useState<DofusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDofusData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/dofus/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Erreur lors de la récupération");

        const data = await res.json();
        setDofusList(data);
      } catch (error) {
        console.error("Erreur récupération Dofus :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDofusData();
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (!dofusList.length) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg text-gray-700 mb-2">
          📭 Aucune progression Dofus trouvée.
        </p>
        <a
          href="/Dofus/Upload"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Importer ma progression
        </a>
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <ul className="space-y-2">
        {dofusList.map((dofus) => (
          <li key={dofus.id} className="border rounded p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={`/images/dofus/${dofus.dofusName.toLowerCase().replace("dofus ", "").replace(/\s+/g, "-")}.png`}
              alt={dofus.dofusName}
              className="w-8 h-8"
            />
            <div>
              <p className="font-semibold">{dofus.dofusName}</p>
              <p>Quêtes faites : {dofus.questAchieved}</p>
            </div>
          </div>
          <span className="text-xl">{dofus.obtained ? "✅ Obtenu" : "❌ Non obtenu"}</span>
        </li>
        
        ))}
      </ul>
    </div>
  );
};

export default DofusAchivement;
