"use client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

type Provider = {
  id: string;
  name: string;
  verified: boolean;
  experienceYears: number;
  ratingAvg: number;
  priceFrom: number;
};

export default function ServicePage({ params }: { params: { code: string } }) {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    (async () => {
      const snap = await getDocs(
        query(
          collection(db, "providers"),
          where("categories", "array-contains", params.code)
        )
      );
      setProviders(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Provider[]
      );
    })();
  }, [params.code]);

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">
        Prestataires — {params.code}
      </h2>
      <ul className="space-y-3">
        {providers.map((p: Provider) => (
          <li
            key={p.id}
            className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
          >
            <div>
              <div className="font-medium">
                {p.name}
                {p.verified && (
                  <span className="ml-2 text-xs bg-teal-600 text-white px-2 py-0.5 rounded">
                    Vérifié
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {p.ratingAvg?.toFixed(1)} ★ · {p.experienceYears} ans exp. · dès{" "}
                {p.priceFrom} FCFA
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
