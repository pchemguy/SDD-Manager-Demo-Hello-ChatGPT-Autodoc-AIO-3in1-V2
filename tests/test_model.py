"""Protect the public color rules with independently specified outcomes."""

def test_initial_and_independent_models(probe):
    data = probe('model')
    assert data['initial'] == 'red'
    assert data['fresh'] == 'red'

def test_selection_and_invalid_input(probe):
    data = probe('model')
    assert data['colors'] == ['blue', 'green', 'red']
    assert data['invalidAccepted'] is False
    assert data['afterInvalid'] == 'red'
