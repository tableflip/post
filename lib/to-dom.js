// Thanks SO: http://stackoverflow.com/questions/9284117/inserting-arbitrary-html-into-a-documentfragment
module.exports = function (strHTML) {
  return document.createRange().createContextualFragment(strHTML)
}
