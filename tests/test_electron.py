"""Execute the desktop host against a narrow modeled Electron API boundary."""
import json
from pathlib import Path

def test_host_creates_one_constrained_local_window(probe):
    data = probe('electron-host')
    assert data['windowCount'] == 1
    preferences = data['options'].get('webPreferences', {})
    assert preferences.get('nodeIntegration') is False
    assert preferences.get('contextIsolation') is True
    assert preferences.get('sandbox') is True
    assert 'preload' not in preferences
    assert data['menuRemoved'] is True

def test_navigation_permissions_and_close_lifecycle(probe):
    data = probe('electron-host')
    assert data['navigationPrevented'] is True
    assert data['newWindowAction'] == 'deny'
    assert data['permissionGranted'] is False
    assert data['permissionCheck'] is False
    assert data['quitCalled'] is True

def test_staged_host_loads_bundled_renderer(probe):
    data = probe('electron-host')
    assert data['entryExists'] is True
    assert data['localEntry'] is True
    assert data['rendererVersion'] == json.loads((Path(__file__).resolve().parents[1] / 'package.json').read_text())['version']
