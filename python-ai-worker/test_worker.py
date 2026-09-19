import pytest

# Simulating the router decision logic for unit testing
def select_llm_model(invoice_amount: float, contains_pii: bool, page_count: int) -> str:
    if contains_pii:
        return "SAP_AI_CORE"
    if invoice_amount > 100000.00:
        return "GPT_5"
    if page_count > 10:
        return "CLAUDE_SONNET"
    return "GEMINI_FLASH"

def test_pii_routing():
    """Verify tasks with PII are routed to SAP AI Core zero-trust boundary"""
    model = select_llm_model(invoice_amount=5000.0, contains_pii=True, page_count=1)
    assert model == "SAP_AI_CORE"

def test_high_value_routing():
    """Verify transactions over $100k route to GPT-5/4o"""
    model = select_llm_model(invoice_amount=150000.0, contains_pii=False, page_count=2)
    assert model == "GPT_5"

def test_multipage_routing():
    """Verify documents > 10 pages route to Claude Sonnet"""
    model = select_llm_model(invoice_amount=20000.0, contains_pii=False, page_count=15)
    assert model == "CLAUDE_SONNET"

def test_default_routing():
    """Verify standard routine requests route to Gemini Flash"""
    model = select_llm_model(invoice_amount=500.0, contains_pii=False, page_count=1)
    assert model == "GEMINI_FLASH"