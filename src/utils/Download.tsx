import { downloadByUrl } from "../services/FileService"
import IdGen from "./IdGen"


export interface DownloadOptions {
    url: string
    filename?: string
    headers?: Record<string, string>
    onProgress?: (percent: number) => void
}


export const downloadFile = async ({
    url,
    filename,
    onProgress,
}: DownloadOptions): Promise<void> => {
    try {
        // const response = await downloadByUrl(url, onProgress)
        // if (response.status !== 200) {
        //     throw new Error(`下载失败: ${response.statusText}`)
        // }
        // if (!filename) {
        //     filename = IdGen.nextId()
        // }
        // const contentType = response.headers['content-type']
        // const fileExtension = getFileExtensionFromContentType(contentType)
        // if (!filename.includes('.')) {
        //     filename = `${filename}.${fileExtension}`;
        // }
        // const blob = await response.data
        // const objectUrl = URL.createObjectURL(blob)
        triggerDownload(url, filename || extractFileName(url))
        // URL.revokeObjectURL(objectUrl)
    } catch (err) {
        throw err
    }
}

const triggerDownload = (url: string, filename: string) => {
    const downloadUrl = url.includes('?') ? `${url}&type=d` : `${url}?type=d`
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

const extractFileName = (url: string): string => {
    try {
        const pathname = new URL(url, window.location.origin).pathname
        const name = pathname.split('/').pop()
        return name || 'download'
    } catch {
        return 'download'
    }
}

const getFileExtensionFromContentType = (contentType: string): string => {
    const extensionMap: { [key: string]: string } = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/gif': 'gif',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/zip': 'zip',
        'application/octet-stream': 'bin',
        'text/plain': 'txt',
        'video/mp4': 'mp4',
        'audio/x-hx-aac-adts': 'aac'
    };

    return extensionMap[contentType] || 'bin'; // 默认 'bin' 扩展名
};