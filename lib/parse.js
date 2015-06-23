'use strict'

var parse = require('xml-parser')

/**
 * Parse an XML coming from Amazon
 *
 * @param  {String} xml
 * @return {Object}               an object with the format `{ truncated: bool, files: [String] }`
 */
module.exports = function (body) {
  var xml = parse(body)

  if (xml.root.name === 'Error') {
    throw new Error(xml.root.children[1].content)
  }

  var o = {}
  var f = xml.root.children.map(function (e, idx) {
    if (e.name.toLowerCase() === 'istruncated' && e.content.toLowerCase() === 'true') {
      o.truncated = true
    }

    // not content
    if (e.name.toLowerCase() !== 'contents') {
      return null
    }

    var obj = {}
    var child
    // get the content of the 'Key' child
    for (var i = 0; i < e.children.length; i++) {
      child = e.children[i]

      if (child.name.toLowerCase() === 'key') {
        if (idx === (xml.root.children.length - 1)) {
          o.marker = esc(child.content)
        }
      }
      if (child.name.toLowerCase() === 'owner') {
        // owner has only two children
        obj.Owner = {
          ID: child.children[0].content,
          DisplayName: child.children[1].content
        }
      } else {
        obj[child.name] = child.content.replace(/&quot;/g, '"')
      }
    }
    return obj
  })
  .filter(function (e) { return !!e })

  o.files = f

  return o
}

/**
 * Function to escape entries like S3 does
 *
 * TODO: find a cleaner way
 *
 * @api private
 */
function esc (s) {
  return s
  .replace(/\&amp\;/g, '&')
  .replace(/\+/g, '%2B')
  .replace(/ /g, '+')
  .replace(/&/g, '%26')
  .replace(/\=/g, '%3D')
}
