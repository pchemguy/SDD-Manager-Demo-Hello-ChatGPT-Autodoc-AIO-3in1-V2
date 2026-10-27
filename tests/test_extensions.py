"""Actual bundled extension manifests and explicitly modeled native API boundaries."""
from pathlib import Path
import json
import pytest
ROOT=Path(__file__).resolve().parents[1]

def test_bundled_manifest_and_local_entries(browser_name):
    directory=ROOT/'build/extensions'/browser_name
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

def test_built_background_and_native_adapter(probe,browser_name):
    result=probe('extension-adapter',browser_name)
    assert result['startupCalls']==0, 'Opening/sidebar startup must not inject'
    activation=result['activation']
    assert activation[0]==(['open',{'windowId':8}] if browser_name=='chromium' else ['open'])
    assert activation[1]==['inject',{'target':{'tabId':31,'frameIds':[0]},'world':'ISOLATED','files':['page.js']}]
    assert activation[2]==['notify',{'type':'HELLO_ACTIVATED','tabId':31,'windowId':8}]
    assert result['transport'][0]==['query',{'active':True,'windowId':8}]
    assert result['transport'][1][1]==31 and result['transport'][1][3]=={'frameId':0}
    assert [e['type'] for e in result['delivered']]==['activated','loading','removed','activation']
    assert result['remaining']==0

def test_built_content_entry_uses_native_runtime_namespace(probe,browser_name):
    result=probe('extension-entry',browser_name)
    assert result['panels']==result['listeners']==1
    assert result['response']['color']=='red' and result['response']['ok'] is True
    assert result['errors']==[]
