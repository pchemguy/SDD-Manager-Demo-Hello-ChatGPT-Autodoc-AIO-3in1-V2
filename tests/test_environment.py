"""Synthetic provisioning checks do not claim application acceptance."""

def test_two_isolated_interaction_render_teardown_cycles(probe, browser_name):
    result = probe('environment', browser_name)
    assert result['browser'] == browser_name
    assert result['cycles'] == ['changed', 'changed']
    assert result['color'] == 'rgb(255, 0, 0)'
    assert result['version']
