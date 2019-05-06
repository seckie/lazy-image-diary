export function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve({
        file: file,
        path: e.target.result
      });
    }
    reader.readAsDataURL(file);
  });
};

