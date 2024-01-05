const { URLSearchParams } = global

module.exports = function rewritePath (path, _params = {}) {
  const params = Object.assign({}, _params)
  let parts
  let prefix = ''
  try {
    const url = new URL(path)
    parts = [url.pathname, url.search.slice(1)]
    prefix = url.origin
  } catch (e) {
    // split path & query params
    parts = path.split('?')
  }

  // rewrite path
  const endpoint = parts[0].replace(/(\/:|:)(\w*|\d*)/g, (match, g1, g2) => {
    const value = params[g2]
    if (!value) return ''
    delete params[g2]
    return g1[0] === '/' ? `/${value}` : value
  })

  // reconstruct query params
  const qparams = new URLSearchParams()
  ;('&' + parts[1]).replace(/&(\w*|\d*)=(:)(\w*|\d*)/g, (match, g, g1, g2) => {
    const value = params[g2]
    if (!value) return
    if (Array.isArray(value)) {
      value.forEach(val => qparams.append(g, val))
    } else {
      qparams.append(g, value)
    }
    delete params[g2]
  })
  const qparamsStr = qparams.toString()
  return prefix + endpoint + (qparamsStr ? `?${qparamsStr}` : '')
}
