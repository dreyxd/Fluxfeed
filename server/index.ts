import 'dotenv/config'
import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'

// Use global fetch (Node 18+)

const PORT = Number(process.env.PORT || 8787)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini'
const CRYPTONEWS_API_KEY = process.env.CRYPTONEWS_API_KEY || ''

const app = express()
app.use(cors())
app.use(express.json())

// Utilities
type Sentiment = 'bullish' | 'bearish'
type NewsItem = {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  tickers: string[]
  sentiment?: Sentiment
  score?: number
}

type AnalyzeRequest = {
  ticker: string
  tf: '15m'|'1h'|'4h'|'1d'
  sinceMinutes?: number
  news?: Array<Pick<NewsItem,'title'|'source'|'sentiment'|'score'|'publishedAt'>>
}

function minutesToMs(min: number) { return min * 60 * 1000 }

function mapTickerToPair(ticker: string) {
  const map: Record<string,string> = {
    BTC: 'BTCUSDT', ETH: 'ETHUSDT', BNB: 'BNBUSDT', SOL: 'SOLUSDT', XRP: 'XRPUSDT', ADA: 'ADAUSDT',
    DOGE: 'DOGEUSDT', AVAX: 'AVAXUSDT', TRX: 'TRXUSDT', DOT: 'DOTUSDT', LINK: 'LINKUSDT', MATIC: 'MATICUSDT',
    LTC: 'LTCUSDT', BCH: 'BCHUSDT', TON: 'TONUSDT', ARB: 'ARBUSDT', OP: 'OPUSDT', ATOM: 'ATOMUSDT', APT: 'APTUSDT'
  }
  return map[ticker] || `${ticker}USDT`
}

// Fetch latest crypto news by one or more tickers from CryptoNews API
async function fetchCryptoNews(tickers: string | string[], sinceMinutes = 1440, opts?: { sentiment?: 'positive'|'negative'|'neutral', items?: number, page?: number }): Promise<NewsItem[]> {
  if (!CRYPTONEWS_API_KEY) return []
  const list = Array.isArray(tickers) ? tickers : [tickers]
  const url = new URL('https://cryptonews-api.com/api/v1')
  // Use tickers-only for a single ticker, tickers-include for multiple
  if (list.length === 1) {
    url.searchParams.set('tickers-only', list[0])
  } else {
    url.searchParams.set('tickers-include', list.join(','))
  }
  url.searchParams.set('items', String(opts?.items || 50))
  url.searchParams.set('page', String(opts?.page || 1))
  if (opts?.sentiment) {
    url.searchParams.set('sentiment', opts.sentiment)
  }
  url.searchParams.set('token', CRYPTONEWS_API_KEY)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`CryptoNews API error ${res.status}`)
  const data = await res.json() as any
  const articles: any[] = data?.data || data?.news || []
  const mapped: NewsItem[] = articles.map((a) => {
    const id = String(a.news_url || a.id || a.url || crypto.randomUUID())
    const title = a.title
    const source = a.source_name || a.source || 'Unknown'
    const urlA = a.news_url || a.url
    const publishedAt = a.date || a.published_at || new Date().toISOString()
    const ticks = Array.isArray(a.tickers) ? a.tickers : (typeof a.ticker === 'string' ? [a.ticker] : list)
    // Provider sentiment mapping if present
    let sentiment: Sentiment | undefined
    let score: number | undefined
    const prov = typeof a.sentiment === 'string' ? a.sentiment.toLowerCase() : undefined
    if (prov === 'positive') { sentiment = 'bullish'; score = 0.3 }
    else if (prov === 'negative') { sentiment = 'bearish'; score = -0.3 }
    else if (prov === 'neutral') { sentiment = undefined; score = 0 }
    return { id, title, source, url: urlA, publishedAt, tickers: ticks, sentiment, score }
  })
  // Filter by since window server-side as well
  const cutoff = Date.now() - minutesToMs(sinceMinutes)
  return mapped.filter(m => new Date(m.publishedAt).getTime() >= cutoff)
}

