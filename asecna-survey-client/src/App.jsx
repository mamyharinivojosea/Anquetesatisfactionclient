import { useState, useEffect } from "react";
import "./App.css";
import logoAsecna from "./assets/OIP.jpg";
import aeroportImg from "./assets/R.jpg";

function Accueil({ onCommencer }) {
  return (
    <div>
      <header className="header">
        <img src={logoAsecna} alt="Logo ASECNA" className="logo" />
        <h2>ASECNA</h2>
      </header>

      <section
        className="hero"
        style={{ backgroundImage: `url(${aeroportImg})` }}
      >
        <div className="hero-overlay">
          <h1>Enquête de satisfaction client ASECNA</h1>
          <p>
            Votre avis compte pour nous ! Cette enquête nous aide à
            améliorer continuellement la qualité de nos services et à mieux
            répondre à vos attentes.
          </p>
          <div className="badges">
            <span className="badge">⏱ 2 minutes suffisent</span>
            <span className="badge">🔒 Réponses anonymes</span>
          </div>
          <button className="btn-primary" onClick={onCommencer}>
            Commencer l'enquête
          </button>
        </div>
      </section>

      <section className="pourquoi">
        <h2>Pourquoi participer ?</h2>
        <div className="cartes">
          <div className="carte">
            <div className="icone">🤝</div>
            <h3>Améliorer nos services</h3>
            <p>Vos retours nous aident à progresser chaque jour.</p>
          </div>
          <div className="carte">
            <div className="icone">💬</div>
            <h3>Donner votre avis</h3>
            <p>Exprimez librement votre expérience avec nous.</p>
          </div>
          <div className="carte">
            <div className="icone">🔒</div>
            <h3>Enquête confidentielle</h3>
            <p>Vos réponses restent anonymes et protégées.</p>
          </div>
          <div className="carte">
            <div className="icone">🚀</div>
            <h3>Construire l'avenir</h3>
            <p>Ensemble, un service toujours plus performant.</p>
          </div>
        </div>
      </section>

      <section className="chiffres">
        <div className="chiffre">
          <span className="nombre">18</span>
          <span className="label">Pays membres</span>
        </div>
        <div className="chiffre">
          <span className="nombre">2M+</span>
          <span className="label">Vols accompagnés/an</span>
        </div>
        <div className="chiffre">
          <span className="nombre">1600+</span>
          <span className="label">Professionnels engagés</span>
        </div>
      </section>

      <section className="objectif">
        <h2>À propos de l'ASECNA</h2>
        <p>
          L'Agence pour la Sécurité de la Navigation Aérienne en Afrique et à
          Madagascar (ASECNA) assure la sécurité et la fluidité du trafic
          aérien dans son espace. Cette enquête a pour objectif de recueillir
          votre avis afin d'améliorer continuellement la qualité de nos
          services.
        </p>
      </section>

      <footer className="footer">
        ASECNA © 2026 — Agence pour la Sécurité de la Navigation Aérienne
      </footer>
    </div>
  );
}

