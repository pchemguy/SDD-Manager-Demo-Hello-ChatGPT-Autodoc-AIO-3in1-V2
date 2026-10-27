"""Window/document binding and asynchronous sidebar outcomes; transport is modeled."""
import pytest

@pytest.fixture(scope='module')
def result():
    import os,json,subprocess
    from pathlib import Path
    root=Path(__file__).resolve().parents[1]
    r=subprocess.run(['node','tests/probes/extension-sidebar.mjs'],cwd=root,text=True,capture_output=True,timeout=90)
    (root/'.test-results'/('extension-sidebar-'+os.environ.get('HELLO_TEST_BROWSER','chromium')+'.log')).write_text(r.stdout+'\n'+r.stderr)
    assert r.returncode==0,r.stdout+r.stderr
    return json.loads(r.stdout.strip().splitlines()[-1])

def test_binding_selection_and_reopen(result):
    assert result['initial'].get('color')=='red' and result['initial']['disabled'] is False
    assert result['selected']['color']==result['otherWindow']['color']=='blue'
    assert result['reopened']['color']=='green'
    assert set(result['queries'])=={1}

def test_races_are_bound_and_latest_choice_converges(result):
    assert result['coalesced']==['red']
    assert result['reselected']['ui']['color']==result['reselected']['actual']=='red'
    assert result['switched']['ui']['color']=='green'
    assert result['switched']['old']=='blue' and result['switched']['target']=='green' and result['switched']['wrong']==0
    assert result['late']['color']=='green'

def test_timeout_and_navigation_recover_without_resending(result):
    assert result['invalidReply']['color']=='blue' and not result['invalidReply']['disabled']
    assert result['stale']['actual']=='red' and result['stale']['ui']['disabled']
    assert result['timeout']['mutations']==1
    assert result['timeout']['ui']['color']==result['timeout']['actual']=='red'
    for key in ['navigating','unavailable','unsupported']:
        assert result[key]['disabled'] is True and result[key]['checked']==1 and result[key]['status']
    assert result['recovered']['color']=='red' and not result['recovered']['disabled']

def test_narrow_controls_and_disposal(result):
    assert result['geometry']=={'overflow':False,'labels':['red','blue','green'],'exclusive':1}
    assert result['remaining']==result['subscriptions']==0
