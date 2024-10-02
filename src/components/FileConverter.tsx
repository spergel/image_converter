'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import Button from './ui/Button'
import { DropdownMenu, DropdownOption } from './ui/DropdownMenu'

const FileConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [convertTo, setConvertTo] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    setFile(file)
    
    // Create a preview URL for the image
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }, [])

  useEffect(() => {
    // Cleanup function to revoke the object URL when component unmounts or new file is uploaded
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleConvert = async () => {
    if (!file || !convertTo) return

    setIsConverting(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('convertTo', convertTo)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Conversion failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `converted.${convertTo}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: unknown) {
      setError((error as Error).message)
    } finally {
      setIsConverting(false)
    }
  }

  const outputOptions: DropdownOption[] = [
    { value: "jpg", label: "JPG" },
    { value: "png", label: "PNG" },
    { value: "webp", label: "WebP" },
    { value: "gif", label: "GIF" },
  ]

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <p className="text-gray-500">Drag and drop your file here</p>
          <p className="text-gray-500">or</p>
          <Button onClick={() => document.getElementById('file-input')?.click()}>
            Click to upload
          </Button>
        </div>
      </div>
      
      {previewUrl && (
        <div className="mt-4 w-full">
          <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
      
      <div className="flex w-full mt-4 space-x-2">
        <div className="flex-grow">
          <DropdownMenu
            options={outputOptions}
            onValueChange={setConvertTo}
            placeholder="Select format"
            value={convertTo}
          />
        </div>
        <Button
          onClick={handleConvert}
          disabled={!file || !convertTo || isConverting}
        >
          {isConverting ? 'Converting...' : 'Convert'}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

export default FileConverter;