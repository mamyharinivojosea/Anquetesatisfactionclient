from app import db

class Questionnaire(db.Model):
    __tablename__ = "questionnaire"

    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(150), nullable=False)
    date_creation = db.Column(db.DateTime, server_default=db.func.now())

    questions = db.relationship("Question", backref="questionnaire")

    def __repr__(self):
        return f"<Questionnaire {self.titre}>"