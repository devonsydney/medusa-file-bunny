import { FileService } from "medusa-interfaces";
import fs from "fs";
import fetch from "node-fetch";
import stream from "stream";
import https from "https";

function getReadStreamFromCDN(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get file from CDN. Status Code: ${response.statusCode}`));
        return;
      }

      resolve(response);
    }).on('error', (err) => {
      reject(err);
    });
  });
}

class BunnyFileService extends FileService {

  constructor({}, options) {
    super({}, options)

    this.storageAccessKey_ = options.storageAccessKey || '' // Bunny Storage Access Key (FTP Password)
    this.storageEndpoint_ = options.storageEndpoint || '' // Bunny Storage Endpoint (e.g. storage.bunnycdn.com)
    this.storageZoneName_ = options.storageZoneName || '' // Bunny Storage Zone Name
    this.storagePath_ = options.storagePath || '' // (optional) File Path
    this.pullZoneDomain_ = options.pullZoneDomain || '' // Bunny Pull Zone Domain
  }

  // upload file to bunny cdn
  async upload(file) {
    console.log(`BunnyFileService uploading ${file.originalname}`)
    try {
      const uploadUrl = `${this.storageEndpoint_}/${this.storageZoneName_}/${this.storagePath_ ? this.storagePath_ + '/' : ''}${file.originalname}`
      const readStream = fs.createReadStream(file.path);

      const options = {
        method: 'PUT',
        headers: { 'content-type': 'application/octet-stream', AccessKey: this.storageAccessKey_ },
        body: readStream
      };

      await fetch(uploadUrl, options);
      const uploadedUrl = `${this.pullZoneDomain_}/${this.storagePath_}/${file.originalname}`
      return { url: uploadedUrl };
    } catch (error) {
      throw error
    }
  }

  // delete file from bunny CDN
  async delete(file) {
    console.log(`BunnyFileService deleting ${file.file_key}`)
    try {
      const deleteUrl = `${this.storageEndpoint_}/${this.storageZoneName_}/${this.storagePath_ ? this.storagePath_ + '/' : ''}${file.file_key}`
      const options = { method: 'DELETE', headers: { AccessKey: this.storageAccessKey_ } }
      await fetch(deleteUrl, options);
    } catch (error) {
      throw error
    }
  }

  async getUploadStreamDescriptor({
    name,
    ext,
    isPrivate = true,
  }
  ) {
    const filePath = `${this.storageEndpoint_}/${this.storageZoneName_}/${this.storagePath_ ? this.storagePath_ + '/' : ''}${name}.${ext}`
    const downloadFilePath = `${this.pullZoneDomain_}/${this.storagePath_}/${name}.${ext}`;
    const pass = new stream.PassThrough();

    const options = {
      method: 'PUT',
      headers: { 'content-type': 'application/octet-stream', AccessKey: this.storageAccessKey_ },
      body: pass
    };

    return {
      writeStream: pass,
      promise: fetch(filePath, options),
      url: `${downloadFilePath}`,
      fileKey: downloadFilePath,
    }
  }

  async getPresignedDownloadUrl({
    fileKey,
  }
  ) {
    return `${fileKey}`
  }

  async uploadProtected(
    file
  ) {
    const filePath = `${this.storageEndpoint_}/${this.storageZoneName_}/${this.storagePath_ ? this.storagePath_ + '/' : ''}${file.originalname}`;
    const readStream = fs.createReadStream(file.path);

    const options = {
      method: 'PUT',
      headers: { 'content-type': 'application/octet-stream', AccessKey: this.storageAccessKey_ },
      body: readStream
    };

    await fetch(filePath, options);
    const uploadedUrl = `${this.pullZoneDomain_}/${this.storagePath_}/${file.originalname}`
    return {
      url: `${uploadedUrl}`,
      key: `${uploadedUrl}`,
    }
  }

  async getDownloadStream({
    fileKey,
    isPrivate = true,
  }
  ) {
    const readStream = await getReadStreamFromCDN(fileKey)
    return readStream
  }
}

export default BunnyFileService
