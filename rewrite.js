var { URLSearchParams } = global

module.exports = function rewritePath (path, params = {}) {
  // split path & query params
  var parts = path.split('?')

  // rewrite path
  var endpoint = parts[0].replace(/(\/:|:)(\w*|\d*)/g, (match, g1, g2) => {
    if (!g2) return match
    const value = params[g2]
    if (!value) return ''
    delete params[g2]
    return g1[0] === '/' ? `/${value}` : value
  })

  // reconstruct query params
  var qparams = new URLSearchParams()
  ;('&' + parts[1]).replace(/&(\w*|\d*)=(:)(\w*|\d*)/g, (match, g, g1, g2) => {
    const value = params[g2]
    if (!value) return
    delete params[g2]
    qparams.append(g, value)
  })
  var qparamsStr = qparams.toString()
  return endpoint + (qparamsStr ? `?${qparamsStr}` : '')
}
