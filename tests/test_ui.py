"""Check the built application, not a separate test-only implementation."""

def test_exact_message_radio_colors_and_session_lifecycle(probe, browser_name):
    result = probe('ui', browser_name)
    assert result['messageCount'] == 1
    assert result['text'] == 'Hello World'
    assert result['labels'] == ['red', 'blue', 'green']
    assert result['initial'] == {'checked': 'red', 'color': 'rgb(255, 0, 0)'}
    assert result['transitions'] == ['rgb(0, 0, 255)', 'rgb(0, 128, 0)', 'rgb(255, 0, 0)']
    assert result['checkedCount'] == 1
    assert result['fresh'] == 'red'
    assert result['reloaded'] == 'red'
    assert result['disposedChildren'] == 0
