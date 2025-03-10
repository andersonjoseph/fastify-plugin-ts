const fpStackTracePattern = /at\s{1}(?:.*\.)?plugin\s{1}.*\n\s*(.*)/
const fileNamePattern = /(\w*(\.\w*)*)\..*/

export default function getPluginName (fn: Function): string {
  if (fn.name.length > 0) return fn.name

  const stackTraceLimit = Error.stackTraceLimit
  Error.stackTraceLimit = 10
  try {
    throw new Error('anonymous function')
  } catch (e) {
    if (e instanceof Error) {
      Error.stackTraceLimit = stackTraceLimit
      return extractPluginName(e.stack)
    } else throw e
  }
}

export function extractPluginName (stack: string | undefined): string {
  if (stack === undefined) {
    return 'anonymous'
  }

  const m = stack.match(fpStackTracePattern)

  if (m != null) {
    // get last section of path and match for filename
    const matches = m[1].split(/[/\\]/).slice(-1)[0].match(fileNamePattern)

    return (matches != null) ? matches[1] : 'anonymous'
  }

  return 'anonymous'
}
