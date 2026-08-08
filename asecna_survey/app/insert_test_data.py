import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app, db
from app.models import Questionnaire, Question, Choix

app = create_app()

with app.app_context():
    q = Questionnaire(titre="Satisfaction Ivato Juillet 2026")
    db.session.add(q)
    db.session.commit()

    questions_texte = [
        "Accueil du personnel",
        "Rapidité du service",
        "Propreté des locaux",
        "Clarté des informations",
        "Satisfaction générale"
    ]

    for texte in questions_texte:
        question = Question(libelle=texte, questionnaire_id=q.id)
        db.session.add(question)
        db.session.commit()

        for valeur in range(1, 6):
            choix = Choix(valeur=valeur, question_id=question.id)
            db.session.add(choix)

    db.session.commit()
    print("Données de test insérées avec succès !")