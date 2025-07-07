from backend.core.utils.symptoms import SymptomsParser


def test_symptoms_parser_should_return_empty():
    #  Given
    message = "I am your father !"

    #  When
    symptoms, categories = SymptomsParser.parse_for_symptoms(message=message)

    #  Then
    assert symptoms == list()
    assert categories == list()


def test_symptoms_parser_should_return_eye_pain_depression():
    #  Given
    message = "I am your father. No I am ! I also have depression and eye pain"

    #  When
    symptoms, categories = SymptomsParser.parse_for_symptoms(message=message)

    #  Then
    assert symptoms == ["DEPRESSION", "EYE PAIN"]
    assert categories == ["PsychiatricSymptoms", "OcularSymptoms"]
