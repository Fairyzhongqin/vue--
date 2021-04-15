import request from '@/utils/request'

export function  listAllJob(data = {}) {
  return request({
    url: '/aj/job/listAllJob',
    method: 'POST',
    data
  })
}
export function pauseJob (data = {}) {
  return request({
    url: '/aj/job/pauseJob',
    method: 'POST',
    data
  })
}


export function resumeJob (data = {}) {
  return request({
    url: '/aj/job/resumeJob',
    method: 'POST',
    data
  })
}


export function deleteJob (data = {}) {
  return request({
    url: '/aj/job/deleteJob',
    method: 'POST',
    data
  })
}

export function addJob (data = {}) {
  return request({
    url: '/aj/job/addJob',
    method: 'POST',
    data
  })
}


export function updateJob (data = {}) {
  return request({
    url: '/aj/job/updateJob',
    method: 'POST',
    data
  })
}

