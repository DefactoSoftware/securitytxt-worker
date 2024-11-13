/**
 * Copyright (c) 2020, Cloudflare, Inc. All rights reserved.
 * author: David Haynes <dhaynes@cloudflare.com>
 */
import pubKey from './txt/security-capp12-pubkey.txt'
import securityTxtTemplate from './txt/security.txt'
import disclosurePolicyMd from './txt/cvd.en.md'
import { marked } from 'marked' // Ensure marked is bundled in your deployment

/**
 * Generates the dynamic content for security.txt based on the request's host.
 * @param {string} host The host from the incoming request
 */
function generateSecurityTxt(host) {
  return securityTxtTemplate
    .replace(/%{host_url}/g, `https://${host}`)
}

/**
 * Handles requests based on URL paths.
 * @param {Request} request The incoming request
 */
const handleRequest = async request => {
  const url = new URL(request.url)
  const host = url.host

  if (url.pathname === '/.well-known/security.txt') {
    const securityTxt = generateSecurityTxt(host)
    return new Response(securityTxt, {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  } else if (url.pathname === '/gpg/security-capp12-pubkey.txt') {
    return new Response(pubKey, {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    })
  } else if (url.pathname === '/disclosure-policy.html') {
    const htmlContent = marked(disclosurePolicyMd)
    return new Response(htmlContent, {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  return new Response('', { status: 404 })
}

// main()
addEventListener('fetch', event => {
  event.passThroughOnException()
  event.respondWith(handleRequest(event.request))
})
