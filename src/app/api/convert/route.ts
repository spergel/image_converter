import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const convertTo = formData.get('convertTo') as string

  if (!file || !convertTo) {
    return NextResponse.json({ error: 'File and conversion format are required' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    let convertedBuffer: Buffer

    switch (convertTo) {
      case 'jpg':
      case 'jpeg':
        convertedBuffer = await sharp(buffer).jpeg().toBuffer()
        break
      case 'png':
        convertedBuffer = await sharp(buffer).png().toBuffer()
        break
      case 'webp':
        convertedBuffer = await sharp(buffer).webp().toBuffer()
        break
      case 'gif':
        convertedBuffer = await sharp(buffer).gif().toBuffer()
        break
      default:
        return NextResponse.json({ error: 'Unsupported conversion format' }, { status: 400 })
    }

    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': `image/${convertTo}`,
        'Content-Disposition': `attachment; filename="converted.${convertTo}"`,
      },
    })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json({ error: 'File conversion failed' }, { status: 500 })
  }
}