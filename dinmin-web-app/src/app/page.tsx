import Link from "next/link";

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="bg-[#F5E8D3] rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-[#273469]">
          Trouvez le bon service, au bon moment.
        </h1>
        <p className="mt-2">Prestataires vérifiés. Paiement sécurisé.</p>
        <Link
          href="/catalog"
          className="inline-block mt-4 bg-[#FF715B] text-white px-4 py-2 rounded-lg"
        >
          Voir le catalogue
        </Link>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          ["MA-01", "Ménage"],
          ["TR-01", "Plomberie"],
          ["TR-03", "Serrurerie"],
          ["LI-01", "Livraisons"],
          ["FA-01", "Baby-sitting"],
          ["TR-06", "Bricolage"],
        ].map(([code, name]) => (
          <li key={code} className="bg-white rounded-xl p-4 shadow">
            <div className="font-medium">{name}</div>
            <Link
              className="text-sm text-[#273469] underline mt-2 inline-block"
              href={`/service/${code}`}
            >
              Voir
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
