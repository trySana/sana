"""
Tests de base pour vérifier le bon fonctionnement du système de tests.
"""


def test_sample():
    """Test simple pour vérifier que pytest fonctionne."""
    assert True


def test_addition():
    """Test d'addition simple."""
    assert 1 + 1 == 2


def test_string():
    """Test de manipulation de chaîne."""
    assert "hello".upper() == "HELLO"


class TestSampleClass:
    """Classe de test d'exemple."""

    def test_method(self):
        """Test de méthode dans une classe."""
        assert len([1, 2, 3]) == 3

    def test_dict(self):
        """Test de dictionnaire."""
        data = {"key": "value"}
        assert data["key"] == "value"
