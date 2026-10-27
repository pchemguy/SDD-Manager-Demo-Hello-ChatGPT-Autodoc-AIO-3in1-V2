"""Check cumulative release inventory, actual hashes, provenance and exclusions."""
from pathlib import Path
import hashlib
import json
import os
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]

def selection():
    version = os.environ.get('HELLO_TEST_VERSION') or json.loads((ROOT / 'package.json').read_text())['version']
    names = {f'hello-world-{version}-browser.zip'}
    minor = int(version.split('.')[1])
    if minor >= 2:
        names.add(f'hello-world-{version}-win32-x64.zip')
    if minor >= 3:
        names.update({f'hello-world-{version}-chromium.zip', f'hello-world-{version}-firefox.xpi'})
    return version, names

def test_cumulative_inventory_and_checksum_bytes():
    version, names = selection()
    output = ROOT / 'dist' / version
    expected = names | {'INSTALL.md', 'VERIFICATION.md', 'SHA256SUMS'}
    # Hidden atomic-copy staging siblings are not public release candidates.
    # SHA256SUMS and the publisher's exact whitelist cover every selected asset.
    actual = {p.name for p in output.iterdir() if not p.name.startswith('.')}
    assert expected == actual, 'required cumulative artifact/document missing or unexpected output'
    entries = {}
    for line in (output / 'SHA256SUMS').read_text().splitlines():
        digest, name = line.split('  ', 1)
        assert name not in entries
        entries[name] = digest
    assert set(entries) == expected - {'SHA256SUMS'}
    for name, digest in entries.items():
        assert hashlib.sha256((output / name).read_bytes()).hexdigest() == digest
    instructions = (output / 'INSTALL.md').read_text()
    assert 'static' in instructions.lower()
    verification = (output / 'VERIFICATION.md').read_text()
    assert 'Source commit:' in verification and 'Excluded' in verification
    if int(version.split('.')[1]) >= 2:
        assert 'unsigned' in instructions.lower() and 'Node.js' in instructions
    if int(version.split('.')[1]) >= 3:
        assert 'temporary' in instructions.lower() and 'unpacked' in instructions.lower()

def test_runtime_provenance_and_no_development_material():
    version, names = selection()
    commits = set()
    for name in names:
        with zipfile.ZipFile(ROOT / 'dist' / version / name) as archive:
            assert archive.testzip() is None
            members = archive.namelist()
            assert len(members) == len(set(members))
            for member in members:
                assert not member.startswith(('/', '\\')) and '..' not in Path(member).parts
                assert not any(part in {'.git', '.agents', 'node_modules', '__pycache__', 'tests'} for part in Path(member).parts)
                assert not member.endswith(('.tkn', '.pyc'))
                if member.endswith(('.js', '.cjs', '.json', '.html', '.css', '.md', '.txt')):
                    assert b'github_pat_' not in archive.read(member)
            records = [m for m in members if m.endswith('build-info.json')]
            assert len(records) == 1
            record = json.loads(archive.read(records[0]))
            assert record['version'] == version and re.fullmatch('[a-f0-9]{40}', record['sourceCommit'])
            commits.add(record['sourceCommit'])
            verification_lines = (ROOT / 'dist' / version / 'VERIFICATION.md').read_text().splitlines()
            assert 'Version: ' + record['version'] in verification_lines
            assert 'Source commit: ' + record['sourceCommit'] in verification_lines
            assert 'Development build: ' + str(record['developmentBuild']).lower() in verification_lines
            if os.environ.get('HELLO_REQUIRE_CLEAN') == '1':
                assert record['developmentBuild'] is False
                assert record['sourceCommit'] == subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    assert len(commits) == 1


def test_extension_archives_are_complete_and_relocatable():
    version, names = selection()
    if int(version.split('.')[1]) < 3:
        return
    for platform, suffix in [('chromium','zip'),('firefox','xpi')]:
        with zipfile.ZipFile(ROOT/'dist'/version/f'hello-world-{version}-{platform}.{suffix}') as archive:
            assert set(archive.namelist())=={'manifest.json','background.js','page.js','sidebar.js','sidebar.html','sidebar.css','build-info.json','LICENSE'}
            manifest=json.loads(archive.read('manifest.json'))
            assert manifest['version']==version and manifest['manifest_version']==3
            assert set(manifest['permissions'])==({'activeTab','scripting','sidePanel'} if platform=='chromium' else {'activeTab','scripting'})
            assert not manifest.get('host_permissions') and not manifest.get('content_scripts')
            html=archive.read('sidebar.html').decode()
            for reference in re.findall(r'(?:src|href)="([^"]+)"',html):
                assert reference in archive.namelist()
            assert len(archive.read('page.js'))>100 and len(archive.read('sidebar.js'))>100
