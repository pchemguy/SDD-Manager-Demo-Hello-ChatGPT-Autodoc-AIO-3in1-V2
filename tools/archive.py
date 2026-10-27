"""Create deterministic ZIPs from an explicit generated runtime allowlist."""
from pathlib import Path
import argparse
import os
import stat
import zipfile


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('files', nargs='*')
    args = parser.parse_args()
    source = args.source.resolve()
    names = args.files or [str(p.relative_to(source)).replace(os.sep, '/')
                           for p in source.rglob('*') if p.is_file()]
    if len(names) != len(set(names)):
        parser.error('duplicate archive entry')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    temporary = args.output.with_suffix(args.output.suffix + '.partial')
    try:
        with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for name in sorted(names):
                candidate = source / name
                parts = Path(name).parts
                if (Path(name).is_absolute() or '..' in parts or candidate.is_symlink()
                        or not candidate.resolve().is_relative_to(source)
                        or any(p in {'.git', '.agents', 'node_modules', '__pycache__'} for p in parts)
                        or name.endswith(('.tkn', '.pyc'))):
                    parser.error('unsafe or excluded archive entry: ' + name)
                if not candidate.is_file():
                    parser.error('required runtime file missing: ' + name)
                info = zipfile.ZipInfo(name, (2020, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = (stat.S_IFREG | 0o644) << 16
                archive.writestr(info, candidate.read_bytes())
        os.replace(temporary, args.output)
    finally:
        if temporary.exists():
            temporary.unlink()

if __name__ == '__main__':
    main()
