// main.cjs
import('electron').then(() => {
    import('./main/index.js'); // your ES module entry point
  });