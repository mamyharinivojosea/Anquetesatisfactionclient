from flask import Blueprint, jsonify, request, session
from app.models import Questionnaire, Question, Choix, Reponse, ReponseDetail
from app import db

enquete_bp = Blueprint("enquete_bp", __name__, url_prefix="/api")


@enquete_bp.route("/questionnaires", methods=["GET"])
def get_questionnaires():
    questionnaires = Questionnaire.query.all()
    resultat = [
        {"id": q.id, "titre": q.titre}
        for q in questionnaires
    ]
    return jsonify(resultat)


@enquete_bp.route("/questionnaire/<int:id>", methods=["GET"])
def get_questionnaire(id):
    questionnaire = Questionnaire.query.get_or_404(id)
    return jsonify({
        "id": questionnaire.id,
        "titre": questionnaire.titre
    })


@enquete_bp.route("/questionnaire/<int:id>/questions", methods=["GET"])
def get_questions(id):
    questionnaire = Questionnaire.query.get_or_404(id)

    resultat = []
    for question in questionnaire.questions:
        resultat.append({
            "id": question.id,
            "libelle": question.libelle,
            "choix": [
                {"id": c.id, "valeur": c.valeur}
                for c in question.choix
            ]
        })

    return jsonify({
        "questionnaire": questionnaire.titre,
        "questions": resultat
    })


@enquete_bp.route("/coordonnees", methods=["POST"])
def enregistrer_coordonnees():
    data = request.get_json()

    nom = data.get("nom")
    prenom = data.get("prenom")
    email = data.get("email")

    if not nom:
        return jsonify({"erreur": "Le nom est obligatoire"}), 400

    session["nom_client"] = nom
    session["prenom_client"] = prenom
    session["email_client"] = email

    return jsonify({"message": "Coordonnées enregistrées"})


@enquete_bp.route("/reponses", methods=["POST"])
def enregistrer_reponse():
    data = request.get_json()

    questionnaire_id = data.get("questionnaire_id")
    reponses = data.get("reponses")  # liste de { question_id, note }

    if not questionnaire_id or not reponses:
        return jsonify({"erreur": "Données incomplètes"}), 400

    nouvelle_reponse = Reponse(
        nom_client=session.get("nom_client"),
        prenom_client=session.get("prenom_client"),
        email_client=session.get("email_client")
    )
    db.session.add(nouvelle_reponse)
    db.session.commit()

    for r in reponses:
        detail = ReponseDetail(
            reponse_id=nouvelle_reponse.id,
            question_id=r["question_id"],
            note=r["note"]
        )
        db.session.add(detail)

    db.session.commit()

    return jsonify({
        "message": "Réponse enregistrée avec succès",
        "reponse_id": nouvelle_reponse.id
    })


@enquete_bp.route("/reponses/merci", methods=["GET"])
def page_merci():
    session.pop("nom_client", None)
    session.pop("prenom_client", None)
    session.pop("email_client", None)
    return jsonify({"message": "Merci pour votre participation !"})