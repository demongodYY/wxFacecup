'use strict';

const AV = require('leanengine');
const Router = require('koa-router');
const axios = require('axios');
const fs = require('fs');
const qs = require('qs');
const koaBody = require('koa-body');

const router = new Router({prefix: '/images'});

const apiKey = 'MshFhuCYaM0s2AUmxM9JCHg_g9VZIVRo'
const apiSecret = 'gz3hFScrpEcMB9mym1xOmaKc0vAxuYbG'

const templateData = require('./images_prod.json')


//merge Image
router.post('/', koaBody({multipart: true}), async function(ctx) {
  const imgPath = ctx.request.body.files.userImage.path;
  const imgData = fs.readFileSync(imgPath);
  const imgBase64 = imgData.toString('base64');
  const templateIndex = _getIndex(imgBase64.length, templateData.length);
  const template = templateData[templateIndex];
  const templateImg = fs.readFileSync(template.img);
  const templateImgBase64 = templateImg.toString('base64');
  await _mergeFace(imgBase64, templateImgBase64).then((res) =>{
    const result  = {
      name: template.name,
      price: template.price,
      img:  res.data.result
    }
    ctx.body = result
  }).catch((err) => {
    console.log(err);
    ctx.body = 'server error';
  })
});

function _getIndex(imgLength, dataLength) {
  const dataIndex =  imgLength % dataLength;
  console.log('imglength: ' + imgLength);
  console.log('dataLength: ' + dataLength);
  console.log ('dataIndex: ' + dataIndex);
  return dataIndex;
}

async function _detectFace(base64Image) {
  const data = qs.stringify({
    api_key: apiKey,
    api_secret: apiSecret,
    image_base64: base64Image
  })
  try {
    const res = await axios.post('https://api-cn.faceplusplus.com/facepp/v3/detect', data);
    return res;
  } catch (err) {
    return err;
  }
}

async function _mergeFace (base64Image, base64Template) {
  let templateRect = ''
  await _detectFace(base64Template).then((res) => {
    const rect = res.data.faces[0].face_rectangle;
    templateRect = `${rect.top},${rect.left},${rect.width},${rect.height}`
  }).catch((err) =>{
    throw err
  })
  const data = qs.stringify({
    api_key: apiKey,
    api_secret: apiSecret,
    template_base64: base64Template,
    template_rectangle: templateRect,
    merge_base64: base64Image
  })
  try {
      const res = await axios.post('https://api-cn.faceplusplus.com/imagepp/v1/mergeface', data)
      return res
  }
  catch (err) {
    throw err
  }  
}

module.exports = router;