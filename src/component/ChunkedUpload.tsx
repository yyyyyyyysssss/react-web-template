import { Upload, UploadProps } from "antd"
import { fetchAccessUrl, fetchUploadId, simpleUploadFile, uploadChunkFile } from "../services/FileService";

interface ChunkedUploadProps extends UploadProps {
    children: React.ReactNode; // 确保 children 作为外部传递
    onProgress?: (totalSize: number, progress: number, progressPercentage: number) => void
    onSuccess?: (accessUrl: any) => void
    onError?: (error: any) => void
}

// 每块5M
const SLICE_SIZE = 1024 * 1024 * 5;

const ChunkedUpload: React.FC<ChunkedUploadProps> = ({ children, onProgress, onSuccess, onError, ...uploadProps }) => {


    const handleBeforeUpload = async (file: File) => {
        // 小于10m的使用普通上传 不获取uploadId
        if (file.size < SLICE_SIZE * 2) {
            return true
        }
        const totalChunk = getTotalChunk(file, SLICE_SIZE);
        const fileInfo = {
            filename: file.name,
            fileType: file.type,
            totalSize: file.size,
            totalChunk: totalChunk,
            chunkSize: SLICE_SIZE
        }
        console.log(`文件名称: ${fileInfo.filename}; 文件总大小: ${(fileInfo.totalSize / (1024 * 1024)).toFixed(2)}MB; 总块数: ${totalChunk}`);
        try {
            const uploadId = await fetchUploadId(fileInfo)
            if (uploadId) {
                (file as any).metadata = { uploadId }
                return true
            }
        } catch (err) {
            onError?.(err)
            return false
        }
    }

    const handleCustomRequest = async ({ file }: any) => {
        const uploadId = (file as any).metadata?.uploadId
        const totalSize = file.size
        const filename = file.name

        let currentProgress = 0
        const progressCallback = (progress: number) => {
            // 由于progress包含了每次上传请求的所有内容的累积大小 不仅仅是当前分片的大小 所以累加后会超过总文件大小
            currentProgress += progress
            const progressPercentage = Math.min((currentProgress / totalSize) * 100, 100);
            onProgress?.(totalSize, currentProgress, progressPercentage)
        }

        // uploadId不为空表示分片上传 否则普通上传
        if (uploadId) {
            const chunks = splitFile(file, SLICE_SIZE)
            const totalChunk = chunks.length
            const chunkPromises: Promise<void>[] = []
            let index = 0

            for (const chunk of chunks) {
                console.log(`第${index + 1}块正在上传,当前块大小:${(chunk.size / (1024 * 1024)).toFixed(2)}MB,起始偏移量: ${index * SLICE_SIZE} 结束偏移量: ${index * SLICE_SIZE + chunk.size}`)
                const uploadFormData = new FormData()
                uploadFormData.append("uploadId", uploadId)
                uploadFormData.append("totalSize", totalSize)
                uploadFormData.append("totalChunk", totalChunk.toString())
                uploadFormData.append("chunkSize", SLICE_SIZE.toString())
                uploadFormData.append("chunkIndex", index.toString())
                uploadFormData.append("filename", filename)
                uploadFormData.append("file", chunk)
                const uploadPromise = uploadChunkFile(uploadFormData, progressCallback)
                    .catch((error) => {
                        onError?.(error)
                    })
                chunkPromises.push(uploadPromise)
                index++
            }
            await Promise.all(chunkPromises)
            try {
                const accessUrl = await fetchAccessUrl(uploadId)
                onSuccess?.(accessUrl)
            } catch (error) {
                onError?.(error)
            }

        } else {
            const formData = new FormData()
            formData.append("file", file)
            try {
                const accessUrl = await simpleUploadFile(formData,progressCallback)
                onSuccess?.(accessUrl)
            } catch (error) {
                onError?.(error)
            }
        }

    }

    // 文件分片
    const splitFile = (file: File, chunkSize: any) => {
        const chunks: Blob[] = [];
        const totalChunks = getTotalChunk(file, chunkSize)
        for (let i = 0; i < totalChunks; i++) {
            const s = i * chunkSize
            const e = Math.min(file.size, s + chunkSize)
            const chunk = file.slice(s, e)
            chunks.push(chunk)
        }
        return chunks
    }

    // 获取分片个数
    const getTotalChunk = (file: File, chunkSize: number): number => {

        return Math.ceil(file.size / chunkSize)
    }

    return (
        <Upload
            beforeUpload={handleBeforeUpload}
            customRequest={handleCustomRequest}
            {...uploadProps}
        >
            {children}
        </Upload>
    )
}

export default ChunkedUpload 