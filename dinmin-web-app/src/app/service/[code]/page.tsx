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

// Types
type ProviderCore = {
  name: string;
  verified: boolean;
  experienceYears: number;
  ratingAvg?: number;
  priceFrom: number;
  categories: string[];
};
type Provider = ProviderCore & { id: string };

// 👇 NOTE: params est un Promise en Next 15
export default function ServicePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  // On "unwrap" le Promise grâce à React.use()
  const { code } = use(params);

  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    (async () => {
      const providersCol = collection(db, "providers") as CollectionReference<ProviderCore>;
      const q = query(providersCol, where("categories", "array-contains", code));
      const snap = await getDocs(q);
      const rows: Provider[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProviders(rows);
    })();
  }, [code]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Prestataires — {code}
      </h2>

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
                {p.ratingAvg?.toFixed(1) ?? "—"} ★ • {p.experienceYears} ans exp. • dès {p.priceFrom} CFA
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
    </section>
  );
}
