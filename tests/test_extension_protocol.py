"""Page-session contracts through real DOM and a modeled runtime seam."""
import pytest

@pytest.fixture(scope='module')
def result():
    import os, json, subprocess
    from pathlib import Path
    root=Path(__file__).resolve().parents[1]
    r=subprocess.run(['node','tests/probes/extension-page.mjs'],cwd=root,text=True,capture_output=True,timeout=90)
    (root/'.test-results'/('extension-page-'+os.environ.get('HELLO_TEST_BROWSER','chromium')+'.log')).write_text(r.stdout+'\n'+r.stderr)
    assert r.returncode==0,r.stdout+r.stderr
    return json.loads(r.stdout.strip().splitlines()[-1])

def test_page_activation_isolated_and_idempotent(result):
    assert result['initial']['count']==1
    assert result['initial']['state']['color']=='red' and result['initial']['color']=='red'
    assert result['repeated']['count']==1 and result['repeated']['state']['color']=='blue'
    assert result['untouched']=={'geometry':True,'focus':True,'pointer':'none','center':True}

def test_validation_and_document_lifecycle(result):
    assert result['vectors']==[True,True]+[False]*8
    for key,code in [('stale','STALE_DOCUMENT'),('invalid','INVALID_MESSAGE'),('external','INVALID_MESSAGE')]:
        assert result[key]['ok'] is False and result[key]['error']==code
    assert result['spa']['color']=='blue'
    assert result['cleaned']=={'panels':0,'listeners':0}
    assert result['restarted']['color']=='red'
    assert result['restarted']['documentId']!=result['initial']['state']['documentId']


def test_xhtml_is_supported(result):
    assert result['xhtml']=='Hello World'
