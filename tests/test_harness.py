"""Testes de sanidade e integridade do harness de execução (Python 3.12)."""

import sys

import pytest


@pytest.mark.unit
def test_python_runtime_version():
    """Verifica se o interpretador em execução é estritamente CPython 3.12."""
    assert sys.version_info.major == 3
    assert sys.version_info.minor == 12


@pytest.mark.unit
def test_virtualenv_isolation():
    """Valida se a execução ocorre dentro de um ambiente virtual isolado (.venv)."""
    assert sys.prefix != sys.base_prefix
    assert "venv" in sys.prefix.lower()


@pytest.mark.unit
def test_python_312_syntax_features():
    """Valida suporte nativo a recursos sintáticos modernos do Python 3.12."""
    # Exemplo: type alias nativo (PEP 695) e pattern matching
    type StringList = list[str]
    items: StringList = ["django", "celery", "langgraph", "rabbitmq"]

    match items:
        case ["django", *rest]:
            assert len(rest) == 3
            assert "celery" in rest
        case _:
            pytest.fail("Falha no pattern matching do Python 3.12")
