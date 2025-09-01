import type { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosRequestConfig } from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const targetUrl = req.query.url as string

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Parâmetro `url` inválido ou ausente.' })
  }

  try {
    const axiosConfig: AxiosRequestConfig = {
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        host: undefined,
        origin: undefined,
        referer: undefined,
      },
      data: req.body,
      responseType: 'stream',
      validateStatus: () => true
    }

    const response = await axios(axiosConfig)

    res.status(response.status)
    for (const [key, value] of Object.entries(response.headers)) {
      if (value) {
        res.setHeader(key, value)
      }
    }

    response.data.pipe(res)
  } 
  catch (error: any) {
    res.status(500).json({ error: error.message || 'Erro no proxy.' })
  }
}
