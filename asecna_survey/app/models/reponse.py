from app import db

class Reponse(db.Model):
    __tablename__ = "reponse"

    id = db.Column(db.Integer, primary_key=True)
    nom_client = db.Column(db.String(100))
    prenom_client = db.Column(db.String(100))
    email_client = db.Column(db.String(100))
    date_reponse = db.Column(db.DateTime, server_default=db.func.now())

    details = db.relationship("ReponseDetail", backref="reponse")


class ReponseDetail(db.Model):
    __tablename__ = "reponse_detail"

    id = db.Column(db.Integer, primary_key=True)
    reponse_id = db.Column(db.Integer, db.ForeignKey("reponse.id"))
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"))
    note = db.Column(db.Integer, nullable=False)