// OpenAI classification helper
async function classifySentimentOpenAI(texts: string[]): Promise<{ sentiment: Sentiment; score: number }[]> {
  if (!OPENAI_API_KEY) {
    // Heuristic fallback: simple keywords
    return texts.map((t) => {
      const low = t.toLowerCase()
      const pos = ['surge', 'rally', 'inflow', 'buy', 'support', 'breakout']
      const neg = ['hack', 'dump', 'sell', 'ban', 'lawsuit', 'crash']
      const score = (pos.some((k)=>low.includes(k)) ? 0.4 : 0) - (neg.some((k)=>low.includes(k)) ? 0.4 : 0)
      return { sentiment: score >= 0 ? 'bullish' : 'bearish', score }
    })
  }
  // Use OpenAI responses API (compatible prompt)
  // Some OpenAI SDKs don't support this shape; we'll use a plain fetch to /v1/classifications if available
  // Fallback to chat prompt
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You label crypto headlines as bullish or bearish for the mentioned tickers. Respond with pure JSON only: an array with same length as input; each element is {"sentiment":"bullish"|"bearish","score":number between -1 and 1}.' },
          { role: 'user', content: JSON.stringify(texts) },
        ],
        temperature: 0,
        response_format: { type: 'json_object' }
      })
    })
    const json = await res.json()
    let content = json?.choices?.[0]?.message?.content || '[]'
    // If the assistant returned an object, try to find an array in it
    if (content.trim().startsWith('{')) {
      const arrMatch = content.match(/\[[\s\S]*\]/)
      if (arrMatch) content = arrMatch[0]
    }
    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch {
      // Heuristic fallback if JSON fails
      return texts.map((t) => {
        const low = t.toLowerCase()
        const pos = ['surge', 'rally', 'inflow', 'buy', 'support', 'breakout', 'partnership', 'approval', 'growth', 'record']
        const neg = ['hack', 'dump', 'sell', 'ban', 'lawsuit', 'crash', 'exploit', 'delist', 'outflow', 'fine']
        const score = (pos.some((k)=>low.includes(k)) ? 0.35 : 0) - (neg.some((k)=>low.includes(k)) ? 0.45 : 0)
        return { sentiment: score >= 0 ? 'bullish' : 'bearish', score }
      })
    }
    // Normalize and cap output length
    const out: { sentiment: Sentiment; score: number }[] = []
    for (let i = 0; i < texts.length; i++) {
      const it = parsed[i]
      const sRaw = String(it?.sentiment || 'bullish').toLowerCase()
      const sentiment: Sentiment = sRaw === 'bearish' ? 'bearish' : 'bullish'
      let score = Number(it?.score)
      if (!Number.isFinite(score)) score = sentiment === 'bullish' ? 0.1 : -0.1
      out.push({ sentiment, score: Math.max(-1, Math.min(1, score)) })
    }
    return out
  } catch (e) {
    // Heuristic fallback on error
    return texts.map((t) => {
      const low = t.toLowerCase()
      const pos = ['surge', 'rally', 'inflow', 'buy', 'support', 'breakout']
      const neg = ['hack', 'dump', 'sell', 'ban', 'lawsuit', 'crash']
      const score = (pos.some((k)=>low.includes(k)) ? 0.4 : 0) - (neg.some((k)=>low.includes(k)) ? 0.5 : 0)
      return { sentiment: score >= 0 ? 'bullish' : 'bearish', score }
    })
  }
}

// Compute features from an array of closing prices
function computeFeaturesFromCloses(closes: number[]) {
  const last = closes.at(-1) || 0
  const first = closes[0] || 0
  const changePct = first ? ((last - first) / first) * 100 : 0
  const smaLen = 20
  const slice = closes.slice(-smaLen)
  const denom = Math.max(1, slice.length)
  const sma = slice.reduce((a,b)=>a+b,0) / denom
  const momentum = sma ? ((last - sma) / sma) * 100 : 0
  const rets = closes.slice(1).map((c,i)=> (c - closes[i]) / closes[i])
  const mean = rets.reduce((a,b)=>a+b,0)/Math.max(1,rets.length)
  const vol = Math.sqrt(rets.reduce((a,b)=> a + (b-mean)**2, 0) / Math.max(1, rets.length)) * 100
  return { last, changePct, momentum, vol }
}