function Coordonnees({ onSuivant, onPrecedent }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const envoyer = async () => {
    setErreur("");

    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setErreur("Merci de remplir tous les champs avant de continuer.");
      return;
    }

    setChargement(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/coordonnees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nom, prenom, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur || "Une erreur est survenue");
      } else {
        onSuivant(prenom);
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur");
    }
    setChargement(false);
  };

  return (
    <div className="page">
      <header className="header">
        <img src={logoAsecna} alt="Logo ASECNA" className="logo" />
        <h2>ASECNA</h2>
      </header>

      <div className="card" style={{ maxWidth: 680, padding: 48 }}>
        <h1 className="titre-page">Enquête de satisfaction client</h1>
        <p className="sous-titre">
          Merci de compléter vos informations avant de commencer
        </p>

        <div className="champ">
          <label>Nom</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>

        <div className="champ">
          <label>Prénom</label>
          <input
            type="text"
            placeholder="Votre prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </div>

        <div className="champ">
          <label>Email</label>
          <input
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {erreur && <p className="erreur">{erreur}</p>}

        <div className="boutons-nav">
          <button className="btn-secondaire" onClick={onPrecedent}>
            Précédent
          </button>
          <button className="btn-primary" onClick={envoyer} disabled={chargement}>
            {chargement ? "Envoi..." : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Questionnaire({ onTermine, onPrecedent }) {
  const [questions, setQuestions] = useState([]);
  const [reponses, setReponses] = useState({});
  const [commentaire, setCommentaire] = useState("");
  const [chargement, setChargement] = useState(true);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [indexActuel, setIndexActuel] = useState(0);

  const libelles = [
    "Très insatisfait",
    "Insatisfait",
    "Neutre",
    "Satisfait",
    "Très satisfait",
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/questionnaire/1/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions);
        setChargement(false);
      });
  }, []);

  const choisirNote = (questionId, note) => {
    setReponses({ ...reponses, [questionId]: note });
  };

  if (chargement) {
    return <div style={{ padding: 40, textAlign: "center" }}>Chargement des questions...</div>;
  }

  const surCommentaire = indexActuel === questions.length;
  const questionActuelle = questions[indexActuel];

  const envoyer = async () => {
    const liste = Object.entries(reponses).map(([question_id, note]) => ({
      question_id: parseInt(question_id),
      note,
    }));

    setEnvoi(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/reponses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ questionnaire_id: 1, reponses: liste, commentaire }),
      });
      if (res.ok) {
        onTermine();
      } else {
        setErreur("Une erreur est survenue lors de l'envoi.");
      }
    } catch (err) {
      setErreur("Impossible de contacter le serveur.");
    }
    setEnvoi(false);
  };

  const suivant = () => {
    setErreur("");
    if (!surCommentaire) {
      if (!reponses[questionActuelle.id]) {
        setErreur("Merci de donner une note avant de continuer.");
        return;
      }
      setIndexActuel(indexActuel + 1);
    } else {
      envoyer();
    }
  };

  const precedent = () => {
    setErreur("");
    if (indexActuel === 0) {
      onPrecedent();
    } else {
      setIndexActuel(indexActuel - 1);
    }
  };

  const totalEtapes = questions.length + 1;
  const etapeActuelle = indexActuel + 1;
  const pourcentage = (etapeActuelle / totalEtapes) * 100;

  return (
    <div className="page">
      <header className="header">
        <img src={logoAsecna} alt="Logo ASECNA" className="logo" />
        <h2>ASECNA</h2>
      </header>

      <div className="card" style={{ maxWidth: 680, padding: 48 }}>
        <div className="progression">
          <div className="progression-texte">
            <span>Étape {etapeActuelle} sur {totalEtapes}</span>
            <span>{Math.round(pourcentage)}%</span>
          </div>
          <div className="progression-barre">
            <div className="progression-remplissage" style={{ width: `${pourcentage}%` }}></div>
          </div>
        </div>

        {!surCommentaire ? (
          <div className="question-transition" key={indexActuel}>
            <p className="question-titre">{questionActuelle.libelle}</p>
            <div className="options-radio">
              {[1, 2, 3, 4, 5].map((note) => (
                <div
                  key={note}
                  className={`option-radio-item ${reponses[questionActuelle.id] === note ? "active" : ""}`}
                  onClick={() => choisirNote(questionActuelle.id, note)}
                >
                  <div className="option-radio-cercle"></div>
                  <span className="option-radio-texte">{libelles[note - 1]}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="commentaire-final question-transition" key="commentaire" style={{ margin: "24px 0" }}>
            <p className="question-titre">Comment pouvons-nous nous améliorer ?</p>
            <label>Commentaire ou suggestion (facultatif)</label>
            <textarea
              placeholder="Écrivez ici vos remarques..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={4}
            />
          </div>
        )}

        {erreur && <p className="erreur">{erreur}</p>}

        <div className="boutons-nav">
          <button className="btn-secondaire" onClick={precedent}>
            Précédent
          </button>
          <button className="btn-primary" onClick={suivant} disabled={envoi}>
            {envoi ? "Envoi..." : surCommentaire ? "Envoyer mes réponses" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Merci({ prenom, onRetour }) {
  return (
    <div
      className="page merci-fond"
      style={{ backgroundImage: `url(${aeroportImg})`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
    >
      <div className="card card-merci">
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>✈️</div>
        <h1 className="titre-page">
          {prenom ? `Merci ${prenom} pour votre participation !` : "Merci pour votre participation !"}
        </h1>
        <p className="sous-titre">Vos réponses ont bien été enregistrées.</p>
        <button className="btn-primary" onClick={onRetour} style={{ marginTop: 10 }}>
          Retour à l'accueil
        </button>
        <p style={{ fontSize: "0.8rem", color: "#888", marginTop: 20, lineHeight: 1.5 }}>
          Chaque avis compte : vos réponses guident directement nos actions pour un service toujours meilleur.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [ecran, setEcran] = useState("accueil");
  const [prenom, setPrenom] = useState("");

  const retourAccueil = () => {
    setPrenom("");
    setEcran("accueil");
  };

  return (
    <>
      {ecran === "accueil" && <Accueil onCommencer={() => setEcran("coordonnees")} />}
      {ecran === "coordonnees" && (
        <Coordonnees
          onSuivant={(p) => {
            setPrenom(p);
            setEcran("questionnaire");
          }}
          onPrecedent={() => setEcran("accueil")}
        />
      )}
      {ecran === "questionnaire" && (
        <Questionnaire
          onTermine={() => setEcran("merci")}
          onPrecedent={() => setEcran("coordonnees")}
        />
      )}
      {ecran === "merci" && <Merci prenom={prenom} onRetour={retourAccueil} />}
    </>
  );
}

export default App;