from app import db

class Question(db.Model):
    __tablename__ = "question"

    id = db.Column(db.Integer, primary_key=True)
    libelle = db.Column(db.String(255), nullable=False)
    questionnaire_id = db.Column(db.Integer, db.ForeignKey("questionnaire.id"))

    choix = db.relationship("Choix", backref="question")

    def __repr__(self):
        return f"<Question {self.libelle}>"