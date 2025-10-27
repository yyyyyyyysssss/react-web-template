import { Button, Flex, Progress, theme, Tooltip, Typography, Upload, UploadFile, UploadProps } from "antd"
import { fetchAccessUrl, fetchUploadId, simpleUploadFile, uploadChunkFile } from "../../services/FileService";
import {
    LoadingOutlined,
    PlusOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FileZipOutlined,
    FileOutlined,
    DownloadOutlined
} from '@ant-design/icons'
import pLimit from 'p-limit';
import './index.css'
import { useEffect, useMemo, useState } from "react";
import {
    CircularProgressbar,
    buildStyles
} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css'
import { getMessageApi } from "../../utils/MessageUtil";
import { downloadFile } from "../../utils/download";
import { UploadFileStatus, UploadListType } from "antd/es/upload/interface";

interface SmartUploadProps {
    children: React.ReactNode; // 确保 children 作为外部传递
    onProgress?: (totalSize: number, progress: number, progressPercentage: number) => void
    onSuccess?: (accessUrl: any) => void
    onError?: (error: any) => void
    listType: UploadListType
    value: Array<string>
    onChange: (urls: Array<string>) => void
}

// 每块5M
const SLICE_SIZE = 1024 * 1024 * 5;

const SmartUpload: React.FC<SmartUploadProps & Partial<UploadProps>> = ({ children, onProgress, onSuccess, onError, listType = 'picture-card', value, onChange, ...uploadProps }) => {

    const [fileList, setFileList] = useState<UploadFile[]>([])

    const [downloading, setDownloading] = useState(false)

    const { token } = theme.useToken()

    const limit = useMemo(() => pLimit(5), [])

    const files = useMemo(() => {
        return value?.map((url: string, index: number) => {
            const fileName = url?.split('/').pop()?.split('?')[0]
            return {
                uid: `-${index}`,
                name: fileName || `file-${index}`,
                status: 'done' as UploadFileStatus,
                url: url,
            };
        });
    }, [value])

    useEffect(() => {
        setFileList((prev): any => {
            const newFiles = prev.filter((file: any) => file.status !== 'done')
            return [...files, ...newFiles]
        })
    }, [files])

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

    const handleCustomRequest = async (options: any) => {
        const file = options.file
        const uploadId = (file as any).metadata?.uploadId
        const totalSize = file.size
        const filename = file.name

        let currentProgress = 0
        const progressCallback = (delta: number) => {
            // 由于progress包含了每次上传请求的所有内容的累积大小 不仅仅是当前分片的大小 所以累加后会超过总文件大小
            currentProgress += delta
            const progressPercentage = Math.min((currentProgress / totalSize) * 100, 100)
            options.onProgress({ percent: progressPercentage })
            onProgress?.(totalSize, currentProgress, progressPercentage)
        }
        try {
            // uploadId不为空表示分片上传 否则普通上传
            let accessUrl: string
            if (uploadId) {
                const chunks = splitFile(file, SLICE_SIZE)
                const promises = chunks.map((chunk, index) => limit(async () => {
                    console.log(`第${index + 1}块正在上传,当前块大小：${(chunk.size / (1024 * 1024)).toFixed(2)}MB,起始偏移量：${index * SLICE_SIZE} 结束偏移量：${index * SLICE_SIZE + chunk.size}`)
                    const uploadFormData = new FormData()
                    uploadFormData.append("uploadId", uploadId)
                    uploadFormData.append("chunkSize", SLICE_SIZE.toString())
                    uploadFormData.append("chunkIndex", index.toString())
                    uploadFormData.append("filename", filename)
                    uploadFormData.append("file", chunk)
                    await uploadChunkFile(uploadFormData, progressCallback)
                }))
                const results = await Promise.allSettled(promises)
                results.forEach((result, index) => {
                    if (result.status === 'rejected') {
                        console.log(`第${index + 1}块上传失败，失败原因：${result.reason}`)
                    }
                })
                accessUrl = await fetchAccessUrl(uploadId)
            } else {
                const formData = new FormData()
                formData.append("file", file)
                accessUrl = await simpleUploadFile(formData, progressCallback)
            }
            onSuccess?.(accessUrl)
            options.onSuccess(accessUrl)
        } catch (error) {
            onError?.(error)
            options.onError(error)
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

    const handleChange = (info: any) => {
        const newFileList = info.fileList.map((file: any) => {
            if (file.status === 'done') {
                const url = file.url || file.response
                file.url = url
            }
            return file
        })
        setFileList(newFileList)
        const { status } = info.file
        if (status === 'done') {
            const f = newFileList
                .filter((file: any) => file.status === 'done')
                .map((file: any) => file.url)
            onChange?.(f)
        }
    }


    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
        </button>
    )

    const renderItem = (originNode: React.ReactElement, file: UploadFile) => {
        if (file.status === 'uploading') {
            const percent = Math.round(file.percent || 0)
            if (listType == 'picture-card' || listType == 'picture-circle') {
                const isCircle = listType === 'picture-circle'
                return (
                    <div
                        className="ant-upload-list-item ant-upload-list-item-uploading"
                        style={{
                            width: 100,
                            height: 100,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: `1px dashed ${token.colorBorder}`,
                            borderRadius: isCircle ? '50%' : token.borderRadiusLG,
                            background: token.colorBgContainer,
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ width: 60, height: 60 }}>
                            <CircularProgressbar
                                value={percent}
                                text={`${percent}%`}
                                styles={buildStyles({
                                    textSize: '28px',
                                    pathColor: token.colorPrimary,
                                    textColor: token.colorPrimary,
                                    trailColor: token.colorFillTertiary
                                })}
                            />
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="ant-upload-list-item ant-upload-list-item-uploading" style={{ overflow: 'visible', paddingBottom: 8, }}>
                        <Flex gap={6} justify="center" align="center" style={{ width: '100%' }}>
                            <Progress
                                percent={percent}
                                size="small"
                                showInfo={false}
                                strokeColor={token.colorPrimary}
                                style={{ width: '100%' }}
                            />
                            <span style={{ fontSize: 12, color: token.colorTextDescription }}>
                                {percent}%
                            </span>
                        </Flex>
                    </div>
                )
            }
        }
        return originNode
    }

    const renderIcon = (file: UploadFile, listType?: string) => {
        const fileType = (file.type || '').toLowerCase()
        const fileName = (file.name || '').toLowerCase()
        if (fileType.startsWith('image/') || /\.(png|jpg|jpeg|gif|bmp|webp|svg)$/.test(fileName)) {
            return <FileImageOutlined style={{ fontSize: 24 }} />
        }
        if (fileType === 'application/pdf' || /\.pdf$/.test(fileName)) {
            return <FilePdfOutlined style={{ fontSize: 24 }} />
        }
        if (fileType.includes('word') || /\.(doc|docx)$/.test(fileName)) {
            return <FileWordOutlined style={{ fontSize: 24 }} />
        }
        if (fileType.includes('excel') || /\.(xls|xlsx|csv)$/.test(fileName)) {
            return <FileExcelOutlined style={{ fontSize: 24 }} />
        }
        if (fileType.includes('powerpoint') || /\.(ppt|pptx)$/.test(fileName)) {
            return <FilePptOutlined style={{ fontSize: 24 }} />
        }
        if (fileType.includes('text/plain') || /\.(txt|md|log)$/.test(fileName)) {
            return <FileTextOutlined style={{ fontSize: 24 }} />
        }
        if (/\.(zip|rar|7z|tar|gz)$/.test(fileName)) {
            return <FileZipOutlined style={{ fontSize: 24 }} />
        }
        return <FileOutlined style={{ fontSize: 24 }} />
    }

    const handleDownload = async (e: React.MouseEvent, file: UploadFile) => {
        e.stopPropagation()
        const url = file.url || file.response
        if (!url) {
            getMessageApi().warning('暂无可下载的文件')
            return
        }
        try {
            setDownloading(true)
            await downloadFile({ url: url, filename: file.name })
        } catch (error) {
            console.error(error)
            getMessageApi().error('下载失败')
        } finally {
            setDownloading(false)
        }
    }

    return (
        <Upload
            listType={listType}
            beforeUpload={handleBeforeUpload}
            customRequest={handleCustomRequest}
            onChange={handleChange}
            fileList={fileList}
            itemRender={renderItem}
            iconRender={renderIcon}
            showUploadList={{
                showRemoveIcon: true, // 默认删除
                showPreviewIcon: true, // 默认预览
                showDownloadIcon: true, // 启用下载图标
                downloadIcon: (file) => (
                    <Tooltip title="下载">
                        <Typography.Link
                            onClick={(e) => handleDownload(e, file)}
                        >
                            {downloading ?
                                (
                                    <LoadingOutlined />
                                )
                                :
                                (
                                    <DownloadOutlined />
                                )}
                        </Typography.Link>
                    </Tooltip>
                )
            }}
            {...uploadProps}
        >
            {uploadProps.maxCount && fileList?.length >= uploadProps.maxCount ? null : uploadButton}
        </Upload>
    )
}

export default SmartUpload 