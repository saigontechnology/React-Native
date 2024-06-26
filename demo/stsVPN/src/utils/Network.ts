import axios from 'axios';

export const getDownloadSpeed = async () => {
  const fileSizeInBytes = 104857; //1048576; // Size of the file in bytes (1MB)
  const startTime = new Date().getTime();

  try {
    await axios.get('http://ipv4.download.thinkbroadband.com/1MB.zip', {
      responseType: 'arraybuffer',
    });
    const endTime = new Date().getTime();
    const durationInSeconds = (endTime - startTime) / 1000;
    const speedInMbps =
      (fileSizeInBytes * 8) / (durationInSeconds * 1024 * 1024);
    return speedInMbps.toFixed(2);
  } catch (error) {
    console.error('Error testing download speed:', error);
    return null;
  }
};

export const getUploadSpeed = async () => {
  const fileSizeInBytes = 104857; // Size of the file in bytes (1MB)
  const startTime = new Date().getTime();
  const fileData = new Uint8Array(fileSizeInBytes); // Create a dummy file

  try {
    await axios.post('https://httpbin.org/post', fileData, {
      headers: {'Content-Type': 'application/octet-stream'},
    });
    const endTime = new Date().getTime();
    const durationInSeconds = (endTime - startTime) / 1000;
    const speedInMbps =
      (fileSizeInBytes * 8) / (durationInSeconds * 1024 * 1024);
    return speedInMbps.toFixed(2);
  } catch (error) {
    console.error('Error testing upload speed:', error);
    return null;
  }
};
