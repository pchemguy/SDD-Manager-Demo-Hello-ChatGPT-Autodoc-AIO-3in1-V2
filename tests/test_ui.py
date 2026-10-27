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
    assert [s['checked'] for s in result['independence']] == [['green', 'red'], ['green', 'blue'], ['red', 'blue']]
    assert [s['colors'] for s in result['independence']] == [
        ['rgb(0, 128, 0)', 'rgb(255, 0, 0)'],
        ['rgb(0, 128, 0)', 'rgb(0, 0, 255)'],
        ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
    ]

def test_responsive_geometry_keyboard_focus_and_css_zoom(probe, browser_name):
    data = probe('layout', browser_name)
    assert abs(data['wide']['center'] - 640) <= 2
    assert data['wide']['gap'] >= 16
    assert data['wide']['font'] >= 32
    assert abs(data['resizedSettingsCenter'] - 640) <= 2
    assert data['narrow']['mainBottom'] <= data['narrow']['settingsTop']
    assert data['narrow']['overflow'] is False
    assert data['zoom']['overflow'] is False
    assert data['shortAccessible'] is True
    assert data['keyboardColor'] == 'green'
    assert data['visibleFocus'] is True
    assert abs(data['breakpointWide']['center'] - 384) <= 2
    assert data['breakpointWide']['gap'] >= 16
    assert data['breakpointNarrow']['mainBottom'] <= data['breakpointNarrow']['settingsTop']
