"""Run bounded pytest suites with project-local dependencies and browser state."""
import argparse
import json
import os
from pathlib import Path
import signal
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
SUITES = {
    'environment': 'test_environment.py', 'model': 'test_model.py',
    'ui': 'test_ui.py', 'browser-package': 'test_browser_package.py',
    'electron': 'test_electron.py', 'extension-protocol': 'test_extension_protocol.py',
    'extension-sidebar': 'test_extension_sidebar.py', 'extensions': 'test_extensions.py',
    'release': 'test_release.py',
}

def main():
    """Dispatch one declared suite; missing tests and expired deadlines fail."""
    parser = argparse.ArgumentParser()
    parser.add_argument('suite', choices=SUITES)
    parser.add_argument('--browser', choices=['chromium', 'firefox'], default='chromium')
    parser.add_argument('--version')
    args = parser.parse_args()
    target = ROOT / 'tests' / SUITES[args.suite]
    if not target.is_file():
        parser.error('suite has not been implemented: ' + args.suite)
    env = dict(os.environ)
    env['PYTHONPATH'] = str(ROOT / '.tools/python')
    env['PLAYWRIGHT_BROWSERS_PATH'] = str(ROOT / '.tools/browsers')
    env['HELLO_TEST_BROWSER'] = args.browser
    if args.version:
        env['HELLO_TEST_VERSION'] = args.version
    caps = ROOT / '.tools/capabilities.json'
    if caps.exists() and json.loads(caps.read_text()).get('firefoxContentSandboxOverride'):
        env['HELLO_FIREFOX_SANDBOX_OVERRIDE'] = '1'
    command = [sys.executable, '-m', 'pytest', str(target), '-q', '-ra']
    process = subprocess.Popen(command, cwd=ROOT, env=env,
                               start_new_session=os.name != 'nt')
    try:
        return process.wait(timeout=240)
    except subprocess.TimeoutExpired:
        if os.name == 'nt':
            subprocess.run(['taskkill.exe', '/PID', str(process.pid), '/T', '/F'], check=False)
        else:
            os.killpg(process.pid, signal.SIGKILL)
        process.wait(timeout=10)
        print('Suite deadline expired; owned process group terminated.', file=sys.stderr)
        return 124

if __name__ == '__main__':
    raise SystemExit(main())
