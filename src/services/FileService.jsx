import { apiRequestWrapper } from "./ApiRequestWrapper"
import httpWrapper from "./AxiosWrapper"

// 前置获取uploadId
export const fetchUploadId = (fileInfo) => {

    return apiRequestWrapper(() => httpWrapper.post('/api/file/uploadId', fileInfo))
}

// 分片文件上传
export const uploadChunkFile = (uploadFormData, onProgress) => {

    return apiRequestWrapper(() => {
        let latestUploadSize = 0
        return httpWrapper.post('/api/file/upload/chunk', uploadFormData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const progress = progressEvent.loaded - latestUploadSize
                    onProgress(progress)
                    latestUploadSize = progressEvent.loaded
                }
            }
        })
    })
}

// 根据uploadId获取访问的url
export const fetchAccessUrl = (uploadId) => {

    return apiRequestWrapper(() => httpWrapper.get('/api/file/accessUrl', {
        params: {
            uploadId: uploadId
        }
    }))
}


export const simpleUploadFile = (formData, onProgress) => {

    return apiRequestWrapper(() => {
        let latestUploadSize = 0
        return httpWrapper.post('/api/file/upload/simple', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const progress = progressEvent.loaded - latestUploadSize;
                    onProgress(progress)
                    latestUploadSize = progressEvent.loaded;
                }
            }
        })
    })
}