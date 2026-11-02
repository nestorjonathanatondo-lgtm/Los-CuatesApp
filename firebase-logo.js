(function () {
  const firebaseConfig = window.LOS_CUATES_FIREBASE_CONFIG || {};
  const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket);

  function isFirebaseReady() {
    return !!(window.firebase && window.firebase.apps && window.firebase.apps.length);
  }

  function initFirebaseStorage() {
    if (!hasConfig) {
      console.warn('[LosCuates] Firebase no está configurado. Revisa firebase-config.js');
      return null;
    }

    if (!window.firebase) {
      console.warn('[LosCuates] Firebase SDK no cargó correctamente.');
      return null;
    }

    if (!isFirebaseReady()) {
      try {
        window.firebase.initializeApp(firebaseConfig);
      } catch (error) {
        console.warn('[LosCuates] Firebase ya estaba inicializado:', error);
      }
    }

    return window.firebase.storage();
  }

  function toDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function fallbackUpload(file, tipo) {
    return toDataURL(file).then((dataUrl) => {
      if (tipo === 'cuates') {
        state.config.logoCuates = dataUrl;
        document.getElementById('headerLogo').src = dataUrl;
        document.getElementById('splashLogoCuates').src = dataUrl;
        document.getElementById('prevCuates').src = dataUrl;
      } else if (tipo === 'jm') {
        state.config.logoJM = dataUrl;
        document.getElementById('footerJM').src = dataUrl;
        document.getElementById('splashLogoJM').src = dataUrl;
        document.getElementById('prevJM').src = dataUrl;
      }
      if (typeof saveMarca === 'function') saveMarca();
      if (typeof saveAll === 'function') saveAll();
      return dataUrl;
    });
  }

  async function uploadLogoToFirebase(file, tipo) {
    const storage = initFirebaseStorage();
    if (!storage) return fallbackUpload(file, tipo);

    const extension = file.name.split('.').pop() || 'png';
    const filename = `${tipo}-${Date.now()}.${extension}`;
    const storageRef = storage.ref(`logos/${filename}`);

    try {
      const snapshot = await storageRef.put(file);
      const url = await snapshot.ref.getDownloadURL();

      if (tipo === 'cuates') {
        state.config.logoCuates = url;
        document.getElementById('headerLogo').src = url;
        document.getElementById('splashLogoCuates').src = url;
        document.getElementById('prevCuates').src = url;
      } else if (tipo === 'jm') {
        state.config.logoJM = url;
        document.getElementById('footerJM').src = url;
        document.getElementById('splashLogoJM').src = url;
        document.getElementById('prevJM').src = url;
      }

      if (typeof saveMarca === 'function') saveMarca();
      if (typeof saveAll === 'function') saveAll();
      return url;
    } catch (error) {
      console.error('[LosCuates] Error subiendo a Firebase Storage:', error);
      return fallbackUpload(file, tipo);
    }
  }

  window.initFirebaseStorage = initFirebaseStorage;

  const originalUploadLogo = window.uploadLogo;
  window.uploadLogo = async function (input, tipo) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    const result = await uploadLogoToFirebase(file, tipo);
    if (process && process.env && process.env.NODE_ENV === 'development') {
      console.log('[LosCuates] Logo subido:', result);
    }
    return result;
  };

  if (typeof originalUploadLogo === 'function') {
    window.originalUploadLogo = originalUploadLogo;
  }
})();
