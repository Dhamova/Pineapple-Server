Parse.Cloud.define('hello', req => {
  req.log.info(req)
  return 'world'
})