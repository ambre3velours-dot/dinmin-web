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

type ProviderCore = {
  name: string;
  verified: boolean;
  experienceYears: number;
  ratingAvg?: number;
  priceFrom: number;
  categories: string[];
};

type Provider = ProviderCore & { id: string };

export default function ServicePage(props: any) {
  // Next 15: params est un Promise côté build -> on unwrap avec use()
  const { code } = use(props.params as Promise<{ code: string }>);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const col = collection(
          db,
          "providers"
        ) as CollectionReference<ProviderCore>;
        const q = query(col, where("categories", "array-contains", code));
        const snap = await getDocs(q);
        setProviders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
        <p className="text-sm text-gray-600">
          Aucun prestataire trouvé pour cette catégorie.
        </p>
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
                  {(p.ratingAvg ?? 0).toFixed(1)} ★ • {p.experienceYears} ans
                  exp. • dès {p.priceFrom} CFA
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
