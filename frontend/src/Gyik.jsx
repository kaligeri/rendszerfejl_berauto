import React, { useState } from "react";
import "./gyik.css";

// Egy egyszerű lefelé mutató nyíl ikon
const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="faq-icon">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export default function Gyik() {
    // Nyomon követjük, melyik kérdés van épp lenyitva
    const [openIndex, setOpenIndex] = useState(null);

    // Kérdések és válaszok listája (Autóbérlős téma)
    const faqs = [
        {
            question: "Milyen dokumentumokra van szükség az autóbérléshez?",
            answer: "A bérléshez érvényes B kategóriás vezetői engedélyre (legalább 1 éves), személyi igazolványra vagy útlevélre, valamint lakcímkártyára lesz szükséged. Ezen felül a fizetéshez és a kaucióhoz egy saját névre szóló bankkártya is elengedhetetlen."
        },
        {
            question: "Mennyi a kaució és mikor kapom vissza?",
            answer: "A kaució összege az autó kategóriájától függően 100 000 Ft és 300 000 Ft között mozog. Ezt az összeget a bankkártyádon zároljuk a bérlés kezdetekor. A gépjármű sérülésmentes visszahozatala után a feloldást azonnal kezdeményezzük, ami banktól függően 1-3 munkanapon belül jelenik meg újra a számládon."
        },
        {
            question: "Van kilométerkorlátozás a bérlés során?",
            answer: "Igen, az alap bérleti díj napi 300 kilométer megtételét tartalmazza. Ezt meghaladó használat esetén kilométerenként 50 Ft túlfutási díjat számolunk fel, amely a bérlés lezárásakor, a végszámlán kerül kiszámlázásra."
        },
        {
            question: "Mi a teendő baleset vagy műszaki meghibásodás esetén?",
            answer: "Ilyen esetben kérjük, azonnal hívd a 0-24 órában elérhető központi ügyfélszolgálatunkat. Műszaki hiba esetén csereautót biztosítunk számodra. Baleset esetén a rendőrség értesítése és a kárbejelentő lap pontos kitöltése kötelező!"
        },
        {
            question: "Vihetem az autót külföldre?",
            answer: "Az autókkal az Európai Unió területén belül lehet közlekedni, de a határátlépési szándékot a bérlés megkezdése előtt mindenképpen jelezni kell az ügynökünknek. Külföldi út esetén napi 2000 Ft extra biztosítási díjat számolunk fel."
        },
        {
            question: "Hogyan tudom lemondani vagy módosítani a foglalásomat?",
            answer: "A foglalásodat a profilodban a 'Bérléseim' menüpont alatt követheted nyomon. A kezdés előtt 48 órával a lemondás díjmentes. Ha 48 órán belül mondod le, a bérleti díj 20%-át kötbérként felszámoljuk."
        }
    ];

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-root">
            <div className="faq-container">
                <div className="faq-header">
                    <h1 className="faq-title">Gyakran Ismételt Kérdések</h1>
                    <p className="faq-subtitle">Minden, amit a Berauto autóbérlésről tudni érdemes.</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className={`faq-item ${isOpen ? "active" : ""}`}>
                                <button
                                    className="faq-question"
                                    onClick={() => toggleQuestion(index)}
                                    aria-expanded={isOpen}
                                >
                                    {faq.question}
                                    <ChevronDownIcon />
                                </button>

                                <div className="faq-answer-wrapper">
                                    <div className="faq-answer-inner">
                                        <div className="faq-answer-text">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}