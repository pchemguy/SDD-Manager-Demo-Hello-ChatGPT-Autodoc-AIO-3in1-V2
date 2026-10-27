"""Validate actual deployable bytes and extracted non-root hosting."""
import json
from pathlib import Path
import zipfile
import pytest

ROOT = Path(__file__).resolve().parents[1]

@pytest.fixture(scope='module')
def package_file():
    version = json.loads((ROOT / 'package.json').read_text())['version']
    return ROOT / 'dist' / version / f'hello-world-{version}-browser.zip'

def test_browser_archive_runtime_allowlist(package_file):
    with zipfile.ZipFile(package_file) as archive:
        assert set(archive.namelist()) == {'index.html', 'app.js', 'style.css', 'build-info.json', 'LICENSE'}
        assert archive.testzip() is None
        info = json.loads(archive.read('build-info.json'))
        assert info['version'] == json.loads((ROOT / 'package.json').read_text())['version']
        assert len(info['sourceCommit']) == 40
        assert isinstance(info['developmentBuild'], bool)
        assert './app.js' in archive.read('index.html').decode()
        assert './style.css' in archive.read('index.html').decode()

@pytest.mark.parametrize('name', ['chromium', 'firefox'])
def test_extracted_archive_runs_under_a_subpath(package_file, probe, name):
    with zipfile.ZipFile(package_file) as archive:
        if 'index.html' not in archive.namelist():
            pytest.fail('deployable archive has no index.html entry point')
        destination = ROOT / '.test-results/extracted-browser/nested/app'
        destination.mkdir(parents=True, exist_ok=True)
        archive.extractall(destination)
    data = probe('browser-package', name)
    assert data['text'] == 'Hello World'
    assert data['initial'] == 'rgb(255, 0, 0)'
    assert data['changed'] == 'rgb(0, 0, 255)'
    assert data['failures'] == []
