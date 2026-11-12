const USM_EMAIL_REGEX = /^[A-Za-z]+([.-]?\w+)*@(?:[a-zA-Z]+\.)?usm\.my$/

const normalizeUSMEmail = (email) => {
  if (typeof email !== 'string') return null

  const normalized = email.trim().toLowerCase()

  if (normalized.length > 254 || !USM_EMAIL_REGEX.test(normalized)) {
    return null
  }

  return normalized
}

const normalizeEmailLookup = (email) => {
  if (typeof email !== 'string') return null

  const normalized = email.trim().toLowerCase()

  return normalized || null
}

module.exports = { USM_EMAIL_REGEX, normalizeUSMEmail, normalizeEmailLookup }
