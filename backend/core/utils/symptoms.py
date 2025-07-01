from enum import Enum


class Symptoms(Enum):
    pass


class GeneralSymptoms(Symptoms):
    FATIGUE = "FATIGUE"
    FEVER = "FEVER"
    CHILLS = "CHILLS"
    NIGHT_SWEATS = "NIGHT SWEATS"
    WEIGHT_LOSS = "WEIGHT LOSS"
    WEIGHT_GAIN = "WEIGHT GAIN"
    MALAISE = "MALAISE"
    WEAKNESS = "WEAKNESS"


class NeurologicalSymptoms(Symptoms):
    HEADACHE = "HEADACHE"
    DIZZINESS = "DIZZINESS"
    SYNCOPE = "SYNCOPE"
    SEIZURES = "SEIZURES"
    TREMOR = "TREMOR"
    NUMBNESS = "NUMBNESS"
    TINGLING = "TINGLING"
    MEMORY_LOSS = "MEMORY LOSS"
    CONFUSION = "CONFUSION"
    SLURRED_SPEECH = "SLURRED SPEECH"
    MUSCLE_WEAKNESS = "MUSCLE WEAKNESS"
    LOSS_OF_COORDINATION = "LOSS OF COORDINATION"


class CardiovascularSymptoms(Symptoms):
    CHEST_PAIN = "CHEST PAIN"
    PALPITATIONS = "PALPITATIONS"
    SHORTNESS_OF_BREATH = "SHORTNESS OF BREATH"
    EDEMA = "EDEMA"
    CYANOSIS = "CYANOSIS"
    CLAUDICATION = "CLAUDICATION"


class RespiratorySymptoms(Symptoms):
    COUGH = "COUGH"
    WHEEZING = "WHEEZING"
    SHORTNESS_OF_BREATH = "SHORTNESS OF BREATH"
    HEMOPTYSIS = "HEMOPTYSIS"
    SPUTUM_PRODUCTION = "SPUTUM PRODUCTION"
    CHEST_TIGHTNESS = "CHEST TIGHTNESS"


class GastrointestinalSymptoms(Symptoms):
    NAUSEA = "NAUSEA"
    VOMITING = "VOMITING"
    ABDOMINAL_PAIN = "ABDOMINAL PAIN"
    DIARRHEA = "DIARRHEA"
    CONSTIPATION = "CONSTIPATION"
    BLOATING = "BLOATING"
    HEARTBURN = "HEARTBURN"
    DIFFICULTY_SWALLOWING = "DIFFICULTY SWALLOWING"
    RECTAL_BLEEDING = "RECTAL BLEEDING"
    JAUNDICE = "JAUNDICE"


class GenitourinarySymptoms(Symptoms):
    DYSURIA = "DYSURIA"
    URINARY_FREQUENCY = "URINARY FREQUENCY"
    URINARY_URGENCY = "URINARY URGENCY"
    INCONTINENCE = "INCONTINENCE"
    HEMATURIA = "HEMATURIA"
    ERECTILE_DYSFUNCTION = "ERECTILE DYSFUNCTION"
    PELVIC_PAIN = "PELVIC PAIN"
    MENSTRUAL_IRREGULARITIES = "MENSTRUAL IRREGULARITIES"
    VAGINAL_DISCHARGE = "VAGINAL DISCHARGE"
    GENITAL_ITCHING = "GENITAL ITCHING"


class MusculoskeletalSymptoms(Symptoms):
    JOINT_PAIN = "JOINT PAIN"
    MUSCLE_PAIN = "MUSCLE PAIN"
    BACK_PAIN = "BACK PAIN"
    STIFFNESS = "STIFFNESS"
    SWELLING_OF_JOINTS = "SWELLING OF JOINTS"
    MUSCLE_CRAMPS = "MUSCLE CRAMPS"
    DECREASED_RANGE_OF_MOTION = "DECREASED RANGE OF MOTION"


