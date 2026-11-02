(function () {
  const firebaseConfig = window.LOS_CUATES_FIREBASE_CONFIG || {};
  const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.storageBucket);

  function initFirebaseStorage() {
    if (!hasConfig) {
      console.warn('[LosCuates] Firebase no está configurado');
      return null;
    }

    if (!window.firebase) {
      console.warn('[LosCuates] Firebase SDK no cargó correctamente');
      return null;
    }

    try {
      if (!window.firebase.apps || !window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
    } catch (error) {
      console.warn('[LosCuates] Firebase ya estaba inicializado:', error);
    }

    return window.firebase.storage();
  }

  async function uploadLogoToFirebase(file, tipo) {
    const storage = initFirebaseStorage();
    if (!storage) return null;

    const extension = file.name.split('.').pop() || 'png';
    const fileName = `${tipo}-${Date.now()}.${extension}`;

    try {
      const storageRef = storage.ref(`logos/${fileName}`);
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

      saveMarca();
      saveAll();
      return url;
    } catch (error) {
      console.error('Error al subir logo a Firebase:', error);
      return null;
    }
  }

  window.uploadLogo = async function (input, tipo) {
    if (!input || !input.files || !input.files[0]) return;
    const file = input.files[0];
    return uploadLogoToFirebase(file, tipo);
  };
})();
