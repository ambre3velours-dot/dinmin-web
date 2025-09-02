"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Provider = {
  id: string;
  name: string;
  verified: boolean;
  experienceYears: number;
  ratingAvg: number;
  priceFrom: number;
};

export default function ServicePage(props: { params: Promise<{ code: string }> }) {
  const { code } = use(props.params); // ✅ Next.js 15: unwrap params with use()
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const snap = await getDocs(
        query(collection(db, "providers"), where("categories", "array-contains", code))
      );
      setProviders(snap.docs.map(d => ({ id: d.id, ...(d.data() as Provider) })));
    };
    fetchProviders();
  }, [code]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Prestataires – {code}</h2>
      <ul className="space-y-3">
        {providers.map((p) => (
          <li key={p.id} className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
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
                {p.ratingAvg?.toFixed(1)} ★ · {p.experienceYears} ans exp. · dès {p.priceFrom} CFA
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
