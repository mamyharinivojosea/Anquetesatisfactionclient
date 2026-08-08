from app import db

class Choix(db.Model):
    __tablename__ = "choix"

    id = db.Column(db.Integer, primary_key=True)
    valeur = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("question.id"))

    def __repr__(self):
        return f"<Choix {self.valeur}>"