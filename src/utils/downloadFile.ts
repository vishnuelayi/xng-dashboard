function downloadFile(data: Blob, filename: string) {
    let url = window.URL.createObjectURL(data);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
}

export default downloadFile;