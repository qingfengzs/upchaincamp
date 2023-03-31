
/**
 * 查询日志列表
 * @param {*} data 请求参数
 */
export function getTransferData(data) {
  return request({
    url: '/log/list',
    method: 'post',
    data
  })
}