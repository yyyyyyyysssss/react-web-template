import { downloadByUrl } from "../services/FileService"


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
        const response = await downloadByUrl(url, onProgress)
        if (response.status !== 200) {
            throw new Error(`下载失败: ${response.statusText}`)
        }
        const blob = await response.data
        const objectUrl = URL.createObjectURL(blob)
        triggerDownload(objectUrl, filename || extractFileName(url))
        URL.revokeObjectURL(objectUrl)
    } catch (err) {
        throw err
    }
}

const triggerDownload = (objectUrl: string, filename: string) => {
    const a = document.createElement('a')
    a.href = objectUrl
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