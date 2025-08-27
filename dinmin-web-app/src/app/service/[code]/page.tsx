"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  where,
  type CollectionReference,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Types Firestore (sans id) */
type ProviderCore = {
  name: string;
  verified: boolean;
  experienceYears: number;
  ratingAvg?: number;
  priceFrom: number;
  categories: string[];
};

/** Type pour l’UI (avec id) */
type Provider = ProviderCore & { id: string };

/**
 * ⚠️ Next 15 tape maintenant `params` comme un Promise.
 * On prend `props: any` pour ne pas se battre avec les définitions internes,
 * puis on "unwrap" proprement avec React.use().
 */
export default function ServicePage(props: any) {
  const { code } = use(props.params as Promise<{ code: string }>);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const providersCol = collection(
          db,
          "providers"
        ) as CollectionReference<ProviderCore>;

        const q = query(providersCol, where("categories", "array-contains", code));
        const snap = await getDocs(q);
        const rows: Provider[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProviders(rows);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Prestataires — {code}</h2>

      {loading ? (
        <p className="text-sm text-gray-600">Chargement…</p>
      ) : providers.length === 0 ? (
        <p className="text-sm text-gray-600">Aucun prestataire trouvé pour cette catégorie.</p>
      ) : (
        <ul className="space-y-3">
          {providers.map((p) => (
            <li
              key={p.id}
              className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {p.name}{" "}
                  {p.verified && (
                    <span className="ml-2 text-xs bg-teal-600 text-white px-2 py-0.5 rounded">
                      vérifié
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {(p.ratingAvg ?? 0).toFixed(1)} ★ • {p.experienceYears} ans exp. • dès {p.priceFrom} CFA
                </div>
              </div>

              <Link
                href={`/provider/${p.id}`}
                className="text-sm bg-[#273469] text-white px-3 py-1.5 rounded"
              >
                Voir
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
cd dinmin-web-app
git add src/app/service/[code]/page.tsx
git commit -m "fix(next15): unwrap params with use() and relax prop typing"
git push origin main