// Fallback: CoinGecko price series (no API key required)
async function fetchPriceFeaturesCoingecko(ticker: string, tf: string) {
  const idMap: Record<string,string> = {
    BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', SOL: 'solana', XRP: 'ripple', ADA: 'cardano',
    DOGE: 'dogecoin', AVAX: 'avalanche-2', TRX: 'tron', DOT: 'polkadot', LINK: 'chainlink',
    MATIC: 'polygon-pos', LTC: 'litecoin', BCH: 'bitcoin-cash', TON: 'toncoin', ARB: 'arbitrum',
    OP: 'optimism', ATOM: 'cosmos', APT: 'aptos'
  }
  const id = idMap[ticker] || ticker.toLowerCase()
  // Map tf to days; use hourly resolution
  const daysMap: Record<string,number> = { '15m': 1, '1h': 1, '4h': 2, '1d': 7 }
  const days = daysMap[tf] || 1
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=hourly`
  const res = await fetch(url, { headers: { 'accept': 'application/json' } })
  if (!res.ok) throw new Error(`Coingecko error ${res.status}`)
  const data = await res.json() as any
  const prices: [number, number][] = data?.prices || []
  const closes = prices.map(p => Number(p[1])).filter(n => Number.isFinite(n))
  if (!closes.length) throw new Error('Coingecko empty prices')
  const feats = computeFeaturesFromCloses(closes)
  return { pair: `${ticker}USD`, interval: tf, ...feats, source: 'coingecko' }
}

// Fetch price candles from Binance and compute simple features, falling back to CoinGecko on errors (e.g., 451)
async function fetchPriceFeatures(ticker: string, tf: string) {
  const pair = mapTickerToPair(ticker)
  const intervalMap: Record<string,string> = { '15m':'15m','1h':'1h','4h':'4h','1d':'1d' }
  const interval = intervalMap[tf] || '1h'
  try {
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=200`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Binance error ${res.status}`)
    const klines = await res.json() as any[]
    const closes = klines.map(k => Number(k[4]))
    const feats = computeFeaturesFromCloses(closes)
    return { pair, interval, ...feats, source: 'binance' }
  } catch (e) {
    // Fallback to CoinGecko if Binance is blocked or fails
    return await fetchPriceFeaturesCoingecko(ticker, tf)
  }
}

// Aggregate news sentiment
function aggregateSentiment(items: NewsItem[]) {
  const n = items.length
  if (!n) return { avg: 0, bullish: 0, bearish: 0 }
  let sum = 0, bullish = 0, bearish = 0
  for (const it of items) {
    const s = it.score ?? 0
    sum += s
    if ((it.sentiment||'bullish') === 'bullish') bullish++
    else bearish++
  }
  return { avg: sum / n, bullish, bearish }
}

// GET /api/news?ticker=BTC&since=60
app.get('/api/news', async (req: Request, res: Response) => {
  try {
    const tickerParam = (req.query.tickers as string | undefined) || (req.query.ticker as string | undefined) || 'BTC'
    const tickers = tickerParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    const since = Number(req.query.since || 1440)
    const items = Math.min(100, Number(req.query.items || 50))
    const page = Math.max(1, Number(req.query.page || 1))
    const sentimentRaw = (req.query.sentiment as string | undefined)?.toLowerCase()
    const sentiment = (sentimentRaw === 'positive' || sentimentRaw === 'negative' || sentimentRaw === 'neutral') ? sentimentRaw : undefined
    const raw = await fetchCryptoNews(tickers, since, { sentiment: sentiment as any, items, page })
    // Classify only items missing sentiment
    const toClassifyIdx: number[] = []
    const texts: string[] = []
    raw.forEach((r, i) => { if (!r.sentiment) { toClassifyIdx.push(i); texts.push(r.title) } })
    let labels: { sentiment: Sentiment; score: number }[] = []
    if (texts.length) labels = await classifySentimentOpenAI(texts)
    const withLabels = raw.map((r, i) => {
      if (r.sentiment) return r
      const k = toClassifyIdx.indexOf(i)
      const lab = k >= 0 ? labels[k] : undefined
      return { ...r, sentiment: lab?.sentiment || 'bullish', score: lab?.score ?? 0 }
    })
    res.json({ items: withLabels })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'news_error' })
  }
})

// GET /api/signal?ticker=BTC&tf=1h&since=60
app.get('/api/signal', async (req: Request, res: Response) => {
  try {
  const ticker = String(req.query.ticker || 'BTC').toUpperCase()
    const tf = String(req.query.tf || '1h')
    const since = Number(req.query.since || 60)
    const news = await fetchCryptoNews([ticker], since)
    // Classify only missing sentiments
    const toClassifyIdx: number[] = []
    const texts: string[] = []
    news.forEach((r, i) => { if (!r.sentiment) { toClassifyIdx.push(i); texts.push(r.title) } })
    let labels: { sentiment: Sentiment; score: number }[] = []
    if (texts.length) labels = await classifySentimentOpenAI(texts)
    const labeled = news.map((r, i) => {
      if (r.sentiment) return r
      const k = toClassifyIdx.indexOf(i)
      const lab = k >= 0 ? labels[k] : undefined
      return { ...r, sentiment: lab?.sentiment || 'bullish', score: lab?.score ?? 0 }
    })
    const agg = aggregateSentiment(labeled)
    let price
    try {
      price = await fetchPriceFeatures(ticker, tf)
    } catch (e) {
      // Price feed unavailable; degrade gracefully to news-only
      price = { pair: mapTickerToPair(ticker), interval: tf, last: 0, changePct: 0, momentum: 0, vol: 0, source: 'unavailable' }
    }

    // Ask OpenAI to generate signal if key present, else heuristic
    let status: 'BUY'|'SELL'|'NEUTRAL' = 'NEUTRAL'
    let confidence = 50
    let reasons: string[] = []
    const features = { news: agg, price }

    if (OPENAI_API_KEY) {
      try {
        const prompt = `You are a trading assistant. Using the provided features, return a JSON object {status, confidence, reasons}.
status in ["BUY","SELL","NEUTRAL"]. confidence 0..100. reasons 3 bullet points.
Features: ${JSON.stringify(features)}`
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0 })
        })
        if (!resp.ok) throw new Error(`openai_${resp.status}`)
        const data = await resp.json()
        const content = data?.choices?.[0]?.message?.content || '{}'
        const parsed = JSON.parse(content)
        status = parsed.status || status
        confidence = parsed.confidence ?? confidence
        reasons = Array.isArray(parsed.reasons) ? parsed.reasons : []
      } catch (e) {
        // Fallback heuristics if OpenAI call fails
        if (features.news.avg > 0.05 && features.price.momentum > 0) { status = 'BUY'; confidence = Math.min(90, 60 + Math.round((features.news.avg*100 + features.price.momentum) / 2)) }
        else if (features.news.avg < -0.05 && features.price.momentum < 0) { status = 'SELL'; confidence = Math.min(90, 60 + Math.round((Math.abs(features.news.avg*100) + Math.abs(features.price.momentum)) / 2)) }
        else { status = 'NEUTRAL'; confidence = 45 }
        reasons = [
          `News sentiment avg ${features.news.avg.toFixed(2)} (bull:${features.news.bullish}, bear:${features.news.bearish})`,
          features.price?.source === 'unavailable' ? 'Price feed unavailable; used news-only heuristics' : `Momentum vs SMA20 ${features.price.momentum.toFixed(2)}%`,
          features.price?.source === 'unavailable' ? '—' : `Change over window ${features.price.changePct.toFixed(2)}%`
        ]
      }
    } else {
      // Heuristic fallback
      if (agg.avg > 0.05 && price.momentum > 0) { status = 'BUY'; confidence = Math.min(90, 60 + Math.round((agg.avg*100 + price.momentum) / 2)) }
      else if (agg.avg < -0.05 && price.momentum < 0) { status = 'SELL'; confidence = Math.min(90, 60 + Math.round((Math.abs(agg.avg*100) + Math.abs(price.momentum)) / 2)) }
      else { status = 'NEUTRAL'; confidence = 45 }
      reasons = [
        `News sentiment avg ${agg.avg.toFixed(2)} (bull:${agg.bullish}, bear:${agg.bearish})`,
        price?.source === 'unavailable' ? 'Price feed unavailable; used news-only heuristics' : `Momentum vs SMA20 ${price.momentum.toFixed(2)}%`,
        price?.source === 'unavailable' ? '—' : `Change over window ${price.changePct.toFixed(2)}%`
      ]
    }

    res.json({ status, confidence, reasons, features })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'signal_error' })
  }
})

// POST /api/analyze
// Body: { ticker, tf, sinceMinutes, news?: [{ title, source, sentiment, score, publishedAt }] }
// Returns: trade plan with entry/stop/take, confidence, chart + news reasons, and a short sentiment summary
app.post('/api/analyze', async (req: Request, res: Response) => {
  try {
    const body = req.body as AnalyzeRequest
    const ticker = String(body.ticker || 'BTC').toUpperCase()
    const tf = (body.tf || '1h') as '15m'|'1h'|'4h'|'1d'
    const since = Number(body.sinceMinutes || 60)

    // Use provided news if present; otherwise fetch
    let news: NewsItem[]
    if (Array.isArray(body.news) && body.news.length) {
      news = body.news.map((n, idx) => ({
        id: String(idx),
        title: n.title,
        source: n.source,
        url: '',
        publishedAt: n.publishedAt || new Date().toISOString(),
        tickers: [ticker],
        sentiment: n.sentiment,
        score: n.score,
      }))
    } else {
      news = await fetchCryptoNews([ticker], since)
    }

    // Classify only missing
    const toClassifyIdx: number[] = []
    const texts: string[] = []
    news.forEach((r, i) => { if (!r.sentiment) { toClassifyIdx.push(i); texts.push(r.title) } })
    let labels: { sentiment: Sentiment; score: number }[] = []
    if (texts.length) labels = await classifySentimentOpenAI(texts)
    const labeled = news.map((r, i) => {
      if (r.sentiment) return r
      const k = toClassifyIdx.indexOf(i)
      const lab = k >= 0 ? labels[k] : undefined
      return { ...r, sentiment: lab?.sentiment || 'bullish', score: lab?.score ?? 0 }
    })

    const agg = aggregateSentiment(labeled)
    let price
    try {
      price = await fetchPriceFeatures(ticker, tf)
    } catch (e) {
      price = { pair: mapTickerToPair(ticker), interval: tf, last: 0, changePct: 0, momentum: 0, vol: 0, source: 'unavailable' }
    }

    // Generate plan
    let status: 'BUY'|'SELL'|'NEUTRAL' = 'NEUTRAL'
    let confidence = 50
    const volFrac = Math.min(0.02, Math.max(0.005, Math.abs(price.vol) / 100)) // 0.5%..2%
    let entry = price.last
    let stop = price.last
    let take = price.last
    let chartReasons: string[] = []
    let newsReasons: string[] = []

    const newsSkew = agg.bullish - agg.bearish
    const newsSentimentSummary = `News skew: bullish ${agg.bullish} vs bearish ${agg.bearish}, avg ${agg.avg.toFixed(2)}`

    const features = { price, agg, newsTop: labeled.slice(0, 8).map(n => ({ t: n.title, s: n.sentiment, sc: n.score })) }

    if (OPENAI_API_KEY) {
      try {
        const prompt = `You are a crypto trading assistant. Using features below, propose a trade plan as JSON:
{
  "action": "LONG"|"SHORT"|"NEUTRAL",
  "entryPrice": number,
  "stopLoss": number,
  "takeProfit": number,
  "confidence": 0-100,
  "chartReasons": string[2..3],
  "newsReasons": string[2..3],
  "sentimentSummary": string
}
Features: ${JSON.stringify(features)}
Guidelines: If momentum>0 and news avg>0 -> LONG; if momentum<0 and news avg<0 -> SHORT; else NEUTRAL. Entry ~ last price. Risk/reward ~ 1:2 using volatility as guide.`
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify({ model: OPENAI_MODEL, messages: [{ role: 'user', content: prompt }], temperature: 0 })
        })
        if (!resp.ok) throw new Error(`openai_${resp.status}`)
        const data = await resp.json()
        const content = data?.choices?.[0]?.message?.content || '{}'
        const parsed = JSON.parse(content)
        status = (parsed.action === 'SHORT') ? 'SELL' : (parsed.action === 'LONG' ? 'BUY' : 'NEUTRAL')
        confidence = Number(parsed.confidence ?? confidence)
        entry = Number(parsed.entryPrice ?? entry)
        stop = Number(parsed.stopLoss ?? stop)
        take = Number(parsed.takeProfit ?? take)
        chartReasons = Array.isArray(parsed.chartReasons) ? parsed.chartReasons : []
        newsReasons = Array.isArray(parsed.newsReasons) ? parsed.newsReasons : []
        const sentimentSummary = String(parsed.sentimentSummary || newsSentimentSummary)
        return res.json({
          status,
          confidence,
          entryPrice: entry,
          stopLoss: stop,
          takeProfit: take,
          chartReasons,
          newsReasons,
          sentimentSummary,
          features: { price, news: agg }
        })
      } catch (e) {
        // fall through to heuristic
      }
    }

    // Heuristic fallback
  if (agg.avg > 0.05 && price.momentum > 0) { status = 'BUY'; confidence = Math.min(88, 60 + Math.round((agg.avg*100 + price.momentum)/2)) }
  else if (agg.avg < -0.05 && price.momentum < 0) { status = 'SELL'; confidence = Math.min(88, 60 + Math.round((Math.abs(agg.avg*100) + Math.abs(price.momentum))/2)) }
    else { status = 'NEUTRAL'; confidence = 45 }
    if (status === 'BUY') {
      entry = price.last
      stop = entry * (1 - volFrac)
      take = entry * (1 + 2*volFrac)
      chartReasons = [
        price?.source === 'unavailable' ? 'Price feed unavailable; entry set to last known or market' : `Price above SMA20 by ${price.momentum.toFixed(2)}%`,
        price?.source === 'unavailable' ? 'Using default risk sizing due to missing volatility' : `Volatility ~ ${price.vol.toFixed(2)}% suggests ${Math.round(volFrac*100)}bp stop, 2R target`
      ]
    } else if (status === 'SELL') {
      entry = price.last
      stop = entry * (1 + volFrac)
      take = entry * (1 - 2*volFrac)
      chartReasons = [
        price?.source === 'unavailable' ? 'Price feed unavailable; entry set to last known or market' : `Price below SMA20 by ${Math.abs(price.momentum).toFixed(2)}%`,
        price?.source === 'unavailable' ? 'Using default risk sizing due to missing volatility' : `Volatility ~ ${price.vol.toFixed(2)}% suggests ${Math.round(volFrac*100)}bp stop, 2R target`
      ]
    } else {
      entry = price.last
      stop = price.last
      take = price.last
      chartReasons = [price?.source === 'unavailable' ? 'Price feed unavailable; awaiting price data for chart-based decision' : `Mixed momentum (${price.momentum.toFixed(2)}%) and change (${price.changePct.toFixed(2)}%)`]
    }
    newsReasons = [
      `${agg.bullish} bullish vs ${agg.bearish} bearish headlines`,
      `Average news score ${agg.avg.toFixed(2)}`
    ]
    return res.json({
      status,
      confidence,
      entryPrice: entry,
      stopLoss: stop,
      takeProfit: take,
      chartReasons,
      newsReasons,
      sentimentSummary: newsSentimentSummary,
      features: { price, news: agg }
    })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'analyze_error' })
  }
})

// GET /api/news/general?items=10&page=1
app.get('/api/news/general', async (req: Request, res: Response) => {
  try {
    if (!CRYPTONEWS_API_KEY) return res.json({ items: [] })
    const items = Math.min(100, Number(req.query.items || 12))
    const page = Math.max(1, Number(req.query.page || 1))
    const url = new URL('https://cryptonews-api.com/api/v1/category')
    url.searchParams.set('section', 'general')
    url.searchParams.set('items', String(items))
    url.searchParams.set('page', String(page))
    url.searchParams.set('token', CRYPTONEWS_API_KEY)
    const resApi = await fetch(url.toString())
    if (!resApi.ok) throw new Error(`CryptoNews general error ${resApi.status}`)
    const data = await resApi.json() as any
    const articles: any[] = data?.data || data?.news || []
    const mapped: NewsItem[] = articles.map((a) => ({
      id: String(a.news_url || a.id || a.url || crypto.randomUUID()),
      title: a.title,
      source: a.source_name || a.source || 'Unknown',
      url: a.news_url || a.url,
      publishedAt: a.date || a.published_at || new Date().toISOString(),
      tickers: Array.isArray(a.tickers) ? a.tickers : (typeof a.ticker === 'string' ? [a.ticker] : []),
    }))
    // Basic quality filter: valid URL and known source
    const filtered = mapped.filter(m => m.url && m.url.startsWith('http') && m.source && m.source !== 'Unknown')
    // Classify for bullish/bearish split on landing too
    const labels = await classifySentimentOpenAI(filtered.map(r => r.title))
    const labeled = filtered.map((r, i) => ({ ...r, sentiment: labels[i]?.sentiment || 'bullish', score: labels[i]?.score ?? 0 }))
    res.json({ items: labeled })
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'general_error' })
  }
})

// GET /api/tickersdb - proxy to CryptoNews tickers db (note: rate-limited)
app.get('/api/tickersdb', async (_req: Request, res: Response) => {
  try {
    if (!CRYPTONEWS_API_KEY) return res.json({ items: [] })
    const url = new URL('https://cryptonews-api.com/api/v1/account/tickersdbv2')
    url.searchParams.set('token', CRYPTONEWS_API_KEY)
    const r = await fetch(url.toString())
    if (!r.ok) throw new Error(`tickersdb_${r.status}`)
    const json = await r.json()
    res.json(json)
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'tickersdb_error' })
  }
})

// Simple health endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
