"""Bounded Node probes are test support; pytest owns all assertions and suites."""
import json
import os
from pathlib import Path
import subprocess
import pytest

ROOT = Path(__file__).resolve().parents[1]

@pytest.fixture
def browser_name():
    return os.environ.get('HELLO_TEST_BROWSER', 'chromium')

@pytest.fixture
def probe():
    def run(name, *args):
        result = subprocess.run(['node', str(ROOT / 'tests/probes' / (name + '.mjs')), *args],
                                cwd=ROOT, text=True, capture_output=True, timeout=100)
        out = ROOT / '.test-results'
        out.mkdir(exist_ok=True)
        (out / (name + '-' + os.environ.get('HELLO_TEST_BROWSER', 'node') + '.log')).write_text(
            result.stdout + '\n' + result.stderr)
        assert result.returncode == 0, result.stdout + '\n' + result.stderr
        return json.loads(result.stdout.strip().splitlines()[-1])
    return run
