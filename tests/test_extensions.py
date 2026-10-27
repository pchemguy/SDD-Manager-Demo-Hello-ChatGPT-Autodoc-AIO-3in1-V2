"""Actual bundled extension manifests and explicitly modeled native API boundaries."""
from pathlib import Path
import json
import pytest
ROOT=Path(__file__).resolve().parents[1]

@pytest.fixture(scope='module')
def package_dir():
    import shutil,zipfile,os
    browser_name=os.environ.get('HELLO_TEST_BROWSER','chromium')
    version=json.loads((ROOT/'package.json').read_text())['version']
    suffix='xpi' if browser_name=='firefox' else 'zip'
    destination=ROOT/'.test-results/extracted-extensions'/browser_name
    shutil.rmtree(destination,ignore_errors=True);destination.mkdir(parents=True)
    with zipfile.ZipFile(ROOT/'dist'/version/f'hello-world-{version}-{browser_name}.{suffix}') as archive:
        assert set(archive.namelist())=={'manifest.json','background.js','page.js','sidebar.js','sidebar.html','sidebar.css','build-info.json','LICENSE'}
        assert archive.testzip() is None
        archive.extractall(destination)
    return destination

def test_bundled_manifest_and_local_entries(browser_name,package_dir):
    directory=package_dir
    assert (directory/'manifest.json').is_file(), 'Bundled extension manifest is missing'
    manifest=json.loads((directory/'manifest.json').read_text())
    assert manifest['manifest_version']==3
    assert set(manifest['permissions'])==({'activeTab','scripting','sidePanel'} if browser_name=='chromium' else {'activeTab','scripting'})
    assert not manifest.get('host_permissions') and not manifest.get('content_scripts')
    assert manifest['incognito']=='not_allowed'
    if browser_name=='chromium':
        assert manifest['background']=={'service_worker':'background.js'}
        assert manifest['minimum_chrome_version']=='116'
        assert manifest['side_panel']['default_path']=='sidebar.html'
    else:
        assert manifest['background']=={'scripts':['background.js'],'persistent':False}
        assert manifest['sidebar_action']['default_panel']=='sidebar.html'
        assert manifest['browser_specific_settings']['gecko']['strict_min_version']=='128.0'
    assert set(p.name for p in directory.iterdir())=={'manifest.json','background.js','page.js','sidebar.js','sidebar.html','sidebar.css','build-info.json','LICENSE'}
    for name in ['background.js','page.js','sidebar.js']:
        script=(directory/name).read_text()
        assert 'require(' not in script and 'import ' not in script
    assert 'src="sidebar.js"' in (directory/'sidebar.html').read_text()

def test_toolbar_activation_scope_and_order(probe):
    cases={c['kind']:c['calls'] for c in probe('extension-activation')}
    assert cases['ordinary']==[['open',4],['inject',17],['notify',17,4]]
    assert cases['denied']==[['open',4],['inject',17],['notify',17,4]]
    for kind in ['restricted','private']:
        assert cases[kind]==[['open',4],['notify',17,4]]

def test_built_background_and_native_adapter(probe,browser_name,package_dir):
    result=probe('extension-adapter',browser_name,str(package_dir))
    assert result['startupCalls']==0, 'Opening/sidebar startup must not inject'
    activation=result['activation']
    assert activation[0]==(['open',{'windowId':8}] if browser_name=='chromium' else ['open'])
    assert activation[1]==['inject',{'target':{'tabId':31,'frameIds':[0]},'world':'ISOLATED','files':['page.js']}]
    assert activation[2]==['notify',{'type':'HELLO_ACTIVATED','tabId':31,'windowId':8}]
    assert result['transport'][0]==['query',{'active':True,'windowId':8}]
    assert result['transport'][1][1]==31 and result['transport'][1][3]=={'frameId':0}
    assert [e['type'] for e in result['delivered']]==['activated','loading','removed','activation']
    assert result['remaining']==0

def test_built_content_entry_uses_native_runtime_namespace(probe,browser_name,package_dir):
    result=probe('extension-entry',browser_name,str(package_dir))
    assert result['panels']==result['listeners']==1
    assert result['response']['color']=='red' and result['response']['ok'] is True
    assert result['errors']==[]


def test_extracted_cross_document_lifecycle_matrix(probe,browser_name,package_dir):
    result=probe('extension-matrix',browser_name,str(package_dir))
    assert result['initialUnavailable'] and result['activatedRed']
    assert result['independent']==['red','green','blue']
    assert result['reopened']=='blue' and result['backgroundRestart']=='blue' and result['spa']=='blue'
    assert result['reselection']=={'colors':['blue','red'],'actual':'red'}
    assert result['switchRace']=={'targets':[11],'old':'blue','selected':'green','ui':'green'}
    assert result['reload']=={'unavailable':True,'fresh':'red','newNonce':True,'stale':'STALE_DOCUMENT'}
    assert result['cachedSignal']=={'panels':0,'listeners':0,'unavailable':True,'fresh':'red'}
    assert result['navigation']=={'unavailable':True,'fresh':'red'}
    assert result['timeout']=={'mutations':1,'actual':'blue','ui':'blue'}
    assert result['invalid']==['INVALID_MESSAGE','INVALID_MESSAGE','blue']
    assert result['unsupported'] and result['noUnsupportedInjection']
    assert result['errors']==[]
