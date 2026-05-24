/**
 * Respiratory Challenge — shared cloud state (Firebase Firestore)
 * يجعل الأسئلة والنتائج والإعدادات تظهر لجميع الأجهزة.
 */
(function(global){
  var KEYS = {
    questions: 'respiratoryChallengeQuestions',
    results: 'respiratoryChallengeResults',
    settings: 'respiratoryChallengeSettings'
  };

  var db = null;
  var docRef = null;
  var enabled = false;
  var listening = false;
  var pushTimer = null;
  var applyingRemote = false;
  var lastPushedAt = 0;

  function isConfigured(){
    return !!(global.FIREBASE_CONFIG && global.FIREBASE_CONFIG.apiKey && global.FIREBASE_CONFIG.projectId);
  }

  function readJson(key, fallback){
    try{
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      return v == null ? fallback : v;
    }catch(e){ return fallback; }
  }

  function writeJson(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getLocalState(){
    return {
      questions: readJson(KEYS.questions, []),
      results: readJson(KEYS.results, []),
      settings: readJson(KEYS.settings, {}),
      updatedAt: Date.now()
    };
  }

  function applyRemoteState(data){
    if(!data || typeof data !== 'object') return;
    applyingRemote = true;
    try{
      if(Array.isArray(data.questions)) writeJson(KEYS.questions, data.questions);
      if(Array.isArray(data.results)) writeJson(KEYS.results, data.results);
      if(data.settings && typeof data.settings === 'object') writeJson(KEYS.settings, data.settings);
      global.dispatchEvent(new CustomEvent('rc-cloud-updated', { detail: { source: 'remote' } }));
    }finally{
      applyingRemote = false;
    }
  }

  function setSyncStatus(status, message){
    var el = document.getElementById('cloudSyncPill');
    if(!el) return;
    el.dataset.status = status;
    el.textContent = message;
    el.hidden = !enabled && status !== 'off';
  }

  function pushStateNow(){
    if(!enabled || !docRef || applyingRemote) return Promise.resolve();
    var state = getLocalState();
    lastPushedAt = state.updatedAt;
    setSyncStatus('syncing', '☁️ Saving…');
    return docRef.set(state).then(function(){
      setSyncStatus('live', '☁️ Live — shared');
    }).catch(function(err){
      console.error('RCCloud push failed', err);
      setSyncStatus('error', '☁️ Sync error');
    });
  }

  function pushStateDebounced(){
    if(!enabled) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushStateNow, 400);
  }

  function startListener(){
    if(!docRef || listening) return;
    listening = true;
    docRef.onSnapshot(function(snap){
      if(!snap.exists){
        return pushStateNow();
      }
      var data = snap.data();
      var remoteAt = data.updatedAt || 0;
      if(remoteAt && remoteAt <= lastPushedAt - 50) return;
      applyRemoteState(data);
      setSyncStatus('live', '☁️ Live — shared');
    }, function(err){
      console.error('RCCloud listen failed', err);
      setSyncStatus('error', '☁️ Sync error');
    });
  }

  function init(){
    if(!isConfigured()){
      enabled = false;
      setSyncStatus('off', '☁️ Local only');
      return Promise.resolve(false);
    }

    if(typeof firebase === 'undefined'){
      console.warn('Firebase SDK not loaded');
      setSyncStatus('off', '☁️ Local only');
      return Promise.resolve(false);
    }

    try{
      if(!firebase.apps.length){
        firebase.initializeApp(global.FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      var col = global.FIREBASE_COLLECTION || 'challenges';
      var id = global.FIREBASE_DOC_ID || 'respiratory-care-weekly';
      docRef = db.collection(col).doc(id);
      enabled = true;
      setSyncStatus('syncing', '☁️ Connecting…');

      return docRef.get().then(function(snap){
        if(snap.exists){
          applyRemoteState(snap.data());
        }else{
          return pushStateNow();
        }
      }).then(function(){
        startListener();
        setSyncStatus('live', '☁️ Live — shared');
        return true;
      }).catch(function(err){
        console.error('RCCloud init failed', err);
        enabled = false;
        setSyncStatus('error', '☁️ Offline');
        return false;
      });
    }catch(err){
      console.error('RCCloud init', err);
      enabled = false;
      return Promise.resolve(false);
    }
  }

  global.RCCloudSync = {
    init: init,
    pushState: pushStateDebounced,
    pushStateNow: pushStateNow,
    isEnabled: function(){ return enabled; },
    isConfigured: isConfigured
  };
})(window);
