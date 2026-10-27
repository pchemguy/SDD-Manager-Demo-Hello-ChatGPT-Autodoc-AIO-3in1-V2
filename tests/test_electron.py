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

def test_complete_windows_runtime_and_x64_executable():
    import zipfile
    import struct
    root = Path(__file__).resolve().parents[1]
    version = json.loads((root / 'package.json').read_text())['version']
    package = root / 'dist' / version / f'hello-world-{version}-win32-x64.zip'
    assert package.is_file(), 'Windows portable runtime archive is missing'
    with zipfile.ZipFile(package) as archive:
        names = set(archive.namelist())
        required = {'HelloWorld.exe', 'icudtl.dat', 'resources.pak', 'ffmpeg.dll', 'dxcompiler.dll',
                    'vk_swiftshader.dll', 'locales/en-US.pak', 'LICENSE', 'LICENSES.chromium.html',
                    'resources/app/main.cjs', 'resources/app/package.json',
                    'resources/app/browser/index.html', 'resources/app/browser/app.js',
                    'resources/app/browser/style.css', 'resources/app/browser/build-info.json'}
        assert required <= names
        assert archive.read('resources/app/main.cjs') == (root / 'src/electron/main.cjs').read_bytes()
        binary = archive.read('HelloWorld.exe')
        assert binary[:2] == b'MZ'
        offset = struct.unpack_from('<I', binary, 0x3c)[0]
        assert binary[offset:offset+4] == b'PE\x00\x00'
        assert struct.unpack_from('<H', binary, offset+4)[0] == 0x8664
        app = json.loads(archive.read('resources/app/package.json'))
        assert app['version'] == version and app['main'] == 'main.cjs'
        for name in ['index.html', 'app.js', 'style.css', 'build-info.json', 'LICENSE']:
            assert archive.read('resources/app/browser/' + name) == (root / 'build/browser' / name).read_bytes()
        assert archive.testzip() is None


def test_upstream_runtime_resources_preserved():
    import zipfile
    root = Path(__file__).resolve().parents[1]
    version = json.loads((root / 'package.json').read_text())['version']
    electron = json.loads((root / 'node_modules/electron/package.json').read_text())['version']
    originals = list((root / '.tools/cache/electron').rglob(f'electron-v{electron}-win32-x64.zip'))
    assert len(originals) == 1
    with zipfile.ZipFile(originals[0]) as sdk, zipfile.ZipFile(root / 'dist' / version / f'hello-world-{version}-win32-x64.zip') as app:
        for member in sdk.namelist():
            if not member.endswith('/') and member not in {'electron.exe', 'resources/default_app.asar'}:
                assert app.read(member) == sdk.read(member), member
        assert 'resources/default_app.asar' not in app.namelist()