class DermatologicalSymptoms(Symptoms):
    RASH = "RASH"
    ITCHING = "ITCHING"
    DRY_SKIN = "DRY SKIN"
    REDNESS = "REDNESS"
    BLISTERING = "BLISTERING"
    ULCERS = "ULCERS"
    HAIR_LOSS = "HAIR LOSS"
    NAIL_CHANGES = "NAIL CHANGES"


class PsychiatricSymptoms(Symptoms):
    ANXIETY = "ANXIETY"
    DEPRESSION = "DEPRESSION"
    INSOMNIA = "INSOMNIA"
    HALLUCINATIONS = "HALLUCINATIONS"
    DELUSIONS = "DELUSIONS"
    MOOD_SWINGS = "MOOD SWINGS"
    IRRITABILITY = "IRRITABILITY"
    SUICIDAL_THOUGHTS = "SUICIDAL THOUGHTS"


class EarNoseThroatSymptoms(Symptoms):
    SORE_THROAT = "SORE THROAT"
    HOARSENESS = "HOARSENESS"
    NASAL_CONGESTION = "NASAL CONGESTION"
    RUNNY_NOSE = "RUNNY NOSE"
    EAR_PAIN = "EAR PAIN"
    HEARING_LOSS = "HEARING LOSS"
    TINNITUS = "TINNITUS"
    LOSS_OF_SMELL = "LOSS OF SMELL"


class OcularSymptoms(Symptoms):
    BLURRED_VISION = "BLURRED VISION"
    DOUBLE_VISION = "DOUBLE VISION"
    EYE_PAIN = "EYE PAIN"
    RED_EYE = "RED EYE"
    PHOTOPHOBIA = "PHOTOPHOBIA"
    VISUAL_FIELD_LOSS = "VISUAL FIELD LOSS"


class EndocrineSymptoms(Symptoms):
    HEAT_INTOLERANCE = "HEAT INTOLERANCE"
    COLD_INTOLERANCE = "COLD INTOLERANCE"
    EXCESSIVE_THIRST = "EXCESSIVE THIRST"
    EXCESSIVE_HUNGER = "EXCESSIVE HUNGER"
    INCREASED_URINATION = "INCREASED URINATION"


all_symptom_enums = [
    GeneralSymptoms,
    NeurologicalSymptoms,
    CardiovascularSymptoms,
    RespiratorySymptoms,
    GastrointestinalSymptoms,
    GenitourinarySymptoms,
    MusculoskeletalSymptoms,
    DermatologicalSymptoms,
    PsychiatricSymptoms,
    EarNoseThroatSymptoms,
    OcularSymptoms,
    EndocrineSymptoms
]


class SymptomsParser:

    @staticmethod
    def get_symptoms(enum: Symptoms) -> list[str]:
        """Get all symptoms in a category Enum.

        Args:
            enum (Symptoms): Symptoms Enum

        Returns:
            list[str]: All symptoms in the Enum.
        """
        return [member.value for member in enum]

    @staticmethod
    def symptoms_in_message(message: str, symptoms: list[str]) -> list[str]:
        """Get a list of all symptoms present both in the message and the list
        of symptoms given.

        Args:
            message (str): Message in which to check the presence of symptoms.
            symptoms (list[str]): List of all symptoms for which we test the
            present in message.

        Returns:
            list[str]: List of present symptoms
        """

        found_symptoms = list()

        for symptom in symptoms:
            if not symptom.lower() in message.lower():
                continue
            found_symptoms.append(symptom)

        return found_symptoms

    @staticmethod
    def parse_for_symptoms(message: str) -> tuple[list[str], list[str]]:
        """Get the symptoms present in the message and the categories of
        of those symptoms.

        Args:
            message (str): Message in which to check the presence of symptoms.

        Returns:
            tuple[list[str], list[str]]: List of present symptoms,
            List of present categories.
        """
        found_symptoms = list()
        found_categories = list()

        for enum in all_symptom_enums:

            symptoms = SymptomsParser.get_symptoms(enum=enum)

            matched_symptoms = SymptomsParser.symptoms_in_message(
                message=message,
                symptoms=symptoms
            )

            if matched_symptoms:
                found_symptoms.extend(matched_symptoms)
                found_categories.append(enum.__name__)

        return found_symptoms, found_categories
